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
function updateSidebarConfig(number, title, filename) {
  try {
    const sidebarContent = fs.readFileSync(SIDEBAR_CONFIG, 'utf-8');

    // 解析侧边栏配置为 JavaScript 对象
    // 移除 export default 关键字，以便 eval 能够解析
    const configContent = sidebarContent.replace('export default ', '');
    const sidebarConfig = eval(configContent);

    // 找到 Hot100 对应的配置项
    const hot100Config = sidebarConfig.find(item => item.text === 'LeetCode Hot100');

    if (hot100Config) {
      // 检查是否已存在该条目
      const existingItem = hot100Config.items.find(item => item.text.includes(title));
      if (existingItem) {
        console.log('ℹ️  该题目已存在于侧边栏中，无需重复添加');
        return;
      }

      // 添加新条目
      hot100Config.items.push({
        text: `${number}. ${title}`,
        link: `/algorithm/hot100/${filename}`
      });

      // 排序条目（保持第一个条目不变，后面的按序号排序）
      const firstItem = hot100Config.items[0];
      const sortedItems = [
        firstItem,
        ...hot100Config.items.slice(1).sort((a, b) => {
          const numA = parseInt(a.text.match(/^(\d+)\./)?.[1] || '0');
          const numB = parseInt(b.text.match(/^(\d+)\./)?.[1] || '0');
          return numA - numB;
        })
      ];
      hot100Config.items = sortedItems;
    }

    // 重新生成配置文件内容
    const updatedContent = `export default ${JSON.stringify(sidebarConfig, null, 2)
      .replace(/"(\w+)":/g, '$1:') // 移除对象属性的引号
      .replace(/\n  /g, '\n    ')  // 调整缩进
    };\n`;

    fs.writeFileSync(SIDEBAR_CONFIG, updatedContent, 'utf-8');
    console.log('✅ 侧边栏配置已更新');
  } catch (error) {
    console.error('❌ 更新侧边栏配置失败:', error.message);
  }
}

// 更新 index.md 文件中的题目列表
function updateIndexMd(number, title, filename) {
  try {
    const indexPath = path.join(HOT100_DIR, 'index.md');
    const indexContent = fs.readFileSync(indexPath, 'utf-8');

    // 查找题目列表部分并添加新条目
    const newItem = `- [${number}. ${title}](${filename}.md)`;

    // 查找题目列表部分
    const titleIndex = indexContent.indexOf('## 题目列表');
    if (titleIndex === -1) {
      console.error('❌ 未找到题目列表部分');
      return;
    }

    // 获取题目列表开始和结束的位置
    const listStart = titleIndex + '## 题目列表'.length;
    let listEnd = indexContent.indexOf('\n\n', listStart);
    if (listEnd === -1) {
      listEnd = indexContent.length;
    }

    // 提取现有题目列表
    const existingList = indexContent.slice(listStart, listEnd).trim();
    const itemsArray = existingList.split('\n').filter(item => item.trim()).map(item => item.trim());

    // 检查是否已存在该条目
    const existingItem = itemsArray.find(item => item.includes(title));
    if (existingItem) {
      console.log('ℹ️  该题目已存在于题目列表中，无需重复添加');
      return;
    }

    // 添加新条目
    itemsArray.push(newItem);

    // 按题目编号排序
    itemsArray.sort((a, b) => {
      const numA = parseInt(a.match(/\[(\d+)\./)?.[1] || '0');
      const numB = parseInt(b.match(/\[(\d+)\./)?.[1] || '0');
      return numA - numB;
    });

    // 构建更新后的题目列表
    const updatedList = '## 题目列表\n\n' + itemsArray.join('\n');

    // 替换原题目列表
    const updatedContent = indexContent.slice(0, titleIndex) + updatedList + indexContent.slice(listEnd);

    fs.writeFileSync(indexPath, updatedContent, 'utf-8');
    console.log('✅ index.md 题目列表已更新');
  } catch (error) {
    console.error('❌ 更新 index.md 失败:', error.message);
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
    updateSidebarConfig(number, title, filename);

    // 更新 index.md 文件中的题目列表
    updateIndexMd(number, title, filename);

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
