import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const textExtensions = new Set(['.ts', '.tsx', '.json'])
const sourceDirs = ['data', 'src']

const violations = []

function walk(dir) {
  if (!fs.existsSync(dir)) return
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full)
    else if (textExtensions.has(path.extname(entry.name))) checkFile(full, path.relative(root, full))
  }
}

function checkFile(file, rel) {
  const content = fs.readFileSync(file, 'utf8')

  if (path.extname(file) === '.json') {
    checkJsonContent(content, rel)
    return
  }

  checkTsLikeContent(content, rel)
}

function checkJsonContent(content, rel) {
  let parsed
  try {
    parsed = JSON.parse(content)
  } catch {
    return
  }

  visitJson(parsed, '', (value, valuePath) => {
    checkUserText(value, `${rel}${valuePath}`)
  })
}

function visitJson(value, currentPath, onString) {
  if (typeof value === 'string') {
    onString(value, currentPath)
    return
  }

  if (Array.isArray(value)) {
    value.forEach((entry, index) => visitJson(entry, `${currentPath}[${index}]`, onString))
    return
  }

  if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      const suffix = currentPath ? `.${key}` : `.${key}`
      visitJson(nested, `${currentPath}${suffix}`, onString)
    }
  }
}

function checkTsLikeContent(content, rel) {
  const stringLiteralRegex = /(['"`])((?:\\.|(?!\1)[\s\S])*)\1/g
  for (const match of content.matchAll(stringLiteralRegex)) {
    const literal = match[2]
    checkUserText(literal, rel)
  }
}

function checkUserText(value, sourceRef) {
  if (!/[А-Яа-яЁё]/u.test(value)) return

  if (/[“”"]/u.test(value)) {
    violations.push(`${sourceRef}: проверьте кавычки в пользовательских текстах. В интерфейсе нужны только «ёлочки».`)
  }
  if (/—|-->|→/u.test(value)) {
    violations.push(`${sourceRef}: в пользовательских текстах запрещены длинные тире и стрелки.`)
  }
}

for (const relativeDir of sourceDirs) {
  walk(path.join(root, relativeDir))
}

if (violations.length) {
  console.error(violations.join('\n'))
  process.exit(1)
}

console.log('Content rules check passed')
