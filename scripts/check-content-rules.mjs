import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const textExtensions = new Set(['.ts', '.tsx', '.md', '.json'])
const ignoredDirs = new Set(['node_modules', '.git', 'dist'])

const violations = []

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignoredDirs.has(entry.name)) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full)
    else if (textExtensions.has(path.extname(entry.name))) checkFile(full)
  }
}

function checkFile(file) {
  const content = fs.readFileSync(file, 'utf8')
  const rel = path.relative(root, file)
  if (/[“”\"]/u.test(content) && !rel.endsWith('package.json') && !rel.endsWith('tsconfig.json')) {
    violations.push(`${rel}: проверьте кавычки в пользовательских текстах. В интерфейсе нужны только «ёлочки».`)
  }
  if (/—|-->|→/u.test(content)) {
    violations.push(`${rel}: в пользовательских текстах запрещены длинные тире и стрелки.`)
  }
}

walk(root)

if (violations.length) {
  console.error(violations.join('\n'))
  process.exit(1)
}

console.log('Content rules check passed')
