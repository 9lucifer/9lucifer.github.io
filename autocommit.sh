#!/bin/bash

# 新增变更检测
if [ -z "$(git status --porcelain)" ]; then
    echo "工作区无变更，跳过提交"
    exit 0
fi

# 检查是否输入提交信息
if [ -z "$1" ]; then
    echo "用法: ./autocommit.sh \"你的提交信息\""
    exit 1
fi

# 执行Git操作
git add . || exit 1

# 添加提交结果检测
if ! git commit -m "$1"; then
    echo "错误：提交失败，请检查暂存区变更"
    exit 1
fi

# 获取远程协议类型
# 修改协议检测部分
REMOTE_URL=$(git remote get-url origin)
if [[ $REMOTE_URL == http* ]]; then
    echo "检测到HTTPS协议，正在切换为SSH..."
    git remote set-url origin git@github.com:9lucifer/9lucifer.github.io.git
elif [[ $REMOTE_URL != *@* ]]; then
    echo "未配置SSH协议，请手动设置："
    echo "git remote set-url origin git@github.com:9lucifer/9lucifer.github.io.git"
    exit 1
fi

# 添加SSH连接测试
echo "正在验证SSH连接..."
if ! ssh -T git@github.com 2>&1 | grep "successfully authenticated"; then
    echo "SSH认证失败，请检查："
    echo "1. ~/.ssh/id_rsa 密钥是否存在"
    echo "2. SSH密钥是否添加到GitHub账户"
    exit 1
fi

# 带超时的推送操作（增加详细输出）
echo "正在推送变更到 origin/main..."
if ! timeout 30 git push -v origin main; then
    echo "错误：推送操作超时，最后尝试："
    echo "1. 手动运行: git push origin main"
    echo "2. 检查协议类型：当前使用 ${REMOTE_URL:-未获取到协议}"
    echo "3. SSH用户请测试: ssh -T git@github.com"
    exit 1
fi

# 添加推送成功提示
echo "✓ 代码已成功推送至远程main分支"