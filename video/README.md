# Reels animados — Inspección Soldadura Chile

Convierte un post del feed (`lote.json`) en un video vertical 1080×1920 para Reels, TikTok y Shorts, con el mismo diseño de marca: foto de fondo, barra naranja, titular en mayúsculas, etiqueta naranja, pie y logo.

## Uso
```
npm install
npm run video -- <carpeta-del-lote> <id-del-post>
# ej: npm run video -- ../contenido/2026-10-12 lun-metodos-ndt  → crea lun-metodos-ndt-reel.mp4 en esa carpeta
npm run estudio   # abre el editor visual de Remotion en el navegador para ver y ajustar
```

## Qué hace
- Cada lámina entra animada: titular desde la izquierda, barra naranja que crece, etiqueta que aparece y puntos de la lista uno a uno.
- Fondo con zoom lento y fundido entre láminas. Barra de progreso naranja arriba.
- El tiempo de cada lámina se calcula según cuánto texto tiene (4 a 8 s).
- El texto queda dentro de la zona segura (no lo tapan los botones de Instagram/TikTok).
- Foto de referencia opcional por lámina: en `lote.json` se agrega `"imagen": "archivo.jpg"` (la foto va en la misma carpeta del lote) y, si corresponde, `"credito": "Autor / licencia"`. Aparece en un recuadro con borde naranja y la marca "IMAGEN REFERENCIAL".
- Sin audio: la música se agrega en la app (audio en tendencia) o se suma después.

`render.mjs` usa el Chromium del entorno de Claude; en otro computador se borra la opción `--browser-executable`.
Remotion es gratis para personas y empresas de hasta 3 empleados.
