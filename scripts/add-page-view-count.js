const fs = require('fs')
const path = require('path')

const repoRoot = path.resolve(__dirname, '..')
const docsRoot = path.join(repoRoot, 'docs')
const componentTag = '<PageViewCount />'

const args = process.argv.slice(2)
const runAll = args.includes('--all')
const explicitPaths = args.filter((arg) => !arg.startsWith('--'))

const skipDirs = new Set(['.vitepress', 'public', 'css', 'raw', 'node_modules'])

function isMarkdownFile(filePath) {
  return path.extname(filePath).toLowerCase() === '.md'
}

function isIndexFile(filePath) {
  return path.basename(filePath).toLowerCase() === 'index.md'
}

function normalizeInputPath(inputPath) {
  return path.isAbsolute(inputPath) ? inputPath : path.resolve(repoRoot, inputPath)
}

function collectMarkdownFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const result = []

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      if (skipDirs.has(entry.name)) continue
      result.push(...collectMarkdownFiles(fullPath))
      continue
    }

    if (!entry.isFile()) continue
    if (!isMarkdownFile(fullPath)) continue
    if (isIndexFile(fullPath)) continue

    result.push(fullPath)
  }

  return result
}

function splitFrontmatter(content, eol) {
  if (!content.startsWith(`---${eol}`)) {
    return { frontmatter: '', body: content }
  }

  const endMarker = `${eol}---${eol}`
  const endIndex = content.indexOf(endMarker, 4)
  if (endIndex === -1) {
    return { frontmatter: '', body: content }
  }

  const frontmatterEnd = endIndex + endMarker.length
  return {
    frontmatter: content.slice(0, frontmatterEnd),
    body: content.slice(frontmatterEnd)
  }
}

function ensureComponent(content) {
  if (content.includes(componentTag)) {
    return { changed: false, content }
  }

  const eol = content.includes('\r\n') ? '\r\n' : '\n'
  const hasBom = content.charCodeAt(0) === 0xfeff
  const raw = hasBom ? content.slice(1) : content
  const { frontmatter, body } = splitFrontmatter(raw, eol)
  const bodyLines = body.split(eol)

  let headingIndex = -1
  for (let i = 0; i < bodyLines.length; i += 1) {
    const line = bodyLines[i].trim()
    if (!line) continue
    if (line.startsWith('# ')) {
      headingIndex = i
    }
    break
  }

  if (headingIndex >= 0) {
    bodyLines.splice(headingIndex + 1, 0, componentTag)
    if (bodyLines[headingIndex + 2] && bodyLines[headingIndex + 2].trim() !== '') {
      bodyLines.splice(headingIndex + 2, 0, '')
    }
  } else {
    bodyLines.unshift(componentTag)
    if (bodyLines[1] && bodyLines[1].trim() !== '') {
      bodyLines.splice(1, 0, '')
    }
  }

  const nextContent = `${frontmatter}${bodyLines.join(eol)}`
  return { changed: true, content: hasBom ? `\ufeff${nextContent}` : nextContent }
}

function processFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf8')
  const result = ensureComponent(original)
  if (!result.changed) return false
  fs.writeFileSync(filePath, result.content, 'utf8')
  return true
}

function resolveTargets() {
  if (runAll) {
    return collectMarkdownFiles(docsRoot)
  }

  if (!explicitPaths.length) {
    console.error('Usage: node scripts/add-page-view-count.js --all')
    console.error('   or: node scripts/add-page-view-count.js docs/path/to/article.md')
    process.exit(1)
  }

  return explicitPaths.map(normalizeInputPath)
}

const targets = resolveTargets()
let changedCount = 0

for (const filePath of targets) {
  if (!fs.existsSync(filePath)) {
    console.warn(`[SKIP] File not found: ${filePath}`)
    continue
  }

  if (!isMarkdownFile(filePath)) {
    console.warn(`[SKIP] Not a markdown file: ${filePath}`)
    continue
  }

  if (processFile(filePath)) {
    changedCount += 1
    console.log(`[UPDATED] ${path.relative(repoRoot, filePath)}`)
  }
}

console.log(`[DONE] Updated ${changedCount} file(s).`)
