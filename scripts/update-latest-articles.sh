#!/bin/bash

# 更新首页最新文章列表的脚本
# 用途：自动获取最新的 6 篇文章并更新到 docs/index.md

set -e

DOCS_DIR="docs"
INDEX_FILE="$DOCS_DIR/index.md"

# 排除的目录和文件
EXCLUDE_PATTERNS=(
  "node_modules"
  ".vitepress"
  "index.md"
  "api-examples.md"
  "markdown-examples.md"
)

# 获取文章标题的函数
get_article_title() {
  local file=$1
  # 提取第一个 # 标题
  grep -m 1 "^# " "$file" | sed 's/^# //' || echo "未命名文章"
}

# 获取文章描述的函数（提取第一段非空文本）
get_article_description() {
  local file=$1
  # 跳过 frontmatter 和标题，获取第一段文本
  awk '
    BEGIN { in_frontmatter=0; found_title=0; }
    /^---$/ { in_frontmatter=!in_frontmatter; next; }
    in_frontmatter { next; }
    /^# / { found_title=1; next; }
    found_title && /^[^#]/ && NF > 0 {
      gsub(/^[> ]*/, "");
      if (length($0) > 0) {
        print substr($0, 1, 60);
        exit;
      }
    }
  ' "$file" || echo "暂无描述"
}

# 获取分类标签
get_category() {
  local file=$1
  if [[ $file == *"/java/"* ]]; then
    echo "Java"
  elif [[ $file == *"/mysql/"* ]]; then
    echo "数据库"
  elif [[ $file == *"/front/"* ]]; then
    echo "前端"
  elif [[ $file == *"/center/"* ]]; then
    echo "中间件"
  elif [[ $file == *"/leetcode/"* ]]; then
    echo "算法"
  elif [[ $file == *"/project/"* ]]; then
    echo "项目"
  else
    echo "其他"
  fi
}

# 构建排除参数
exclude_args=""
for pattern in "${EXCLUDE_PATTERNS[@]}"; do
  exclude_args="$exclude_args ! -path '*/$pattern/*' ! -name '$pattern'"
done

# 查找所有 markdown 文件，按修改时间排序，取最新的 6 个
echo "正在查找最新文章..."
latest_files=$(eval "find $DOCS_DIR -name '*.md' -type f $exclude_args" | \
  xargs ls -t | head -6)

if [ -z "$latest_files" ]; then
  echo "未找到文章文件"
  exit 1
fi

echo "找到以下最新文章："
echo "$latest_files"

# 生成文章卡片 HTML
articles_html=""
while IFS= read -r file; do
  # 获取相对路径（去掉 docs/ 前缀和 .md 后缀）
  rel_path=$(echo "$file" | sed "s|^$DOCS_DIR/||" | sed 's|\.md$||')

  # 获取文章信息
  title=$(get_article_title "$file")
  description=$(get_article_description "$file")
  category=$(get_category "$file")

  # 生成卡片 HTML
  articles_html+="    <a href=\"/$rel_path\" class=\"article-card\">
      <div class=\"article-tag\">$category</div>
      <h3>$title</h3>
      <p>$description</p>
    </a>
"
done <<< "$latest_files"

# 读取当前 index.md 内容
if [ ! -f "$INDEX_FILE" ]; then
  echo "错误：找不到 $INDEX_FILE"
  exit 1
fi

# 创建临时文件
temp_file=$(mktemp)

# 使用 awk 替换文章列表部分
awk -v articles="$articles_html" '
  BEGIN { in_articles=0; printed=0; }
  /<div class="latest-articles">/ { in_articles=1; print; next; }
  in_articles && /<div class="articles-grid">/ {
    print;
    print articles;
    printed=1;
    next;
  }
  in_articles && /<\/div>/ && printed {
    print;
    in_articles=0;
    printed=0;
    next;
  }
  !in_articles || !printed { print; }
' "$INDEX_FILE" > "$temp_file"

# 替换原文件
mv "$temp_file" "$INDEX_FILE"

echo "✅ 最新文章列表已更新到 $INDEX_FILE"
