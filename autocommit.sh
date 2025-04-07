#!/bin/bash

# 检查是否输入提交信息
if [ -z "$1" ]; then
    echo "用法: ./autocommit.sh \"你的提交信息\""
    exit 1
fi

# 执行Git操作
git add .
git commit -m "$1"

# 带超时的推送操作（30秒限制）
if ! timeout 30 git push origin main; then
    echo "错误：推送操作超时，请检查以下可能原因："
    echo "1. 网络连接状态"
    echo "2. GitHub账号认证是否过期"
    echo "3. 远程仓库权限配置"
    exit 1
fi

# 添加推送成功提示
echo "✓ 代码已成功推送至远程main分支"