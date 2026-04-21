# agent迭代式手搓（一）
<PageViewCount />

> 参考https://learn.shareai.run/zh/

## 一、最基本的agent

> 循环+`bash`

agent的主要生产力来自于背后的语言大模型。大模型具有预测的能力，能够**预测**出下一个位置应该是什么字，这就是语言大模型和我们“交流”的本质。在`codex`和`claude code`尚未出现的时候，我们自己去网页询问`chatgpt`或者`claude`模型，根据他们的指示去执行，并吧结果黏贴给他们，从而使得模型能够接触到真实世界和真实结果。

现在有了类似`claude code`的`agent`，其实现原理也类似上面的过程，但是不同的是，我们不需要手动复制黏贴，而是靠模型自己去和真实世界交互，模型自己决定去调用哪些工具，再把工具调用结果加入到上下文，这就是一个简单的agent。

<img src="https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20260406213231686.png" alt="image-20260406213231686" style="zoom:50%;" />丁

**循环退出条件**：LLM不再进行工具调用，这说明模型已经开始进行总结阶段，这个时候就可以结束整个循环。

为什么只用`bash`就可以：由于 Agent 的核心任务是接收模型指令并在本地执行操作，`bash` 本身就可以覆盖几乎所有系统级操作（文件操作、启动脚本、调用工具等），所以只需提供一个通用的 Bash 执行接口，就能让模型通过指令组合完成复杂任务，而无需为每种操作单独实现额外工具。

至此，我们就完成了一个简单的agent，已经可以做到`创建文件-写入99乘法表-打开展示`这种复杂操作了，因为这些仅靠bash就能完成了。

**核心流程**

```txt
函数 agent_loop(消息列表):
    循环:
        发送消息列表给模型
        获取模型响应 message

        将 message 添加到消息历史

        如果 message 没有工具调用:
            输出 message 内容（如果有）
            结束循环

        对 message 中每个工具调用 tool_call:
            output = run_bash(tool_call)
            输出 output 的预览
            将 output 添加到消息历史，标记为 tool 响应
```



<details>
<summary>点击展开/折叠代码</summary>

```python
#!/usr/bin/env python3
import os
import json
import subprocess
from openai import OpenAI
from dotenv import load_dotenv
load_dotenv(override=True)
api_key = os.getenv('ARK_API_KEY')
base_url = "https://ark.cn-beijing.volces.com/api/v3"
model_id = os.getenv("MODEL_ID", "doubao-seed-1-8-251228")
client = OpenAI(base_url=base_url, api_key=api_key)
SYSTEM_PROMPT = f"You are a coding agent at {os.getcwd()}. Use bash to solve tasks. Act, don't explain."
TOOLS = [{"type":"function","function":{"name":"bash","description":"Run a shell command in the current directory.","parameters":{"type":"object","properties":{"command":{"type":"string","description":"The full bash command to execute"}},"required":["command"]}}}]


def run_bash(command: str) -> str:
    dangerous = ["rm -rf /", "sudo", "shutdown", "reboot", "> /dev/"]
    if any(d in command for d in dangerous):
        return "Error: Dangerous command blocked"
    try:
        r = subprocess.run(command, shell=True, cwd=os.getcwd(), capture_output=True, text=True, timeout=120)
        out = (r.stdout + r.stderr).strip()
        return out[:50000] if out else "(no output)"
    except subprocess.TimeoutExpired:
        return "Error: Timeout (120s)"


def agent_loop(messages: list):
    while True:
        response = client.chat.completions.create(model=model_id, messages=[{"role":"system","content":SYSTEM_PROMPT}]+messages, tools=TOOLS)
        message = response.choices[0].message
        messages.append(message)
        if not message.tool_calls:
            if message.content:
                print(f"\033[32mAssistant:\033[0m {message.content}")
            return
        for tool_call in message.tool_calls:
            if tool_call.function.name == "bash":
                try:
                    args = json.loads(tool_call.function.arguments)
                    cmd = args["command"]
                except Exception as e:
                    output = f"Error parsing arguments: {e}"
                    cmd = "unknown"
                print(f"\033[33m$ {cmd}\033[0m")
                output = run_bash(cmd)
                preview = output[:500]+("..." if len(output)>500 else "")
                print(preview)
                messages.append({"role":"tool","tool_call_id":tool_call.id,"name":"bash","content":output})


if __name__=="__main__":
    history=[]
    print(f"\033[35m[Agent Ready]\033[0m Model: {model_id}")
    while True:
        try:
            query=input("\033[36ms001 >> \033[0m")
        except (EOFError, KeyboardInterrupt):
            break
        if query.strip().lower() in ("q","exit",""):
            break
        history.append({"role":"user","content":query})
        agent_loop(history)
        print()
```

</details> 



## 二、维护工具集

`bash`固然强大，但是在特定的场景肯定还是不如特化的工具，比如作者提到bash的安全不受约束，以及各种小工具会有自己的问题。因此我们需要解决的问题是：

1. 特化工具调用；
2. 模型的执行应该被限制在沙箱内；

**解决方案**：专用工具 (`read_file`, `write_file`) 可以在工具层面做路径沙箱，因此我们引入新的工具，并事先告诉模型我们有哪些模型可以用，怎么用，供模型选择；我们拿着模型选好的工具元数据去执行，判断执行哪个工具。

<img src="https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20260406220439769.png" alt="image-20260406220439769" style="zoom:50%;" />

> edit，bash，write，edit已经能解决我们95%的问题了



**核心改动**

```txt
函数 safe_path(p):
    path = WORKDIR / p
    如果 path 不在 WORKDIR 下:
        报错
    返回 path

函数 run_read(path, limit=None):
    text = safe_path(path).读文本()
    lines = text 分行
    如果 limit 小于行数:
        lines = 前 limit 行
    返回 拼接 lines

TOOL_HANDLERS = {
    "bash": run_bash,
    "read_file": run_read,
    "write_file": run_write,
    "edit_file": run_edit
}

循环 遍历 response.content:
    如果 block 是工具调用:
        handler = TOOL_HANDLERS[block.name] 或 None
        output = 调用 handler(block.input) 如果存在，否则标记未知工具
        结果 append {"type": "tool_result", "tool_use_id": block.id, "content": output}
```




<details>
<summary>点击展开/折叠代码</summary>

```python
#!/usr/bin/env python3
import os
import json
import subprocess
from pathlib import Path
from openai import OpenAI
from dotenv import load_dotenv
load_dotenv(override=True)
api_key = os.getenv('ARK_API_KEY')
base_url = "https://ark.cn-beijing.volces.com/api/v3"
model_id = os.getenv("MODEL_ID", "doubao-seed-1-8-251228")
client = OpenAI(base_url=base_url, api_key=api_key)
WORKDIR = Path.cwd()
SYSTEM_PROMPT = f"You are a coding agent at {WORKDIR}. Use tools to solve tasks. Act, don't explain."
TOOL_HANDLERS = {}

def safe_path(p: str) -> Path:
    path = (WORKDIR / p).resolve()
    if not path.is_relative_to(WORKDIR):
        raise ValueError(f"Path escapes workspace: {p}")
    return path


def run_bash(command: str) -> str:
    dangerous = ["rm -rf /", "sudo", "shutdown", "reboot", "> /dev/"]
    if any(d in command for d in dangerous):
        return "Error: Dangerous command blocked"
    try:
        r = subprocess.run(command, shell=True, cwd=WORKDIR, capture_output=True, text=True, timeout=120)
        out = (r.stdout + r.stderr).strip()
        return out[:50000] if out else "(no output)"
    except subprocess.TimeoutExpired:
        return "Error: Timeout (120s)"


def run_read(path: str, limit: int = None) -> str:
    try:
        text = safe_path(path).read_text()
        lines = text.splitlines()
        if limit and limit < len(lines):
            lines = lines[:limit] + [f"... ({len(lines) - limit} more lines)"]
        return "\n".join(lines)[:50000]
    except Exception as e:
        return f"Error: {e}"


def run_write(path: str, content: str) -> str:
    try:
        fp = safe_path(path)
        fp.parent.mkdir(parents=True, exist_ok=True)
        fp.write_text(content)
        return f"Wrote {len(content)} bytes to {path}"
    except Exception as e:
        return f"Error: {e}"


def run_edit(path: str, old_text: str, new_text: str) -> str:
    try:
        fp = safe_path(path)
        content = fp.read_text()
        if old_text not in content:
            return f"Error: Exact text not found in {path}"
        fp.write_text(content.replace(old_text, new_text, 1))
        return f"Edited {path}"
    except Exception as e:
        return f"Error: {e}"


TOOL_HANDLERS = {
    "bash": lambda **kw: run_bash(kw["command"]),
    "read_file": lambda **kw: run_read(kw["path"], kw.get("limit")),
    "write_file": lambda **kw: run_write(kw["path"], kw["content"]),
    "edit_file": lambda **kw: run_edit(kw["path"], kw["old_text"], kw["new_text"]),
}


TOOLS = [
    {"type": "function","function": {"name": "bash","description": "Run a shell command.","parameters": {"type": "object","properties": {"command": {"type": "string"}},"required": ["command"]}}},
    {"type": "function","function": {"name": "read_file","description": "Read file contents.","parameters": {"type": "object","properties": {"path": {"type": "string"},"limit": {"type": "integer"}},"required": ["path"]}}},
    {"type": "function","function": {"name": "write_file","description": "Write content to file.","parameters": {"type": "object","properties": {"path": {"type": "string"},"content": {"type": "string"}},"required": ["path","content"]}}},
    {"type": "function","function": {"name": "edit_file","description": "Replace exact text in file.","parameters": {"type": "object","properties": {"path": {"type": "string"},"old_text": {"type": "string"},"new_text": {"type": "string"}},"required": ["path","old_text","new_text"]}}}
]


def agent_loop(messages: list):
    while True:
        response = client.chat.completions.create(model=model_id, messages=[{"role": "system", "content": SYSTEM_PROMPT}] + messages, tools=TOOLS)
        message = response.choices[0].message
        messages.append(message)
        if not message.tool_calls:
            if message.content:
                print(f"\033[32mAssistant:\033[0m {message.content}")
            return
        for tool_call in message.tool_calls:
            name = tool_call.function.name
            args = json.loads(tool_call.function.arguments)
            handler = TOOL_HANDLERS.get(name)
            if handler:
                print(f"\033[33m[Tool: {name}]\033[0m {list(args.values())[0][:50]}...")
                output = handler(**args)
            else:
                output = f"Error: Unknown tool {name}"
            messages.append({"role": "tool","tool_call_id": tool_call.id,"name": name,"content": output})


if __name__ == "__main__":
    history = []
    print(f"\033[35m[Multi-Tool Agent Ready]\033[0m Model: {model_id}")
    while True:
        try:
            query = input("\033[36ms002 >> \033[0m")
        except (EOFError, KeyboardInterrupt):
            break
        if query.strip().lower() in ("q","exit",""):
            break
        history.append({"role": "user","content": query})
        agent_loop(history)
        print()
```

</details>



## 三、规划功能

**问题**：`agent`在执行一个10步的改动，很可能在执行几步之后就出错。原因在于随着任务的执行，上下文不断被延展，提示词的影响不断被稀释，llm就会开始逐渐放飞自我。



**TodoManager 工作原理**

```python
class TodoManager:
    def update(self, items: list) -> str:
        validated, in_progress_count = [], 0
        for item in items:
            status = item.get("status", "pending")
            if status == "in_progress":
                in_progress_count += 1
            validated.append({
                "id": item["id"], 
                "text": item["text"],
                "status": status
            })
        if in_progress_count > 1:
            raise ValueError("Only one task can be in_progress")
        self.items = validated
        return self.render()
```

- 每个计划项都有唯一 ID、文本和状态
- 强制顺序执行，防止“多任务”丢失状态
- `render()` 方法返回当前任务列表和完成进度



**流程**：

<img src="https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20260406230455792.png" alt="image-20260406230455792" style="zoom:50%;" />



**核心原理**：

1. **TodoManager** 存储任务状态，分为 `pending`、`in_progress`、`completed`
2. **单任务执行**：同时只允许一个任务处于 `in_progress`
3. **Nag Reminder**：连续 3 轮不调用 todo，系统自动注入 `<reminder>`，提醒模型更新计划




<details>
<summary>点击展开/折叠代码</summary>

```python
#!/usr/bin/env python3
import os
import json
import subprocess
from pathlib import Path
from openai import OpenAI
from dotenv import load_dotenv
load_dotenv(override=True)
api_key = os.getenv('ARK_API_KEY')
base_url = "https://ark.cn-beijing.volces.com/api/v3"
model_id = os.getenv("MODEL_ID", "doubao-seed-1-8-251228")
client = OpenAI(base_url=base_url, api_key=api_key)
WORKDIR = Path.cwd()
SYSTEM_PROMPT = f"""You are a coding agent at {WORKDIR}.
Use the todo tool to plan multi-step tasks. Mark in_progress before starting, completed when done.
Prefer tools over prose. Act, don't explain."""
TODO=None

class TodoManager:
    def __init__(self):
        self.items=[]
    def update(self, items: list) -> str:
        if len(items)>20: raise ValueError("Max 20 todos allowed")
        validated=[]
        in_progress_count=0
        for i,item in enumerate(items):
            text=str(item.get("text","")).strip()
            status=str(item.get("status","pending")).lower()
            item_id=str(item.get("id",str(i+1)))
            if not text: raise ValueError(f"Item {item_id}: text required")
            if status not in ("pending","in_progress","completed"):
                raise ValueError(f"Item {item_id}: invalid status '{status}'")
            if status=="in_progress": in_progress_count+=1
            validated.append({"id":item_id,"text":text,"status":status})
        if in_progress_count>1: return "Error: Only one task can be in_progress at a time."
        self.items=validated
        return self.render()
    def render(self) -> str:
        if not self.items: return "No todos."
        lines=["Current Tasks:"]
        for item in self.items:
            marker={"pending":"[ ]","in_progress":"[>]","completed":"[x]"}[item["status"]]
            lines.append(f"{marker} #{item['id']}: {item['text']}")
        done=sum(1 for t in self.items if t["status"]=="completed")
        lines.append(f"\nProgress: {done}/{len(self.items)} completed")
        return "\n".join(lines)
TODO=TodoManager()


def safe_path(p: str) -> Path:
    path=(WORKDIR/p).resolve()
    if not path.is_relative_to(WORKDIR): raise ValueError(f"Path escapes workspace: {p}")
    return path


def run_bash(command: str) -> str:
    dangerous=["rm -rf /","sudo","shutdown","reboot","> /dev/"]
    if any(d in command for d in dangerous): return "Error: Dangerous command blocked"
    try:
        r=subprocess.run(command,shell=True,cwd=WORKDIR,capture_output=True,text=True,timeout=120)
        out=(r.stdout+r.stderr).strip()
        return out[:50000] if out else "(no output)"
    except subprocess.TimeoutExpired: return "Error: Timeout (120s)"


def run_read(path: str, limit: int=None) -> str:
    try:
        lines=safe_path(path).read_text().splitlines()
        if limit and limit<len(lines): lines=lines[:limit]+[f"... ({len(lines)-limit} more)"]
        return "\n".join(lines)[:50000]
    except Exception as e: return f"Error: {e}"


def run_write(path: str, content: str) -> str:
    try:
        fp=safe_path(path)
        fp.parent.mkdir(parents=True,exist_ok=True)
        fp.write_text(content)
        return f"Wrote {len(content)} bytes"
    except Exception as e: return f"Error: {e}"


def run_edit(path: str, old_text: str, new_text: str) -> str:
    try:
        fp=safe_path(path)
        content=fp.read_text()
        if old_text not in content: return f"Error: Text not found in {path}"
        fp.write_text(content.replace(old_text,new_text,1))
        return f"Edited {path}"
    except Exception as e: return f"Error: {e}"


TOOL_HANDLERS={
    "bash":lambda **kw: run_bash(kw["command"]),
    "read_file":lambda **kw: run_read(kw["path"],kw.get("limit")),
    "write_file":lambda **kw: run_write(kw["path"],kw["content"]),
    "edit_file":lambda **kw: run_edit(kw["path"],kw["old_text"],kw["new_text"]),
    "todo":lambda **kw: TODO.update(kw["items"]),
}


TOOLS=[
    {"type":"function","function":{"name":"bash","description":"Run a shell command.","parameters":{"type":"object","properties":{"command":{"type":"string"}},"required":["command"]}}},
    {"type":"function","function":{"name":"read_file","description":"Read file contents.","parameters":{"type":"object","properties":{"path":{"type":"string"},"limit":{"type":"integer"}},"required":["path"]}}},
    {"type":"function","function":{"name":"write_file","description":"Write content to file.","parameters":{"type":"object","properties":{"path":{"type":"string"},"content":{"type":"string"}},"required":["path","content"]}}},
    {"type":"function","function":{"name":"edit_file","description":"Replace exact text in file.","parameters":{"type":"object","properties":{"path":{"type":"string"},"old_text":{"type":"string"},"new_text":{"type":"string"}},"required":["path","old_text","new_text"]}}},
    {"type":"function","function":{"name":"todo","description":"Update task list. Track progress on multi-step tasks.","parameters":{"type":"object","properties":{"items":{"type":"array","items":{"type":"object","properties":{"id":{"type":"string"},"text":{"type":"string"},"status":{"type":"string","enum":["pending","in_progress","completed"]}},"required":["id","text","status"]}}},"required":["items"]}}}
]


def agent_loop(messages: list):
    rounds_since_todo=0
    while True:
        response=client.chat.completions.create(model=model_id,messages=[{"role":"system","content":SYSTEM_PROMPT}]+messages,tools=TOOLS)
        message=response.choices[0].message
        messages.append(message)
        if not message.tool_calls:
            if message.content: print(f"\033[32mAssistant:\033[0m {message.content}")
            return
        used_todo=False
        for tool_call in message.tool_calls:
            name=tool_call.function.name
            args=json.loads(tool_call.function.arguments)
            if name=="todo": used_todo=True
            handler=TOOL_HANDLERS.get(name)
            output=handler(**args) if handler else f"Error: Unknown tool {name}"
            print(f"\033[33m[Tool: {name}]\033[0m {str(output)[:100]}...")
            messages.append({"role":"tool","tool_call_id":tool_call.id,"name":name,"content":str(output)})
        rounds_since_todo=0 if used_todo else rounds_since_todo+1
        if rounds_since_todo>=3:
            print("\033[31m[System] Injecting todo reminder...\033[0m")
            messages.append({"role":"user","content":"<reminder>Update your todos. You haven't updated your progress in 3 rounds.</reminder>"})


if __name__=="__main__":
    history=[]
    print(f"\033[35m[Todo-Tracked Agent Ready]\033[0m Model: {model_id}")
    while True:
        try: query=input("\033[36ms003 >> \033[0m")
        except (EOFError,KeyboardInterrupt): break
        if query.strip().lower() in ("q","exit",""): break
        history.append({"role":"user","content":query})
        agent_loop(history)
        print()
```

</details>
