import { AbsoluteFill, Img, Sequence, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { useState } from 'react';

export type Lamina = { tipo: 'portada' | 'punto'; titulo: string; pill?: string; num?: string; texto?: string; lista?: string[]; nota?: string; svg?: string; fondo?: string };
export type Post = { id: string; fondo: string; slides: Lamina[] };

const C = { navy: '#0B1B2B', suave: '#C9D3DE', naranja: '#FF7A1A' };
const FPS = 30;
export const TRANSICION = 12; // cuadros de fundido entre láminas

// Tiempo en pantalla: lo justo para leer cada lámina.
export const duracionLamina = (s: Lamina) => {
  if (s.tipo === 'portada') return Math.round(3 * FPS);
  const palabras = [s.titulo, s.texto, ...(s.lista ?? []), s.nota].join(' ').replace(/<[^>]+>/g, '').split(/\s+/).length;
  return Math.round(Math.min(8, Math.max(4, 1.2 + palabras / 4)) * FPS);
};

const useFuentes = () => {
  const [h] = useState(() => delayRender('fuentes'));
  useState(() => {
    Promise.all([500, 700, 800].map(w => new FontFace('Montserrat', `url(${staticFile(`montserrat-${w}.woff2`)})`, { weight: String(w) })
      .load().then(f => document.fonts.add(f)))).then(() => continueRender(h));
  });
};

const css = `
em{font-style:normal;color:${C.naranja}}
`;

const Html = ({ html, style }: { html: string; style?: React.CSSProperties }) =>
  <div style={style} dangerouslySetInnerHTML={{ __html: html }} />;

const LaminaVideo = ({ s, post, dur }: { s: Lamina; post: Post; dur: number }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const portada = s.tipo === 'portada';
  const entra = (desde: number) => spring({ frame: f - desde, fps, config: { damping: 200 } });
  const opacidad = interpolate(f, [0, TRANSICION, dur - TRANSICION, dur], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const zoom = interpolate(f, [0, dur], [1.05, 1.15]);
  const t = entra(4);
  let d = 14; // cada elemento entra un poco después del anterior
  const sube = (x: number) => ({ opacity: x, transform: `translateY(${(1 - x) * 40}px)` });
  const sig = () => entra((d += 9));

  return (
    <AbsoluteFill style={{ opacity: opacidad }}>
      <AbsoluteFill style={{ backgroundImage: `url(${staticFile(`fondo-${s.fondo || post.fondo}.png`)})`, backgroundSize: 'cover', backgroundPosition: 'center', transform: `scale(${zoom})` }} />
      <AbsoluteFill style={{ background: portada
        ? 'linear-gradient(180deg,rgba(6,16,28,.8) 0%,rgba(6,16,28,.35) 40%,rgba(6,16,28,.2) 65%,rgba(6,16,28,.7) 100%)'
        : 'linear-gradient(180deg,rgba(6,16,28,.93) 0%,rgba(6,16,28,.86) 60%,rgba(6,16,28,.93) 100%)' }} />
      {/* Zona segura de Reels/TikTok: nada importante arriba de 250 px ni bajo 1500 px */}
      <div style={{ position: 'absolute', left: 80, right: 80, top: portada ? 380 : 270, bottom: 430, display: 'flex', flexDirection: 'column' }}>
        {s.num && <div style={{ ...sube(entra(0)), fontSize: 130, fontWeight: 800, color: C.naranja, lineHeight: 1, marginBottom: 24 }}>{s.num}</div>}
        <div style={{ position: 'relative', opacity: t, transform: `translateX(${(1 - t) * -60}px)` }}>
          <div style={{ position: 'absolute', left: -28, top: -12, bottom: -14, width: 9, background: C.naranja, transform: `scaleY(${t})`, transformOrigin: 'top' }} />
          <Html html={s.titulo} style={{ fontWeight: 800, textTransform: 'uppercase', lineHeight: 1.08, letterSpacing: 0.5, fontSize: portada ? 104 : 74 }} />
        </div>
        {s.pill && (() => { const x = sig(); return (
          <div style={{ alignSelf: 'flex-start', marginTop: 44, background: C.naranja, color: C.navy, fontWeight: 800, fontSize: 34, textTransform: 'uppercase', padding: '16px 28px', borderRadius: 18, opacity: x, transform: `scale(${0.6 + 0.4 * x})`, transformOrigin: 'left center' }}>{s.pill}</div>); })()}
        {s.texto && <Html html={s.texto} style={{ ...sube(sig()), fontSize: 46, lineHeight: 1.4, fontWeight: 500, marginTop: 48 }} />}
        {s.lista && <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 34 }}>
          {s.lista.map((x, i) => { const v = entra((d += 14)); return (
            <div key={i} style={{ ...sube(v), position: 'relative', paddingLeft: 52, fontSize: 44, lineHeight: 1.32, fontWeight: 700 }}>
              <div style={{ position: 'absolute', left: 0, top: 15, width: 24, height: 24, borderRadius: 6, background: C.naranja }} />
              <Html html={x} />
            </div>); })}
        </div>}
        {s.svg && <Html html={s.svg} style={{ ...sube(sig()), marginTop: 'auto', display: 'flex', justifyContent: 'center' }} />}
        {s.nota && <Html html={s.nota} style={{ ...sube(sig()), marginTop: 'auto', background: 'rgba(255,255,255,.08)', borderLeft: `9px solid ${C.naranja}`, padding: '28px 32px', fontSize: 36, lineHeight: 1.4, color: C.suave, borderRadius: 8 }} />}
      </div>
    </AbsoluteFill>
  );
};

export const Reel = ({ post }: { postId: string; post: Post | null }) => {
  useFuentes();
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  if (!post) return null;
  let desde = 0;
  return (
    <AbsoluteFill style={{ background: C.navy, color: '#fff', fontFamily: "Montserrat,'DejaVu Sans',sans-serif" }}>
      <style>{css}</style>
      {post.slides.map((s, i) => {
        const dur = duracionLamina(s);
        const seq = <Sequence key={i} from={desde} durationInFrames={dur}><LaminaVideo s={s} post={post} dur={dur} /></Sequence>;
        desde += dur - TRANSICION;
        return seq;
      })}
      {/* Barra de progreso naranja */}
      <div style={{ position: 'absolute', left: 0, top: 0, height: 10, width: `${(f / durationInFrames) * 100}%`, background: C.naranja }} />
      <div style={{ position: 'absolute', left: 80, bottom: 300, fontWeight: 800, fontSize: 28, letterSpacing: 0.8 }}>INSPECCIÓN SOLDADURA CHILE</div>
      <Img src={staticFile('logo.png')} style={{ position: 'absolute', right: 80, bottom: 280, width: 130, height: 130 }} />
    </AbsoluteFill>
  );
};
