# agent迭代式手搓

> 参考https://learn.shareai.run/zh/

## 一、最基本的agent

> 循环+`bash`

agent的主要生产力来自于背后的语言大模型。大模型具有预测的能力，能够**预测**出下一个位置应该是什么字，这就是语言大模型和我们“交流”的本质。在`codex`和`claude code`尚未出现的时候，我们自己去网页询问`chatgpt`或者`claude`模型，根据他们的指示去执行，并吧结果黏贴给他们，从而使得模型能够接触到真实世界和真实结果。

现在有了类似`claude code`的`agent`，其实现原理也类似上面的过程，但是不同的是，我们不需要手动复制黏贴，而是靠模型自己去和真实世界交互，模型自己决定去调用哪些工具，再把工具调用结果加入到上下文，这就是一个简单的agent。

<img src="https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20260406213231686.png" alt="image-20260406213231686" style="zoom:50%;" />

**循环退出条件**：LLM不再进行工具调用，这说明模型已经开始进行总结阶段，这个时候就可以结束整个循环。

核心流程：

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

