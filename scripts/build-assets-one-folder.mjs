import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const sourceDir = path.join(repoRoot, 'assets');
const outDir = path.join(repoRoot, 'Chatium_ASSETS_ONE_FOLDER');

function walkFiles(dir) {
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      out.push(...walkFiles(full));
    } else {
      out.push(full);
    }
  }
  return out;
}

function normalizePart(part) {
  return part.replace(/[^a-zA-Z0-9._-]/g, '_');
}

if (!fs.existsSync(sourceDir) || !fs.statSync(sourceDir).isDirectory()) {
  throw new Error(`Source assets directory not found: ${sourceDir}`);
}

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const files = walkFiles(sourceDir).sort((a, b) => a.localeCompare(b));
const mapLines = [];
const usedNames = new Set();

for (const absPath of files) {
  const rel = path.relative(sourceDir, absPath).replace(/\\/g, '/');
  const parts = rel.split('/').map(normalizePart);
  const flatName = ['assets', ...parts].join('__');

  if (usedNames.has(flatName)) {
    throw new Error(`Name collision while flattening assets: ${flatName}`);
  }
  usedNames.add(flatName);

  const target = path.join(outDir, flatName);
  fs.copyFileSync(absPath, target);
  mapLines.push(`assets/${rel} => ${flatName}`);
}

const readmeLines = [
  '# Chatium assets single-folder export',
  '',
  'This folder contains all files from project /assets flattened into one directory.',
  'Use MAP.txt to map runtime paths (/assets/...) to filenames in this folder.',
  '',
  'Image optimization status:',
  '- WebP assets were generated and wired in current source where applicable.',
  '- Duplicate JPG/JPEG files were removed where same-name WEBP files exist.',
  '- JPG/JPEG files are kept only when WEBP counterparts are absent.',
  '',
  `Total files: ${files.length}`,
  '',
  'Important:',
  '- Keep filenames exactly as-is when uploading to your storage.',
  '- Runtime code still references /assets/... paths; this folder is a transfer/export package.',
  '',
];

fs.writeFileSync(path.join(outDir, 'README.txt'), readmeLines.join('\n'), 'utf8');
fs.writeFileSync(path.join(outDir, 'MAP.txt'), mapLines.join('\n') + '\n', 'utf8');

console.log(`written: ${outDir}`);
console.log(`files: ${files.length}`);
