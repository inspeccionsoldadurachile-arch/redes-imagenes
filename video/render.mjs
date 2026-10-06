// Uso: node render.mjs <carpeta-del-lote> <id-del-post>
// Copia lote.json a public/ y genera <carpeta>/<id>-reel.mp4 (1080x1920, 30 fps).
import { copyFileSync } from 'fs';
import { execFileSync } from 'child_process';
import path from 'path';
const [dir, postId] = process.argv.slice(2);
copyFileSync(path.join(dir, 'lote.json'), 'public/lote.json');
execFileSync('npx', ['remotion', 'render', 'src/index.ts', 'Reel', path.join(dir, `${postId}-reel.mp4`),
  `--props=${JSON.stringify({ postId })}`, '--browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell', '--codec=h264', '--crf=20'], { stdio: 'inherit' });
