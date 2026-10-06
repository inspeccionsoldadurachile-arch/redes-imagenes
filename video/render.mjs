// Uso: node render.mjs <carpeta-del-lote> <id-del-post> [archivo.json, por defecto lote.json]
// Copia lote.json (y sus fotos) a public/ y genera <carpeta>/<id>-reel.mp4 (1080x1920, 30 fps).
import { copyFileSync, mkdirSync, readFileSync } from 'fs';
import { execFileSync } from 'child_process';
import path from 'path';
const [dir, postId, json = 'lote.json'] = process.argv.slice(2);
copyFileSync(path.join(dir, json), 'public/lote.json');
// Fotos y clips de referencia: cada lámina puede traer "imagen" o "video" (archivo dentro de la carpeta del lote).
mkdirSync('public/img', { recursive: true });
const post = JSON.parse(readFileSync(path.join(dir, json), 'utf8')).posts.find(p => p.id === postId);
for (const s of post.slides) for (const f of [s.imagen, s.video].filter(Boolean)) {
  mkdirSync(path.dirname(path.join('public/img', f)), { recursive: true });
  copyFileSync(path.join(dir, f), path.join('public/img', f));
}
execFileSync('npx', ['remotion', 'render', 'src/index.ts', 'Reel', path.join(dir, `${postId}-reel.mp4`),
  `--props=${JSON.stringify({ postId })}`, '--browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell', '--codec=h264', '--crf=20'], { stdio: 'inherit' });
