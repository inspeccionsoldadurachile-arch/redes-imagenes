// Uso: node render.mjs <carpeta-del-lote> <id-del-post>
// Copia lote.json (y sus fotos) a public/ y genera <carpeta>/<id>-reel.mp4 (1080x1920, 30 fps).
import { copyFileSync, mkdirSync, readFileSync } from 'fs';
import { execFileSync } from 'child_process';
import path from 'path';
const [dir, postId] = process.argv.slice(2);
copyFileSync(path.join(dir, 'lote.json'), 'public/lote.json');
// Fotos de referencia: cada lámina puede traer "imagen" (archivo dentro de la carpeta del lote).
mkdirSync('public/img', { recursive: true });
const post = JSON.parse(readFileSync(path.join(dir, 'lote.json'), 'utf8')).posts.find(p => p.id === postId);
for (const s of post.slides) if (s.imagen) copyFileSync(path.join(dir, s.imagen), path.join('public/img', s.imagen));
execFileSync('npx', ['remotion', 'render', 'src/index.ts', 'Reel', path.join(dir, `${postId}-reel.mp4`),
  `--props=${JSON.stringify({ postId })}`, '--browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell', '--codec=h264', '--crf=20'], { stdio: 'inherit' });
