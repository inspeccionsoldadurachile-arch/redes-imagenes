import { Composition, staticFile } from 'remotion';
import { Reel, duracionLamina, TRANSICION, type Post } from './Reel';

// Lee public/lote.json (el mismo formato del feed) y arma un video vertical con el post elegido.
export const Root = () => (
  <Composition
    id="Reel"
    component={Reel}
    width={1080}
    height={1920}
    fps={30}
    durationInFrames={300}
    defaultProps={{ postId: 'lun-metodos-ndt', post: null as Post | null }}
    calculateMetadata={async ({ props }) => {
      const lote = await fetch(staticFile('lote.json')).then(r => r.json());
      const post: Post = lote.posts.find((p: Post) => p.id === props.postId) ?? lote.posts[0];
      const total = post.slides.reduce((t, s) => t + duracionLamina(s), 0) - TRANSICION * (post.slides.length - 1);
      return { durationInFrames: total, props: { ...props, post } };
    }}
  />
);
