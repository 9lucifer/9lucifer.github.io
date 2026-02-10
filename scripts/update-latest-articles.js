const fs = require('fs');
const path = require('path');

// 配置
const DOCS_DIR = path.join(__dirname, '../docs');
const INDEX_FILE = path.join(DOCS_DIR, 'index.md');
const EXCLUDE_DIRS = ['node_modules', '.vitepress', 'annual-summary', 'project'];
const EXCLUDE_FILES = ['index.md', 'api-examples.md', 'markdown-examples.md'];

// 获取分类
function getCategory(filePath) {
  if (filePath.includes('/java/')) return 'Java';
  if (filePath.includes('/mysql/')) return '数据库';
  if (filePath.includes('/front/')) return '前端';
  if (filePath.includes('/center/')) return '中间件';
  if (filePath.includes('/leetcode/')) return '算法';
  if (filePath.includes('/project/')) return '项目';
  return '其他';
}

// 提取文章标题
function getTitle(content) {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : '未命名文章';
}

// 提取文章描述
function getDescription(content) {
  // 移除 frontmatter
  const withoutFrontmatter = content.replace(/^---[\s\S]*?---\n/m, '');
  // 移除标题
  const withoutTitle = withoutFrontmatter.replace(/^#\s+.+$/m, '');
  // 找到第一段非空文本
  const lines = withoutTitle.split('\n');
  for (const line of lines) {
    const cleaned = line.replace(/^[>\s]*/, '').trim();
    if (cleaned && !cleaned.startsWith('#')) {
      return cleaned.substring(0, 60);
    }
  }
  return '暂无描述';
}

// 递归查找所有 markdown 文件
function findMarkdownFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!EXCLUDE_DIRS.includes(file)) {
        findMarkdownFiles(filePath, fileList);
      }
    } else if (file.endsWith('.md') && !EXCLUDE_FILES.includes(file)) {
      fileList.push({
        path: filePath,
        mtime: stat.mtime
      });
    }
  }

  return fileList;
}

// 主函数
function updateLatestArticles() {
  console.log('🔍 正在查找最新文章...');

  // 查找所有文章
  const allFiles = findMarkdownFiles(DOCS_DIR);

  // 按修改时间排序，取最新的 6 篇
  const latestFiles = allFiles
    .sort((a, b) => b.mtime - a.mtime)
    .slice(0, 6);

  console.log(`✅ 找到 ${latestFiles.length} 篇最新文章`);

  // 生成文章卡片 HTML
  const articles = latestFiles.map(file => {
    const content = fs.readFileSync(file.path, 'utf-8');
    const relativePath = path.relative(DOCS_DIR, file.path).replace(/\.md$/, '').replace(/\\/g, '/');

    return {
      link: `/${relativePath}`,
      category: getCategory(file.path),
      title: getTitle(content),
      description: getDescription(content)
    };
  });

  // 生成 HTML
  const articlesHtml = articles.map(article =>
    `    <a href="${article.link}" class="article-card">
      <div class="article-tag">${article.category}</div>
      <h3>${article.title}</h3>
      <p>${article.description}</p>
    </a>`
  ).join('\n');

  // 读取 index.md
  let indexContent = fs.readFileSync(INDEX_FILE, 'utf-8');

  // 替换文章列表
  const regex = /(<div class="articles-grid">)([\s\S]*?)(<\/div>\s*<\/div>)/;
  const replacement = `$1\n${articlesHtml}\n  $3`;

  if (regex.test(indexContent)) {
    indexContent = indexContent.replace(regex, replacement);
    fs.writeFileSync(INDEX_FILE, indexContent, 'utf-8');
    console.log('✅ 最新文章列表已更新');

    // 输出文章列表
    articles.forEach((article, index) => {
      console.log(`  ${index + 1}. [${article.category}] ${article.title}`);
    });
  } else {
    console.error('❌ 未找到文章列表区域');
    process.exit(1);
  }
}

// 执行
try {
  updateLatestArticles();
} catch (error) {
  console.error('❌ 更新失败:', error.message);
  process.exit(1);
}