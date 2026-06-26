import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const repoRoot = process.cwd();

function mb(bytes) {
  return (bytes / (1024 * 1024)).toFixed(2);
}

function fileSize(filePath) {
  return fs.statSync(filePath).size;
}

async function ensureDir(filePath) {
  await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
}

const baseTasks = [
  {
    input: 'assets/quiz/hero/hero.jpg',
    output: 'assets/quiz/hero/hero.webp',
    width: 1600,
    quality: 72,
    alphaQuality: 90,
  },
  {
    input: 'assets/quiz/realistic woman scene/womans.jpeg',
    output: 'assets/quiz/realistic woman scene/womans.webp',
    width: 1400,
    quality: 74,
    alphaQuality: 90,
  },
  {
    input: 'assets/quiz/trust/nutrition-assistant-transition.jpeg',
    output: 'assets/quiz/trust/nutrition-assistant-transition.webp',
    width: 1400,
    quality: 74,
    alphaQuality: 90,
  },
  {
    input: 'assets/quiz/trust/trust-soft-training.jpeg',
    output: 'assets/quiz/trust/trust-soft-training.webp',
    width: 1400,
    quality: 74,
    alphaQuality: 90,
  },
  {
    input: 'assets/quiz/trust/trust-580k.jpg',
    output: 'assets/quiz/trust/trust-580k.webp',
    width: 1400,
    quality: 74,
    alphaQuality: 90,
  },
  {
    input: 'assets/quiz/result/usmanova_result.png',
    output: 'assets/quiz/result/usmanova_result.webp',
    width: 700,
    quality: 78,
    alphaQuality: 90,
  },
  {
    input: 'assets/quiz/result/food.png',
    output: 'assets/quiz/result/food.webp',
    width: 420,
    quality: 76,
    alphaQuality: 88,
  },
  {
    input: 'assets/quiz/result/gradient_background.png',
    output: 'assets/quiz/result/gradient_background.webp',
    width: 900,
    quality: 76,
    alphaQuality: 88,
  },
];

const galleryTasks = Array.from({ length: 14 }, (_, i) => {
  const num = String(i + 1).padStart(2, '0');
  return {
    input: `assets/quiz/trust/gallery/student-${num}.jpg`,
    output: `assets/quiz/trust/gallery/student-${num}.webp`,
    width: 820,
    quality: 74,
    alphaQuality: 90,
  };
});

const tasks = [...baseTasks, ...galleryTasks];

let totalBefore = 0;
let totalAfter = 0;

for (const task of tasks) {
  const absInput = path.join(repoRoot, task.input);
  const absOutput = path.join(repoRoot, task.output);

  if (!fs.existsSync(absInput)) {
    console.warn(`skip (missing): ${task.input}`);
    continue;
  }

  await ensureDir(absOutput);

  let pipeline = sharp(absInput, { failOn: 'none' }).rotate();
  const meta = await pipeline.metadata();

  if (task.width && meta.width && meta.width > task.width) {
    pipeline = pipeline.resize({ width: task.width, withoutEnlargement: true });
  }

  await pipeline
    .webp({
      quality: task.quality,
      alphaQuality: task.alphaQuality,
      effort: 6,
      smartSubsample: true,
    })
    .toFile(absOutput);

  const before = fileSize(absInput);
  const after = fileSize(absOutput);
  totalBefore += before;
  totalAfter += after;

  const saved = before - after;
  const pct = before > 0 ? ((saved / before) * 100).toFixed(1) : '0.0';
  console.log(`${task.input} -> ${task.output}`);
  console.log(`  ${mb(before)} MB -> ${mb(after)} MB (${pct}% saved)`);
}

const totalSaved = totalBefore - totalAfter;
const totalPct = totalBefore > 0 ? ((totalSaved / totalBefore) * 100).toFixed(1) : '0.0';
console.log('---');
console.log(`TOTAL: ${mb(totalBefore)} MB -> ${mb(totalAfter)} MB (${totalPct}% saved)`);
