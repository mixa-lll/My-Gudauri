import { copyFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const publicScripts = resolve(root, 'public/scripts');

await mkdir(publicScripts, { recursive: true });

for (const filename of ['shared-navbar.js', 'shared-faq.js', 'design-3-profile.js']) {
  await copyFile(resolve(root, 'scripts', filename), resolve(publicScripts, filename));
}
