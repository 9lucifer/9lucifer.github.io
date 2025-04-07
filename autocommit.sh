#!/bin/bash

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
REMOTE_URL=$(git remote get-url origin)
if [[ $REMOTE_URL == http* ]]; then
    echo "检测到HTTPS协议，自动启用凭据存储..."
    git config --global credential.helper store
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