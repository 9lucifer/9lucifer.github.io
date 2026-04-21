const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = path.join(__dirname, '..');
const DOCS_DIR = path.join(ROOT_DIR, 'docs');
const DATA_FILE = path.join(DOCS_DIR, '.vitepress', 'data', 'homeLatestArticles.generated.js');
const EXCLUDE_DIRS = ['node_modules', '.vitepress', 'annual-summary', 'project', 'women-health'];
const EXCLUDE_FILES = ['api-examples.md', 'markdown-examples.md'];
const MAX_ARTICLES = 6;

const SECTION_META = {
  java: { label: 'Java', icon: 'java' },
  go: { label: 'Go', icon: 'go' },
  mysql: { label: '数据库', icon: 'mysql' },
  front: { label: '前端', icon: 'front' },
  center: { label: '中间件', icon: 'center' },
  algorithm: { label: '算法', icon: 'algorithm' },
  ai: { label: 'AI', icon: 'ai' },
  design: { label: '系统设计', icon: 'design' },
  plan: { label: '规划', icon: 'plan' },
  product: { label: '产品', icon: 'product' },
  computer: { label: '基础', icon: 'computer' },
  generic: { label: '文章', icon: 'generic' }
};

const SECONDARY_TAGS = {
  basic: '基础',
  advanced: '进阶',
  hot100: 'Hot100',
  tip: '技巧',
  spring: 'Spring',
  jvm: 'JVM',
  network: '网络',
  os: '操作系统',
  kafka: 'Kafka',
  rabbitmq: 'RabbitMQ',
  'new-research': '前沿',
  '2026': '2026'
};

const KEYWORD_TAGS = [
  { pattern: /redis/i, label: 'Redis' },
  { pattern: /mysql/i, label: 'MySQL' },
  { pattern: /agent/i, label: 'Agent' },
  { pattern: /vitepress/i, label: 'VitePress' },
  { pattern: /tailwind/i, label: 'Tailwind' },
  { pattern: /giscus/i, label: 'Giscus' },
  { pattern: /harness/i, label: 'Harness' },
  { pattern: /迭代|agent/i, label: 'Agent' },
  { pattern: /评论|giscus/i, label: '评论' },
  { pattern: /并发|高并发/i, label: '并发' },
  { pattern: /事务|distributed/i, label: '事务' },
  { pattern: /库存/i, label: '库存' },
  { pattern: /面试/i, label: '面试' },
  { pattern: /算法|hot100/i, label: '算法' },
  { pattern: /产品/i, label: '产品' }
];

function toPosix(filePath) {
  return filePath.replace(/\\/g, '/');
}

function formatDate(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getGitOutput(command) {
  return execSync(command, {
    cwd: ROOT_DIR,
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'ignore']
  }).trim();
}

function hasLocalChanges(filePath) {
  try {
    const repoRelativePath = toPosix(path.relative(ROOT_DIR, filePath));
    const output = getGitOutput(`git status --porcelain -- "${repoRelativePath}"`);
    return Boolean(output);
  } catch {
    return true;
  }
}

function getLatestTimestamp(filePath) {
  const fallbackTime = fs.statSync(filePath).mtimeMs;

  try {
    if (hasLocalChanges(filePath)) {
      return fallbackTime;
    }

    const repoRelativePath = toPosix(path.relative(ROOT_DIR, filePath));
    const timestamp = getGitOutput(`git log -1 --format=%ct -- "${repoRelativePath}"`);
    const gitTime = Number.parseInt(timestamp, 10) * 1000;

    if (!Number.isFinite(gitTime) || gitTime <= 0) {
      return fallbackTime;
    }

    return gitTime;
  } catch {
    return fallbackTime;
  }
}

function getSection(relativePath) {
  return toPosix(relativePath).split('/')[0] || 'generic';
}

function getMeta(relativePath, title) {
  const normalizedPath = toPosix(relativePath);
  if (/redis/i.test(normalizedPath) || /redis/i.test(title)) {
    return { label: 'Redis', icon: 'redis' };
  }

  return SECTION_META[getSection(normalizedPath)] || SECTION_META.generic;
}

function removeFrontmatter(content) {
  return content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '');
}

function cleanText(text) {
  return text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/[>*|~]/g, ' ')
    .replace(/^[-+\d.\s]+/gm, '')
    .replace(/#+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function fallbackTitleFromFile(filePath) {
  return path.basename(filePath, '.md').replace(/[_-]+/g, ' ').trim() || '未命名文章';
}

function getTitle(content, filePath) {
  const frontmatter = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (frontmatter) {
    const titleMatch = frontmatter[1].match(/^title:\s*["']?(.+?)["']?\s*$/m);
    if (titleMatch) {
      return cleanText(titleMatch[1]);
    }
  }

  const body = removeFrontmatter(content);
  const headingMatch = body.match(/^#\s+(.+)$/m);
  if (headingMatch) {
    return cleanText(headingMatch[1]);
  }

  return fallbackTitleFromFile(filePath);
}

function getSummary(content, title) {
  const body = removeFrontmatter(content)
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/^#\s+.+$/gm, ' ');

  const lines = body.split(/\r?\n/);
  for (const line of lines) {
    const cleaned = cleanText(line);
    if (!cleaned || cleaned === title || cleaned.length < 8 || cleaned.startsWith('PageViewCount')) {
      continue;
    }

    return cleaned.slice(0, 56);
  }

  return `${title} 的最新整理与记录。`;
}

function addTag(tags, label) {
  if (!label) {
    return;
  }

  const value = label.startsWith('#') ? label : `# ${label}`;
  if (!tags.includes(value)) {
    tags.push(value);
  }
}

function getTags(relativePath, title, categoryLabel) {
  const tags = [];
  const normalizedPath = toPosix(relativePath);
  const segments = normalizedPath.replace(/\.md$/, '').split('/');

  addTag(tags, categoryLabel);

  const secondary = SECONDARY_TAGS[segments[1]];
  if (secondary) {
    addTag(tags, secondary);
  }

  for (const rule of KEYWORD_TAGS) {
    if (rule.pattern.test(title) || rule.pattern.test(normalizedPath)) {
      addTag(tags, rule.label);
    }

    if (tags.length >= 3) {
      break;
    }
  }

  if (tags.length < 3) {
    addTag(tags, '最新');
  }

  return tags.slice(0, 3);
}

function findMarkdownFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!EXCLUDE_DIRS.includes(file)) {
        findMarkdownFiles(filePath, fileList);
      }
      continue;
    }

    if (!file.endsWith('.md') || file === 'index.md' || EXCLUDE_FILES.includes(file)) {
      continue;
    }

    fileList.push({
      path: filePath,
      timestamp: getLatestTimestamp(filePath)
    });
  }

  return fileList;
}

function buildArticleRecord(file) {
  const content = fs.readFileSync(file.path, 'utf8');
  const relativePath = toPosix(path.relative(DOCS_DIR, file.path)).replace(/\.md$/, '');
  const title = getTitle(content, file.path);
  const meta = getMeta(relativePath, title);

  return {
    href: `/${relativePath}`,
    date: formatDate(file.timestamp),
    icon: meta.icon,
    title,
    summary: getSummary(content, title),
    tags: getTags(relativePath, title, meta.label)
  };
}

function writeDataFile(articles) {
  const fileContent = `export const latestArticles = ${JSON.stringify(articles, null, 2)}\n`;
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, fileContent, 'utf8');
}

function updateLatestArticles() {
  console.log('正在查找最新文章...');

  const latestArticles = findMarkdownFiles(DOCS_DIR)
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, MAX_ARTICLES)
    .map(buildArticleRecord);

  writeDataFile(latestArticles);

  console.log(`已更新 ${latestArticles.length} 篇最新文章`);
  latestArticles.forEach((article, index) => {
    console.log(`${index + 1}. ${article.title} -> ${article.href}`);
  });
  console.log(`数据文件已写入: ${DATA_FILE}`);
}

try {
  updateLatestArticles();
} catch (error) {
  console.error('更新最新文章失败:', error.message);
  process.exit(1);
}
