import { copyFileSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sourceDir = join(__dirname, '..', 'data');
const targetDir = join(__dirname, '..', 'public', 'data');

function copyDirectory(source, target) {
  // Create target directory if it doesn't exist
  mkdirSync(target, { recursive: true });

  // Read all files and directories in source
  const items = readdirSync(source);

  items.forEach(item => {
    const sourcePath = join(source, item);
    const targetPath = join(target, item);
    const stat = statSync(sourcePath);

    if (stat.isDirectory()) {
      copyDirectory(sourcePath, targetPath);
    } else {
      copyFileSync(sourcePath, targetPath);
      console.log(`Copied: ${item}`);
    }
  });
}

console.log('Copying data files to public directory...');
copyDirectory(sourceDir, targetDir);
console.log('Data files copied successfully!');
