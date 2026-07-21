import { promises as fs } from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const sourceRoot = path.join(projectRoot, 'src');
const outputPath = path.join(sourceRoot, 'design-system/architecture/generated-report.json');
const isCheck = process.argv.includes('--check');

async function walk(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return walk(fullPath);
    return /\.[jt]sx?$/.test(entry.name) ? [fullPath] : [];
  }));
  return files.flat();
}

function projectPath(filePath) {
  return path.relative(projectRoot, filePath).split(path.sep).join('/');
}

function isComponentDeepImport(specifier) {
  const normalized = specifier.replaceAll('\\', '/');
  if (!normalized.includes('/components/')) return false;
  const componentTail = normalized.split('/components/')[1];
  return componentTail !== '' && componentTail !== 'index' && componentTail !== 'index.js' && componentTail !== 'product' && componentTail !== 'product.js';
}

const files = await walk(sourceRoot);
const issues = [];

for (const filePath of files) {
  const sourcePath = projectPath(filePath);
  if (sourcePath.startsWith('src/stories/') || sourcePath.startsWith('src/design-system/') || sourcePath.startsWith('src/components/')) continue;
  const source = await fs.readFile(filePath, 'utf8');
  const imports = source.matchAll(/from\s+['"]([^'"]+)['"]/g);
  for (const match of imports) {
    const specifier = match[1];
    if (!isComponentDeepImport(specifier)) continue;
    issues.push({
      id: `internal-import:${sourcePath}:${specifier}`,
      category: 'internal-import',
      severity: 'warning',
      sourcePath,
      message: `Internal import “${specifier}” bypasses a public component barrel.`
    });
  }
}

issues.sort((a, b) => a.id.localeCompare(b.id));
const report = `${JSON.stringify(issues, null, 2)}\n`;

if (isCheck) {
  let current = '';
  try {
    current = await fs.readFile(outputPath, 'utf8');
  } catch {
    // A missing generated report is reported below.
  }
  if (current !== report) {
    console.error('Design architecture report is stale. Run npm run architecture:report.');
    process.exitCode = 1;
  } else {
    console.log(`Design architecture report is current (${issues.length} boundary findings).`);
  }
} else {
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, report);
  console.log(`Wrote ${projectPath(outputPath)} with ${issues.length} boundary findings.`);
}
