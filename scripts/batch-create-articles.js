const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 题目信息数组
const problems = [
  // 二分查找相关题目
  { number: 63, title: '搜索插入位置', link: 'https://leetcode.cn/problems/search-insert-position/' },
  { number: 64, title: '搜索二维矩阵', link: 'https://leetcode.cn/problems/search-a-2d-matrix/' },
  { number: 65, title: '在排序数组中查找元素的第一个和最后一个位置', link: 'https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/' },
  { number: 66, title: '搜索旋转排序数组', link: 'https://leetcode.cn/problems/search-in-rotated-sorted-array/' },
  { number: 67, title: '寻找旋转排序数组中的最小值', link: 'https://leetcode.cn/problems/find-minimum-in-rotated-sorted-array/' },
  { number: 68, title: '寻找两个正序数组的中位数', link: 'https://leetcode.cn/problems/median-of-two-sorted-arrays/' },

  // 栈相关题目
  { number: 69, title: '有效的括号', link: 'https://leetcode.cn/problems/valid-parentheses/' },
  { number: 70, title: '最小栈', link: 'https://leetcode.cn/problems/min-stack/' },
  { number: 71, title: '字符串解码', link: 'https://leetcode.cn/problems/decode-string/' },
  { number: 72, title: '每日温度', link: 'https://leetcode.cn/problems/daily-temperatures/' },
  { number: 73, title: '柱状图中最大的矩形', link: 'https://leetcode.cn/problems/largest-rectangle-in-histogram/' },

  // 堆相关题目
  { number: 74, title: '数组中的第K个最大元素', link: 'https://leetcode.cn/problems/kth-largest-element-in-an-array/' },
  { number: 75, title: '前 K 个高频元素', link: 'https://leetcode.cn/problems/top-k-frequent-elements/' },
  { number: 76, title: '数据流的中位数', link: 'https://leetcode.cn/problems/find-median-from-data-stream/' },

  // 贪心算法相关题目
  { number: 77, title: '买卖股票的最佳时机', link: 'https://leetcode.cn/problems/best-time-to-buy-and-sell-stock/' },
  { number: 78, title: '跳跃游戏', link: 'https://leetcode.cn/problems/jump-game/' },
  { number: 79, title: '跳跃游戏 II', link: 'https://leetcode.cn/problems/jump-game-ii/' },
  { number: 80, title: '划分字母区间', link: 'https://leetcode.cn/problems/partition-labels/' },

  // 动态规划相关题目
  { number: 81, title: '爬楼梯', link: 'https://leetcode.cn/problems/climbing-stairs/' },
  { number: 82, title: '杨辉三角', link: 'https://leetcode.cn/problems/pascals-triangle/' },
  { number: 83, title: '打家劫舍', link: 'https://leetcode.cn/problems/house-robber/' },
  { number: 84, title: '完全平方数', link: 'https://leetcode.cn/problems/perfect-squares/' },
  { number: 85, title: '零钱兑换', link: 'https://leetcode.cn/problems/coin-change/' },
  { number: 86, title: '单词拆分', link: 'https://leetcode.cn/problems/word-break/' },
  { number: 87, title: '最长递增子序列', link: 'https://leetcode.cn/problems/longest-increasing-subsequence/' },
  { number: 88, title: '乘积最大子数组', link: 'https://leetcode.cn/problems/maximum-product-subarray/' },
  { number: 89, title: '分割等和子集', link: 'https://leetcode.cn/problems/partition-equal-subset-sum/' },
  { number: 90, title: '最长有效括号', link: 'https://leetcode.cn/problems/longest-valid-parentheses/' },
  { number: 91, title: '不同路径', link: 'https://leetcode.cn/problems/unique-paths/' },
  { number: 92, title: '最小路径和', link: 'https://leetcode.cn/problems/minimum-path-sum/' },
  { number: 93, title: '最长回文子串', link: 'https://leetcode.cn/problems/longest-palindromic-substring/' },
  { number: 94, title: '最长公共子序列', link: 'https://leetcode.cn/problems/longest-common-subsequence/' },
  { number: 95, title: '编辑距离', link: 'https://leetcode.cn/problems/edit-distance/' },

  // 其他题目
  { number: 96, title: '只出现一次的数字', link: 'https://leetcode.cn/problems/single-number/' },
  { number: 97, title: '多数元素', link: 'https://leetcode.cn/problems/majority-element/' },
  { number: 98, title: '颜色分类', link: 'https://leetcode.cn/problems/sort-colors/' },
  { number: 99, title: '下一个排列', link: 'https://leetcode.cn/problems/next-permutation/' },
  { number: 100, title: '寻找重复数', link: 'https://leetcode.cn/problems/find-the-duplicate-number/' }
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