import fs from 'node:fs'
import path from 'node:path'

const repoRoot = process.cwd()
const dataPath = path.join(repoRoot, 'data', 'quiz_screen_map.json')
const outDir = path.join(repoRoot, 'Chatium_ASSETS_BY_SCREEN')

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function collectAssetPaths(value, outSet) {
  if (typeof value === 'string') {
    if (value.startsWith('/assets/')) {
      outSet.add(value)
    }
    return
  }

  if (Array.isArray(value)) {
    for (const item of value) collectAssetPaths(item, outSet)
    return
  }

  if (value && typeof value === 'object') {
    for (const key of Object.keys(value)) {
      collectAssetPaths(value[key], outSet)
    }
  }
}

function safeFlatName(assetPath) {
  return assetPath
    .replace(/^\//, '')
    .replace(/^assets\//, '')
    .replace(/[\\/]/g, '__')
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true })
}

function unique(list) {
  return Array.from(new Set(list))
}

const data = readJson(dataPath)
const screens = Array.isArray(data.screens) ? data.screens : []

const sharedAssets = [
  '/assets/brand/usmanova-fit-logo.png',
  '/assets/icons/huge/back.svg',
  '/assets/icons/huge/check.svg',
]

const resultExtraAssets = [
  '/assets/quiz/result/duga.svg',
  '/assets/quiz/result/usmanova_result.webp',
  '/assets/quiz/result/food.webp',
  '/assets/quiz/result/gradient_background.webp',
  '/assets/icons/result/lock.svg',
  '/assets/quiz/before/current_01_slim_soft.png.png',
  '/assets/quiz/before/current_02_soft.png.png',
  '/assets/quiz/before/current_03_fuller.png.png',
  '/assets/quiz/before/target_01_slim_light.png.png',
  '/assets/quiz/before/target_02_toned_fit.png.png',
]

const paywallExtraAssets = [
  '/assets/quiz/result/usmanova_result.webp',
  '/assets/quiz/hero/hero.webp',
  '/assets/quiz/trust/gallery/student-01.webp',
  '/assets/quiz/trust/gallery/student-02.webp',
  '/assets/quiz/trust/gallery/student-03.webp',
  '/assets/quiz/trust/gallery/student-04.webp',
  '/assets/quiz/trust/gallery/student-05.webp',
  '/assets/quiz/trust/gallery/student-06.webp',
  '/assets/quiz/trust/gallery/student-07.webp',
  '/assets/quiz/trust/gallery/student-08.webp',
  '/assets/quiz/trust/gallery/student-09.webp',
  '/assets/quiz/trust/gallery/student-10.webp',
  '/assets/quiz/trust/gallery/student-11.webp',
  '/assets/quiz/trust/gallery/student-12.webp',
  '/assets/quiz/trust/gallery/student-13.webp',
  '/assets/quiz/trust/gallery/student-14.webp',
]

const extraByScreenId = {
  age: ['/assets/quiz/hero/hero.webp'],
  trust_580k: ['/assets/quiz/realistic woman scene/womans.webp'],
  trust_soft_training: ['/assets/quiz/trust/trust-soft-training.mp4'],
  nutrition_assistant: ['/assets/quiz/trust/nutrition-assistant-transition.webp'],
  current_weight: ['/assets/icons/fitness_icons/Fitness-icons/SVG/scale.svg'],
  height: ['/assets/icons/fitness_icons/Fitness-icons/SVG/scale.svg'],
  target_weight: ['/assets/icons/fitness_icons/Fitness-icons/SVG/scale.svg'],
  result: resultExtraAssets,
  paywall: paywallExtraAssets,
}

fs.rmSync(outDir, { recursive: true, force: true })
ensureDir(outDir)

const indexLines = []

for (const screen of screens) {
  const number = Number(screen.number)
  const folderName = String(number).padStart(2, '0')
  const screenDir = path.join(outDir, folderName)
  ensureDir(screenDir)

  const pathSet = new Set()
  collectAssetPaths(screen, pathSet)

  for (const shared of sharedAssets) pathSet.add(shared)

  const extra = extraByScreenId[screen.id] ?? []
  for (const item of extra) pathSet.add(item)

  const assetPaths = unique(Array.from(pathSet)).sort((a, b) => a.localeCompare(b))
  const copiedLines = []
  const missingLines = []

  for (const runtimePath of assetPaths) {
    const relPath = runtimePath.replace(/^\//, '')
    const src = path.join(repoRoot, relPath)
    if (!fs.existsSync(src)) {
      missingLines.push(runtimePath)
      continue
    }

    const targetName = safeFlatName(runtimePath)
    const targetPath = path.join(screenDir, targetName)
    fs.copyFileSync(src, targetPath)
    copiedLines.push(`${runtimePath} => ${targetName}`)
  }

  fs.writeFileSync(path.join(screenDir, 'MAP.txt'), copiedLines.join('\n') + (copiedLines.length ? '\n' : ''), 'utf8')
  if (missingLines.length) {
    fs.writeFileSync(path.join(screenDir, 'MISSING.txt'), missingLines.join('\n') + '\n', 'utf8')
  }

  indexLines.push(`${folderName} (${screen.id}) files=${copiedLines.length} missing=${missingLines.length}`)
}

const readmeLines = [
  'Per-screen asset folders for the quiz flow.',
  '',
  'Format:',
  '- Folder name: screen number (for example 04)',
  '- Inside: copied asset files and MAP.txt',
  '- MAP.txt: runtime path /assets/... => file name in this folder',
  '- MISSING.txt: missing assets that were not found on disk (if any)',
  '',
  'Screens:',
  ...indexLines,
  '',
]

fs.writeFileSync(path.join(outDir, 'README.txt'), readmeLines.join('\n'), 'utf8')

console.log(`written: ${outDir}`)
console.log(`screen folders: ${screens.length}`)