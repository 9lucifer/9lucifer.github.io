const fs = require('fs');
const path = require('path');

const HOT100_DIR = path.join(__dirname, '../docs/algorithm/hot100');
const INDEX_FILE = path.join(HOT100_DIR, 'index.md');

// 读取 index.md
const indexContent = fs.readFileSync(INDEX_FILE, 'utf-8');

// 解析题目列表
const lines = indexContent.split('\n');
const problems = [];

for (const line of lines) {
  const match = line.match(/^\s*-\s*\[(\d+)\.\s+(.+)\]\((.+)\.md\)$/);
  if (match) {
    problems.push({
      number: parseInt(match[1]),
      title: match[2],
      filename: match[3]
    });
  }
}

// 检查每个文件是否有内容
const emptyFiles = [];
for (const problem of problems) {
  const filePath = path.join(HOT100_DIR, `${problem.filename}.md`);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    // 检查是否只有模板内容（少于 15 行，或者 java 代码块是空的）
    const lines = content.split('\n').filter(l => l.trim() !== '');
    const hasCode = content.includes('```java') && content.split('```java').length > 2;
    if (lines.length < 10 || !hasCode) {
      emptyFiles.push(problem);
    }
  } else {
    emptyFiles.push({ ...problem, missing: true });
  }
}

console.log(`总题目数: ${problems.length}`);
console.log(`有题解: ${problems.length - emptyFiles.length}`);
console.log(`没有题解/只有模板: ${emptyFiles.length}`);
console.log('\n没有题解的题目:');
for (const p of emptyFiles) {
  const status = p.missing ? '(文件缺失)' : '(只有模板)';
  console.log(`  ${p.number}. ${p.title} ${status}`);
}
