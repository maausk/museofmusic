import { writeFileSync, mkdirSync } from 'node:fs';

// Placeholders minimalistas y "en marca": fondo mate, un único acento cálido
// que brilla, silueta + espacio negativo. NO son el arte final: son marcadores
// presentables para que la galería se vea llena hasta que caigan los PNG reales.

mkdirSync(new URL('../public/obras/', import.meta.url), { recursive: true });

const W = 800, H = 1000;

function svg(bg, accent, ink, inner) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img">
  <defs>
    <radialGradient id="glow" cx="50%" cy="42%" r="60%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.28"/>
      <stop offset="55%" stop-color="${accent}" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
    <filter id="soft"><feGaussianBlur stdDeviation="7"/></filter>
  </defs>
  <rect width="${W}" height="${H}" fill="${bg}"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  ${inner(accent, ink)}
</svg>`;
}

const works = {
  // Muro agrietado + pájaros hacia la luz
  'wind-of-change': {
    bg: '#EDE6D8', accent: '#E4A33C', ink: '#3A3428',
    draw: (a, ink) => `
      <circle cx="400" cy="360" r="120" fill="${a}" opacity="0.9" filter="url(#soft)"/>
      <g fill="${ink}">
        ${Array.from({length: 7}).map((_, r) =>
          Array.from({length: 5}).map((_, c) => {
            const bw = 150, bh = 66, gap = 8;
            const x = 40 + c * (bw + gap) + (r % 2 ? -bw/2 : 0);
            const y = 470 + r * (bh + gap);
            return `<rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="3"/>`;
          }).join('')
        ).join('')}
      </g>
      <path d="M400 440 L470 640 L360 780 L440 1000 L330 1000 L390 780 L300 660 Z" fill="${'#EDE6D8'}"/>
      <g fill="${ink}">
        <path d="M360 250 q22 -18 44 0 q-22 -8 -44 0Z"/>
        <path d="M300 300 q26 -20 52 0 q-26 -9 -52 0Z"/>
        <path d="M440 290 q24 -19 48 0 q-24 -9 -48 0Z"/>
        <path d="M380 190 q20 -16 40 0 q-20 -7 -40 0Z"/>
      </g>`
  },
  // Abrazo cuyo contorno es una casa + luz central
  'living-on-a-prayer': {
    bg: '#EAE0D4', accent: '#E8622C', ink: '#33261E',
    draw: (a, ink) => `
      <path d="M180 720 L400 470 L620 720 Z" fill="none" stroke="${ink}" stroke-width="14" stroke-linejoin="round"/>
      <rect x="235" y="700" width="330" height="230" fill="none" stroke="${ink}" stroke-width="14"/>
      <circle cx="400" cy="640" r="70" fill="${a}" filter="url(#soft)"/>
      <circle cx="400" cy="640" r="38" fill="${a}"/>
      <path d="M330 760 q70 -80 140 0" fill="none" stroke="${ink}" stroke-width="12" opacity="0.5"/>`
  },
  // Trono vacío y polvoriento
  'hurt': {
    bg: '#2A2420', accent: '#B5462F', ink: '#0F0C0A',
    draw: (a) => `
      <path d="M360 250 L360 200 L390 230 L420 190 L450 230 L480 200 L480 250Z" fill="${a}" opacity="0.85"/>
      <rect x="330" y="250" width="160" height="360" rx="8" fill="${a}" opacity="0.7"/>
      <rect x="300" y="560" width="220" height="60" rx="6" fill="${a}" opacity="0.7"/>
      <rect x="300" y="600" width="40" height="230" fill="${a}" opacity="0.6"/>
      <rect x="480" y="600" width="40" height="230" fill="${a}" opacity="0.6"/>
      <path d="M300 60 L520 60 L470 620 L350 620 Z" fill="#EDE6D8" opacity="0.06"/>
      <g fill="#EDE6D8" opacity="0.25">
        <circle cx="250" cy="300" r="3"/><circle cx="560" cy="420" r="2.5"/>
        <circle cx="300" cy="700" r="2"/><circle cx="520" cy="720" r="3"/>
        <circle cx="410" cy="500" r="2"/><circle cx="600" cy="250" r="2.5"/>
      </g>`
  },
  // Ramo caído bajo la lluvia + rojo que sangra
  'november-rain': {
    bg: '#26303A', accent: '#C0362C', ink: '#12181E',
    draw: (a) => `
      <g stroke="#8FA6B5" stroke-width="2" opacity="0.35">
        ${Array.from({length: 26}).map((_,i)=>{const x=20+i*30;return `<line x1="${x}" y1="0" x2="${x-40}" y2="1000"/>`}).join('')}
      </g>
      <g transform="translate(400 720) rotate(24)">
        <line x1="0" y1="0" x2="0" y2="220" stroke="#7C6A4A" stroke-width="10"/>
        <circle cx="-40" cy="-20" r="46" fill="#D9C7B0"/>
        <circle cx="40" cy="-20" r="46" fill="#D9C7B0"/>
        <circle cx="0" cy="-56" r="46" fill="#D9C7B0"/>
        <circle cx="0" cy="0" r="50" fill="${a}"/>
      </g>
      <path d="M405 760 q-6 120 -30 240 l40 0 q-4 -120 -10 -240Z" fill="${a}" opacity="0.9"/>`
  },
  // Grieta dorada kintsugi
  'nothing-else-matters': {
    bg: '#221E1B', accent: '#D9A24A', ink: '#100E0C',
    draw: (a) => `
      <rect x="120" y="80" width="560" height="840" rx="4" fill="#2E2823"/>
      <path d="M400 90 L360 300 L430 430 L370 600 L420 760 L390 910"
        fill="none" stroke="${a}" stroke-width="12" stroke-linecap="round"/>
      <path d="M360 300 L250 380 M430 430 L560 470 M370 600 L260 660 M420 760 L540 800"
        fill="none" stroke="${a}" stroke-width="7" stroke-linecap="round"/>
      <path d="M400 90 L360 300 L430 430 L370 600 L420 760 L390 910"
        fill="none" stroke="${a}" stroke-width="26" stroke-linecap="round" opacity="0.18" filter="url(#soft)"/>`
  },
  // Farola + banco vacío bajo luz cálida
  'under-the-bridge': {
    bg: '#20242B', accent: '#E09A3E', ink: '#12151A',
    draw: (a) => `
      <circle cx="430" cy="380" r="170" fill="${a}" opacity="0.22" filter="url(#soft)"/>
      <rect x="250" y="200" width="16" height="620" fill="#4A4A50"/>
      <path d="M250 210 q100 -30 190 40" fill="none" stroke="#4A4A50" stroke-width="14"/>
      <circle cx="440" cy="270" r="26" fill="${a}"/>
      <circle cx="440" cy="270" r="46" fill="${a}" opacity="0.4" filter="url(#soft)"/>
      <g fill="#3A3A40">
        <rect x="330" y="640" width="300" height="20" rx="4"/>
        <rect x="330" y="600" width="300" height="16" rx="4"/>
        <rect x="345" y="660" width="16" height="120"/>
        <rect x="600" y="660" width="16" height="120"/>
      </g>`
  },
};

for (const [slug, w] of Object.entries(works)) {
  const out = svg(w.bg, w.accent, w.ink, () => w.draw(w.accent, w.ink));
  writeFileSync(new URL(`../public/obras/${slug}.svg`, import.meta.url), out);
  console.log('  ✓', slug + '.svg');
}

// favicon (el mismo "◉" de la marca)
writeFileSync(new URL('../public/favicon.svg', import.meta.url),
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="#F4F5F3"/><circle cx="16" cy="16" r="8" fill="none" stroke="#1B34E8" stroke-width="3"/><circle cx="16" cy="16" r="2.5" fill="#1B34E8"/></svg>`);
console.log('  ✓ favicon.svg');
