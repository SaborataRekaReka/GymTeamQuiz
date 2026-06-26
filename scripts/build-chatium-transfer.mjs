import fs from 'node:fs';
import path from 'node:path';

const repoRoot = 'c:/projects/dev/GymTeamQuiz';
const root = path.join(repoRoot, 'chatium');

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

function walkDirs(dir) {
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      out.push(full);
      out.push(...walkDirs(full));
    }
  }
  return out;
}

const files = walkFiles(root)
  .filter((f) => !f.endsWith('CHATIUM_TRANSFER.txt'))
  .sort((a, b) => a.localeCompare(b));
const relFiles = files.map((f) => path.relative(root, f).replace(/\\/g, '/'));

const lines = [];
lines.push('Chatium/');

const printedDirs = new Set();
for (const rel of relFiles) {
  const parts = rel.split('/');

  for (let i = 0; i < parts.length - 1; i += 1) {
    const dirPath = parts.slice(0, i + 1).join('/');
    if (!printedDirs.has(dirPath)) {
      printedDirs.add(dirPath);
      lines.push(`${'  '.repeat(i + 1)}${parts[i]}/`);
    }
  }

  const fileDepth = parts.length - 1;
  lines.push(`${'  '.repeat(fileDepth + 1)}${parts[parts.length - 1]}`);
}

lines.push('');

for (let i = 0; i < files.length; i += 1) {
  const rel = relFiles[i];
  lines.push(`=== Chatium/${rel} ===`);
  lines.push(fs.readFileSync(files[i], 'utf8'));
  lines.push('');
}

const outPath = path.join(root, 'CHATIUM_TRANSFER.txt');
fs.writeFileSync(outPath, lines.join('\n'), 'utf8');

const kb = (fs.statSync(outPath).size / 1024).toFixed(1);
console.log(`written: ${outPath}`);
console.log(`files: ${files.length}`);
console.log(`sizeKB: ${kb}`);
