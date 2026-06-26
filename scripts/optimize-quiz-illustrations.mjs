import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

// Сжимаем тяжёлые иллюстрации экранов 2 и 3 (PNG -> WebP, уменьшенный размер).
const groups = ['assets/quiz/2', 'assets/quiz/3']
const MAX_HEIGHT = 640
const QUALITY = 74

let totalBefore = 0
let totalAfter = 0

for (const dir of groups) {
  const abs = path.resolve(dir)
  if (!fs.existsSync(abs)) continue
  for (const name of fs.readdirSync(abs)) {
    if (!name.toLowerCase().endsWith('.png')) continue
    const input = path.join(abs, name)
    const output = path.join(abs, name.replace(/\.png$/i, '.webp'))
    const before = fs.statSync(input).size

    const meta = await sharp(input).metadata()
    const pipeline = sharp(input)
    if (meta.height && meta.height > MAX_HEIGHT) {
      pipeline.resize({ height: MAX_HEIGHT, withoutEnlargement: true })
    }
    await pipeline.webp({ quality: QUALITY, effort: 6 }).toFile(output)

    const after = fs.statSync(output).size
    totalBefore += before
    totalAfter += after
    console.log(
      `${path.relative(process.cwd(), output)}  ${(before / 1024).toFixed(1)}KB -> ${(after / 1024).toFixed(1)}KB`,
    )
  }
}

console.log(`\nИтого: ${(totalBefore / 1024).toFixed(1)}KB -> ${(totalAfter / 1024).toFixed(1)}KB`)
