#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// 创建 readline 接口用于输入
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Hot100 目录路径
const HOT100_DIR = path.join(__dirname, '../docs/algorithm/hot100');
// 侧边栏配置文件路径
const SIDEBAR_CONFIG = path.join(__dirname, '../docs/.vitepress/sidebar/algorithm-hot100.mjs');

// 初始化文章内容模板
function getArticleTemplate(number, title, leetcodeLink = '') {
  return `# ${number}. ${title}
> 题目链接：${leetcodeLink}

### 解题思路

### java版本解答
\`\`\`java

\`\`\`
`;
}

// 从 LeetCode 链接解析文件名
function extractFilenameFromLeetCodeLink(link) {
  if (link && link.includes('/problems/')) {
    return link.split('/problems/')[1].split('/')[0];
  }
  return null;
}

// 格式化文件名（转换为 kebab-case）
function formatFilename(title) {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-') // 空格替换为短横线
    .replace(/[^\w-]/g, '') // 移除特殊字符
    .trim();
}

// 更新侧边栏配置
function updateSidebarConfig(title, filename) {
  try {
    const sidebarContent = fs.readFileSync(SIDEBAR_CONFIG, 'utf-8');

    // 查找 items 数组并添加新条目到最下面
    const newItem = `      { text: '${title}', link: '/algorithm/hot100/${filename}' }`;
    const updatedContent = sidebarContent.replace(
      /(\s+items: \[)[\s\S]*?(\s+])/,
      (match, start, end) => {
        // 找到最后一个条目后的位置
        const lastItemEnd = match.lastIndexOf('}');
        return match.slice(0, lastItemEnd + 1) + ',\n' + ' '.repeat(8) + newItem + match.slice(lastItemEnd + 1);
      }
    );

    fs.writeFileSync(SIDEBAR_CONFIG, updatedContent, 'utf-8');
    console.log('✅ 侧边栏配置已更新');
  } catch (error) {
    console.error('❌ 更新侧边栏配置失败:', error.message);
  }
}

// 创建新文章
async function createNewArticle() {
  console.log('=== 创建 Hot100 新文章 ===');

  try {
    // 获取输入信息
    const number = await new Promise(resolve => rl.question('请输入题目编号（例如：2）: ', resolve));
    const title = await new Promise(resolve => rl.question('请输入题目名称（例如：字母异位词分组）: ', resolve));
    const leetcodeLink = await new Promise(resolve => rl.question('请输入 LeetCode 题目链接（例如：https://leetcode.cn/problems/longest-consecutive-sequence）: ', resolve));

    if (!number || !title) {
      console.error('❌ 题目编号和名称不能为空');
      rl.close();
      return;
    }

    // 确定文件名
    let filename;
    if (leetcodeLink) {
      const extractedFilename = extractFilenameFromLeetCodeLink(leetcodeLink);
      if (extractedFilename) {
        filename = extractedFilename;
      } else {
        filename = formatFilename(title);
      }
    } else {
      filename = formatFilename(title);
    }

    const filePath = path.join(HOT100_DIR, `${filename}.md`);

    // 检查文件是否已存在
    if (fs.existsSync(filePath)) {
      console.error('❌ 文件已存在:', filePath);
      rl.close();
      return;
    }

    // 创建文章文件
    const articleContent = getArticleTemplate(number, title, leetcodeLink);
    fs.writeFileSync(filePath, articleContent, 'utf-8');
    console.log('✅ 文章文件已创建:', filePath);

    // 更新侧边栏配置
    updateSidebarConfig(title, filename);

    // 更新最新文章列表
    try {
      console.log('🔄 正在更新最新文章列表...');
      const { execSync } = require('child_process');
      const result = execSync('node scripts/update-latest-articles.js', { encoding: 'utf-8' });
      console.log('✅ 最新文章列表已更新');
    } catch (error) {
      console.warn('⚠️  更新最新文章列表失败:', error.message);
    }

    console.log('\n🎉 文章创建完成！');
    console.log('文件路径:', filePath);
    console.log('侧边栏配置已更新:', SIDEBAR_CONFIG);

  } catch (error) {
    console.error('❌ 创建文章失败:', error.message);
  }

  rl.close();
}

// 启动脚本
createNewArticle();
