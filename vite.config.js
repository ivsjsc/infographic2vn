import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';
import path from 'path';

// Dynamically find all HTML files in root directory
function getHtmlInputs() {
  const inputs = { main: resolve(__dirname, 'index.html') };
  const files = fs.readdirSync(__dirname);
  files.forEach(file => {
    if (file.endsWith('.html') && file !== 'index.html') {
      const name = file.replace('.html', '');
      inputs[name] = resolve(__dirname, file);
    }
  });
  return inputs;
}

// Plugin to copy static asset folders to dist
function copyStaticAssets(dirs) {
  return {
    name: 'copy-static-assets',
    closeBundle() {
      for (const dir of dirs) {
        const src = resolve(__dirname, dir);
        const dest = resolve(__dirname, 'dist', dir);
        if (fs.existsSync(src)) {
          copyDirSync(src, dest);
          console.log(`Copied ${dir}/ to dist/${dir}/`);
        }
      }
    }
  };
}

function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: getHtmlInputs()
    }
  },
  plugins: [
    copyStaticAssets(['js', 'css', 'images'])
  ]
});
