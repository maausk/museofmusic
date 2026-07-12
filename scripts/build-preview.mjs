import { readFileSync, writeFileSync } from 'node:fs';

const slugs = [
  'wind-of-change', 'living-on-a-prayer', 'hurt',
  'november-rain', 'nothing-else-matters', 'under-the-bridge',
];

// Lee cada SVG y hace únicos los ids (glow/soft) para que no colisionen al
// inlinar 6 SVG en un mismo documento.
const svgs = {};
for (const s of slugs) {
  let raw = readFileSync(new URL(`../public/obras/${s}.svg`, import.meta.url), 'utf8');
  const key = s.replace(/-/g, '');
  raw = raw
    .replaceAll('id="glow"', `id="glow_${key}"`)
    .replaceAll('url(#glow)', `url(#glow_${key})`)
    .replaceAll('id="soft"', `id="soft_${key}"`)
    .replaceAll('url(#soft)', `url(#soft_${key})`)
    // que el SVG llene la tarjeta
    .replace('<svg ', '<svg preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block" ');
  svgs[s] = raw;
}

const meta = {
  'living-on-a-prayer': { cat: 'MOS-002', acc: '#E8622C' },
  'hurt': { cat: 'MOS-003', acc: '#B5462F' },
  'november-rain': { cat: 'MOS-004', acc: '#C0362C' },
  'nothing-else-matters': { cat: 'MOS-005', acc: '#D9A24A' },
  'under-the-bridge': { cat: 'MOS-006', acc: '#E09A3E' },
};

const card = (s) => `
  <a class="card" style="--a:${meta[s].acc}">
    <div class="card__frame"><div class="card__img">${svgs[s]}</div>
      <div class="card__foot">
        <span class="card__cat">${meta[s].cat}</span>
        <span class="card__teaser">¿Qué canción es? →</span>
      </div>
    </div>
  </a>`;

const html = `
<style>
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,560&family=Hanken+Grotesk:wght@400;500;600&family=Space+Mono:wght@400;700&display=swap');
.mof { --paper:#F4F5F3; --sink:#ECEDE8; --ink:#16150F; --soft:#66655B; --line:#DEDFD7; --lsoft:#E9EAE3; --accent:#1B34E8; --accentink:#1226B8;
  --fd:'Fraunces',Georgia,serif; --fb:'Hanken Grotesk',system-ui,sans-serif; --fm:'Space Mono',monospace;
  background:var(--paper); color:var(--ink); font-family:var(--fb); padding:0 clamp(16px,4vw,44px) 40px; border-radius:6px; }
.mof * { box-sizing:border-box; margin:0; }
.mof__head { display:flex; justify-content:space-between; align-items:baseline; padding:20px 0; border-bottom:1px solid var(--lsoft); }
.mof__wm { font-family:var(--fd); font-size:1.2rem; letter-spacing:-.02em; }
.mof__wm b { color:var(--accent); font-weight:400; }
.mof__nav { font-size:.8rem; color:var(--soft); display:flex; gap:20px; }
.eyebrow { font-family:var(--fm); font-size:.72rem; text-transform:uppercase; letter-spacing:.14em; color:var(--soft); }
.intro { padding:52px 0 20px; }
.intro h1 { font-family:var(--fd); font-weight:560; font-size:clamp(3rem,9vw,6rem); line-height:1; letter-spacing:-.02em; margin-top:8px; }
.intro p { max-width:34ch; font-size:1.4rem; line-height:1.35; margin-top:14px; }
.intro em { font-style:italic; color:var(--accentink); }
.hero { display:grid; grid-template-columns:1.1fr .9fr; gap:44px; align-items:center; padding:36px 0; border-top:1px solid var(--line); --a:#E4A33C; }
.hero__art { border:1px solid var(--line); border-radius:2px; overflow:hidden; aspect-ratio:4/5; }
.hero__side .plac { font-family:var(--fm); font-size:.72rem; letter-spacing:.06em; color:var(--soft); }
.hero__side h2 { font-family:var(--fd); font-weight:560; font-size:clamp(2rem,4vw,3.2rem); margin-top:10px; letter-spacing:-.015em; }
.hero__side .desc { max-width:40ch; color:var(--soft); margin-top:14px; font-size:1.1rem; }
.btn { display:inline-flex; gap:.5em; margin-top:22px; padding:.7em 1.2em; background:var(--ink); color:var(--paper); border-radius:2px; font-size:.8rem; letter-spacing:.02em; }
.colhead { display:flex; justify-content:space-between; align-items:baseline; padding:28px 0 20px; border-bottom:1px solid var(--line); margin:24px 0 28px; }
.colhead h2 { font-family:var(--fd); font-weight:560; font-size:clamp(1.9rem,3vw,2.6rem); }
.colhead .plac { font-family:var(--fm); font-size:.72rem; color:var(--soft); letter-spacing:.06em; }
.grid { display:grid; grid-template-columns:repeat(3,1fr); gap:32px 24px; }
.card { display:block; text-decoration:none; color:var(--ink); }
.card__frame { border:1px solid var(--line); border-radius:2px; overflow:hidden; transition:transform .35s, box-shadow .35s, border-color .35s; }
.card:hover .card__frame { transform:translateY(-4px); box-shadow:0 18px 40px -24px color-mix(in srgb,var(--a) 55%,transparent); border-color:color-mix(in srgb,var(--a) 40%,var(--line)); }
.card__img { aspect-ratio:4/5; background:var(--sink); }
.card__foot { display:flex; justify-content:space-between; align-items:center; padding:12px 16px; border-top:1px solid var(--lsoft); font-family:var(--fm); font-size:.72rem; }
.card__cat { color:var(--soft); letter-spacing:.06em; position:relative; padding-left:.9em; }
.card__cat::before { content:''; position:absolute; left:0; top:.42em; width:.5em; height:.5em; background:var(--a); border-radius:50%; }
.card__teaser { color:var(--soft); }
@media (max-width:820px){ .hero{grid-template-columns:1fr;gap:24px} .grid{grid-template-columns:repeat(2,1fr)} }
</style>

<div class="mof">
  <div class="mof__head">
    <div class="mof__wm"><b>◉</b> museofmusic</div>
    <nav class="mof__nav"><span>La colección</span><span>Sobre el museo</span></nav>
  </div>

  <section class="intro">
    <p class="eyebrow">Museo de canciones ilustradas</p>
    <h1>Muse of Song</h1>
    <p>Cada canción se destila en <em>un solo símbolo</em>. Sin letra, sin caras, sin instrumentos: solo la emoción. Tú miras. Tú adivinas.</p>
  </section>

  <section class="hero">
    <div class="hero__art">${svgs['wind-of-change']}</div>
    <div class="hero__side">
      <p class="plac">MOS-001 · obra destacada</p>
      <h2>¿Qué canción es?</h2>
      <p class="desc">La obra que abre la colección. Un símbolo que reconoces al primer golpe y que, al segundo vistazo, cuenta otra cosa.</p>
      <span class="btn">Ver la ficha →</span>
    </div>
  </section>

  <section>
    <div class="colhead"><h2>La colección</h2><span class="plac">06 obras</span></div>
    <div class="grid">
      ${['living-on-a-prayer','hurt','november-rain','nothing-else-matters','under-the-bridge'].map(card).join('')}
    </div>
  </section>
</div>`;

writeFileSync(new URL('../preview.html', import.meta.url), html);
console.log('preview.html', html.length, 'bytes');
