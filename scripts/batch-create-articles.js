const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 题目信息数组
const problems = [
  // 二叉树相关题目
  { number: 36, title: '二叉树的中序遍历', link: 'https://leetcode.cn/problems/binary-tree-inorder-traversal/' },
  { number: 37, title: '二叉树的最大深度', link: 'https://leetcode.cn/problems/maximum-depth-of-binary-tree/' },
  { number: 38, title: '翻转二叉树', link: 'https://leetcode.cn/problems/invert-binary-tree/' },
  { number: 39, title: '对称二叉树', link: 'https://leetcode.cn/problems/symmetric-tree/' },
  { number: 40, title: '二叉树的直径', link: 'https://leetcode.cn/problems/diameter-of-binary-tree/' },
  { number: 41, title: '二叉树的层序遍历', link: 'https://leetcode.cn/problems/binary-tree-level-order-traversal/' },
  { number: 42, title: '将有序数组转换为二叉搜索树', link: 'https://leetcode.cn/problems/convert-sorted-array-to-binary-search-tree/' },
  { number: 43, title: '验证二叉搜索树', link: 'https://leetcode.cn/problems/validate-binary-search-tree/' },
  { number: 44, title: '二叉搜索树中第 K 小的元素', link: 'https://leetcode.cn/problems/kth-smallest-element-in-a-bst/' },
  { number: 45, title: '二叉树的右视图', link: 'https://leetcode.cn/problems/binary-tree-right-side-view/' },
  { number: 46, title: '二叉树展开为链表', link: 'https://leetcode.cn/problems/flatten-binary-tree-to-linked-list/' },
  { number: 47, title: '从前序与中序遍历序列构造二叉树', link: 'https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-inorder-traversal/' },
  { number: 48, title: '路径总和 III', link: 'https://leetcode.cn/problems/path-sum-iii/' },
  { number: 49, title: '二叉树的最近公共祖先', link: 'https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree/' },
  { number: 50, title: '二叉树中的最大路径和', link: 'https://leetcode.cn/problems/binary-tree-maximum-path-sum/' },

  // 其他题目
  { number: 51, title: '岛屿数量', link: 'https://leetcode.cn/problems/number-of-islands/' },
  { number: 52, title: '腐烂的橘子', link: 'https://leetcode.cn/problems/rotting-oranges/' },
  { number: 53, title: '课程表', link: 'https://leetcode.cn/problems/course-schedule/' },
  { number: 54, title: '实现 Trie (前缀树)', link: 'https://leetcode.cn/problems/implement-trie-prefix-tree/' },
  { number: 55, title: '全排列', link: 'https://leetcode.cn/problems/permutations/' },
  { number: 56, title: '子集', link: 'https://leetcode.cn/problems/subsets/' },
  { number: 57, title: '电话号码的字母组合', link: 'https://leetcode.cn/problems/letter-combinations-of-a-phone-number/' },
  { number: 58, title: '组合总和', link: 'https://leetcode.cn/problems/combination-sum/' },
  { number: 59, title: '括号生成', link: 'https://leetcode.cn/problems/generate-parentheses/' },
  { number: 60, title: '单词搜索', link: 'https://leetcode.cn/problems/word-search/' },
  { number: 61, title: '分割回文串', link: 'https://leetcode.cn/problems/palindrome-partitioning/' },
  { number: 62, title: 'N 皇后', link: 'https://leetcode.cn/problems/n-queens/' }
];

// 常量定义
const HOT100_DIR = path.join(__dirname, '../docs/algorithm/hot100');
const SIDEBAR_CONFIG = path.join(__dirname, '../docs/.vitepress/sidebar/algorithm-hot100.mjs');

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

// 获取文章模板
function getArticleTemplate(number, title, leetcodeLink = '') {
  return `# ${number}. ${title}
> 题目链接：${leetcodeLink}

### 解题思路

### java版本解答
\`\`\`java

\`\`\`
`;
}

// 更新侧边栏配置
function updateSidebarConfig(number, title, filename) {
  try {
    const sidebarContent = fs.readFileSync(SIDEBAR_CONFIG, 'utf-8');

    // 解析侧边栏配置为 JavaScript 对象
    const configContent = sidebarContent.replace('export default ', '');
    const sidebarConfig = eval(configContent);

    // 找到 Hot100 对应的配置项
    const hot100Config = sidebarConfig.find(item => item.text === 'LeetCode Hot100');

    if (hot100Config) {
      // 检查是否已存在该条目
      const existingItem = hot100Config.items.find(item => item.text.includes(title));
      if (existingItem) {
        console.log(`ℹ️  该题目已存在于侧边栏中，无需重复添加: ${title}`);
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
    console.log(`✅ 侧边栏配置已更新: ${title}`);
  } catch (error) {
    console.error(`❌ 更新侧边栏配置失败: ${title}`, error.message);
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
    const lines = indexContent.split('\n');
    let listStart = -1;
    let listEnd = -1;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('## 题目列表')) {
        listStart = i + 1;
        // 查找列表结束位置：找到下一个标题或文件结束
        for (let j = listStart; j < lines.length; j++) {
          if (lines[j].startsWith('## ') && j > listStart) {
            listEnd = j;
            break;
          }
        }
        if (listEnd === -1) {
          listEnd = lines.length;
        }
        break;
      }
    }

    if (listStart === -1) {
      console.error('❌ 未找到题目列表部分');
      return;
    }

    // 提取现有题目列表
    const itemsArray = [];
    for (let i = listStart; i < listEnd; i++) {
      const line = lines[i].trim();
      if (line && line.startsWith('-')) {
        itemsArray.push(line);
      }
    }

    // 检查是否已存在该条目
    const existingItem = itemsArray.find(item => item.includes(title));
    if (existingItem) {
      console.log(`ℹ️  该题目已存在于题目列表中，无需重复添加: ${title}`);
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
    const updatedLines = [...lines];
    // 删除旧的题目列表
    updatedLines.splice(listStart, listEnd - listStart);
    // 插入新的题目列表
    for (let i = 0; i < itemsArray.length; i++) {
      updatedLines.splice(listStart + i, 0, itemsArray[i]);
    }

    fs.writeFileSync(indexPath, updatedLines.join('\n'), 'utf-8');
    console.log(`✅ index.md 题目列表已更新: ${title}`);
  } catch (error) {
    console.error(`❌ 更新 index.md 失败: ${title}`, error.message);
  }
}

// 创建单个文章
function createArticle(problem) {
  try {
    const { number, title, link } = problem;

    // 确定文件名
    let filename;
    if (link) {
      const extractedFilename = extractFilenameFromLeetCodeLink(link);
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
      console.log(`ℹ️ 文件已存在，跳过: ${filePath}`);
      // 仍然需要更新侧边栏和 index.md
      updateSidebarConfig(number, title, filename);
      updateIndexMd(number, title, filename);
      return;
    }

    // 创建文章文件
    const articleContent = getArticleTemplate(number, title, link);
    fs.writeFileSync(filePath, articleContent, 'utf-8');
    console.log(`✅ 文章文件已创建: ${filePath}`);

    // 更新侧边栏配置
    updateSidebarConfig(number, title, filename);

    // 更新 index.md 文件中的题目列表
    updateIndexMd(number, title, filename);
  } catch (error) {
    console.error(`❌ 创建文章失败: ${problem.title}`, error.message);
  }
}

// 批量创建文章
function batchCreateArticles() {
  console.log('=== 开始批量创建文章 ===');

  // 创建每个文章
  for (const problem of problems) {
    console.log(`\n处理: ${problem.number}. ${problem.title}`);
    createArticle(problem);
  }

  // 更新最新文章列表
  try {
    console.log('\n🔄 正在更新最新文章列表...');
    const result = execSync('node scripts/update-latest-articles.js', { encoding: 'utf-8' });
    console.log('✅ 最新文章列表已更新');
  } catch (error) {
    console.warn('⚠️  更新最新文章列表失败:', error.message);
  }

  console.log('\n🎉 批量创建完成！');
}

// 启动脚本
batchCreateArticles();