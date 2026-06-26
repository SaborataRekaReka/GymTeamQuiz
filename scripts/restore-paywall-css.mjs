import { execSync } from 'node:child_process'
import fs from 'node:fs'

// 1. Достаём версию live-preview.css до удаления paywall CSS.
const oldCss = execSync('git show 67e0a8a~1:assets/live-preview.css', {
  encoding: 'utf8',
  maxBuffer: 64 * 1024 * 1024,
})
const lines = oldCss.split(/\r?\n/)

// 2. Находим начало блока paywall по маркер-комментарию.
const startIdx = lines.findIndex((l) => l.includes('===== Paywall'))
if (startIdx < 0) {
  throw new Error('Paywall CSS marker not found')
}
const paywallBlockRaw = lines.slice(startIdx).join('\n').replace(/\s+$/, '') + '\n'

console.log('paywall block lines:', lines.length - startIdx)
console.log('paywall occurrences:', (paywallBlockRaw.match(/paywall/g) || []).length)

// 3. Вставляем в theme.ts перед закрывающим бэктиком шаблонной строки.
//    Для Vue/Solid оболочка называется .quiz-shell, поэтому адаптируем селектор.
const themePath = 'src/ui/theme.ts'
const theme = fs.readFileSync(themePath, 'utf8')
const lastBacktick = theme.lastIndexOf('`')
if (lastBacktick < 0) throw new Error('theme.ts template literal end not found')

const paywallForTheme = paywallBlockRaw.replace(/\.shell:has\(\.paywall\)/g, '.quiz-shell:has(.paywall)')

if (theme.includes('===== Paywall')) {
  console.log('theme.ts already has paywall CSS, skipping theme insert')
} else {
  const patchedTheme =
    theme.slice(0, lastBacktick) + '\n' + paywallForTheme + '\n' + theme.slice(lastBacktick)
  fs.writeFileSync(themePath, patchedTheme, 'utf8')
  console.log('theme.ts patched, new length:', patchedTheme.length)
}

// 4. Возвращаем блок и в live-preview.css (оболочка там называется .shell).
const lpPath = 'assets/live-preview.css'
const lp = fs.readFileSync(lpPath, 'utf8')
if (lp.includes('===== Paywall')) {
  console.log('live-preview.css already has paywall CSS, skipping')
} else {
  fs.writeFileSync(lpPath, lp.replace(/\s+$/, '') + '\n\n' + paywallBlockRaw, 'utf8')
  console.log('live-preview.css patched')
}
