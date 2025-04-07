#!/bin/bash

# 检查是否输入提交信息
if [ -z "$1" ]; then
    echo "用法: ./autocommit.sh \"你的提交信息\""
    exit 1
fi

# 执行Git操作
git add .
git commit -m "$1"
git push