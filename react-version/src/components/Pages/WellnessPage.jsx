import { useCallback, useEffect, useRef, useState } from 'react';

// ============================================================
// Wellness Check — complete file (Perfect Flow & Clean Premium Roadmap)
// ============================================================

const sceneModules = import.meta.glob('../../images/scene-*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
});

const findScene = (n) => {
  const key = Object.keys(sceneModules).find((k) => new RegExp(`/scene-${n}\\.`).test(k));
  return key ? sceneModules[key] : null;
};

const svgUri = (svg) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

const ART = {
  skin: '#d4956a',
  skinShade: '#bd7e54',
  hair: '#1d1717',
  hoodA: '#9ac5b0',
  hoodB: '#5e8c73',
  hoodDark: '#4a725c',
};

const artDefs = `
  <linearGradient id="hood" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${ART.hoodA}"/><stop offset="1" stop-color="${ART.hoodB}"/></linearGradient>
  <linearGradient id="desk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9a471"/><stop offset="1" stop-color="#a46d3d"/></linearGradient>
  <linearGradient id="metal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e8ecf2"/><stop offset="1" stop-color="#b0b8c2"/></linearGradient>
  <radialGradient id="glow"><stop offset="0" stop-color="#fff0b8" stop-opacity=".95"/><stop offset="1" stop-color="#fff0b8" stop-opacity="0"/></radialGradient>
  <radialGradient id="vig" cx=".5" cy=".5" r=".75"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".32"/></radialGradient>
  <filter id="blur6"><feGaussianBlur stdDeviation="6"/></filter>
  <filter id="blur14"><feGaussianBlur stdDeviation="14"/></filter>`;

const artWrap = (inner, extraDefs = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 400" preserveAspectRatio="xMidYMid slice"><defs>${artDefs}${extraDefs}</defs>${inner}<rect width="760" height="400" fill="url(#vig)"/></svg>`;

const artLeaf = (rot, fill, s = 1) =>
  `<path transform="rotate(${rot}) scale(${s})" d="M0 0 C -14 -18 -6 -42 0 -54 C 6 -42 14 -18 0 0Z" fill="${fill}"/>`;

const artPlant = (x, y, s = 1) => `
  <g transform="translate(${x} ${y}) scale(${s})">
    ${artLeaf(-52, '#4d8c5b')}${artLeaf(-28, '#73b382')}${artLeaf(-5, '#3e7a4c', 1.15)}${artLeaf(20, '#69ab78')}${artLeaf(46, '#4d8c5b')}
    <path d="M-17 0 H17 L13 28 Q12 32 8 32 H-8 Q-12 32 -13 28Z" fill="#b86a3d"/>
    <rect x="-19" y="-4" width="38" height="8" rx="3" fill="#cc7f50"/>
  </g>`;

const artBooks = (x, yBase, specs) => {
  let cx = x;
  return specs
    .map(([w, h, c]) => {
      const r = `<rect x="${cx}" y="${yBase - h}" width="${w}" height="${h}" rx="2" fill="${c}"/><rect x="${cx + 3}" y="${yBase - h + 8}" width="${w - 6}" height="3" fill="#fff" opacity=".4"/>`;
      cx += w + 2;
      return r;
    })
    .join('');
};

const artLamp = (x, y) => `
  <circle cx="${x}" cy="${y - 60}" r="120" fill="url(#glow)"/>
  <rect x="${x - 22}" y="${y - 4}" width="44" height="8" rx="4" fill="#3d332b"/>
  <rect x="${x - 3}" y="${y - 70}" width="6" height="68" fill="#3d332b"/>
  <path d="M${x - 30} ${y - 66} L${x + 30} ${y - 66} L${x + 20} ${y - 100} L${x - 20} ${y - 100}Z" fill="#f6cc75"/>
  <path d="M${x - 30} ${y - 66} L${x + 30} ${y - 66} L${x + 26} ${y - 74} L${x - 26} ${y - 74}Z" fill="#ffefa8" opacity=".85"/>`;

const artHead = (cx, cy, tilt = 0, eyes = 'down') => `
  <g transform="rotate(${tilt} ${cx} ${cy + 20})">
    <ellipse cx="${cx - 33}" cy="${cy + 6}" rx="6" ry="9" fill="${ART.skinShade}"/>
    <ellipse cx="${cx + 33}" cy="${cy + 6}" rx="6" ry="9" fill="${ART.skinShade}"/>
    <ellipse cx="${cx}" cy="${cy}" rx="34" ry="40" fill="${ART.skin}"/>
    <path d="M${cx - 36} ${cy - 4} C ${cx - 42} ${cy - 46}, ${cx - 10} ${cy - 54}, ${cx + 8} ${cy - 52} C ${cx + 36} ${cy - 50}, ${cx + 44} ${cy - 26}, ${cx + 37} ${cy - 2} C ${cx + 30} ${cy - 22}, ${cx + 12} ${cy - 28}, ${cx - 6} ${cy - 26} C ${cx - 22} ${cy - 24}, ${cx - 31} ${cy - 14}, ${cx - 36} ${cy - 4}Z" fill="${ART.hair}"/>
    <path d="M${cx - 20} ${cy - 40} C ${cx - 8} ${cy - 46}, ${cx + 8} ${cy - 46}, ${cx + 20} ${cy - 40}" stroke="#3d2f2f" stroke-width="3" fill="none" stroke-linecap="round" opacity=".5"/>
    <path d="M${cx - 20} ${cy - 8} Q ${cx - 12} ${cy - 13} ${cx - 4} ${cy - 8}" stroke="${ART.hair}" stroke-width="3.2" fill="none" stroke-linecap="round"/>
    <path d="M${cx + 6} ${cy - 8} Q ${cx + 14} ${cy - 13} ${cx + 22} ${cy - 8}" stroke="${ART.hair}" stroke-width="3.2" fill="none" stroke-linecap="round"/>
    ${
      eyes === 'down'
        ? `<path d="M${cx - 19}${cy + 4} Q ${cx - 12}${cy + 9} ${cx - 5}${cy + 4}" stroke="#221512" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M${cx + 7}${cy + 4} Q ${cx + 14}${cy + 9} ${cx + 21}${cy + 4}" stroke="#221512" stroke-width="2.6" fill="none" stroke-linecap="round"/>`
        : `<ellipse cx="${cx - 12}" cy="${cy + 4}" rx="4" ry="4.6" fill="#221512"/><ellipse cx="${cx + 14}" cy="${cy + 4}" rx="4" ry="4.6" fill="#221512"/><circle cx="${cx - 10.8}" cy="${cy + 2.6}" r="1.4" fill="#fff"/><circle cx="${cx + 15.2}" cy="${cy + 2.6}" r="1.4" fill="#fff"/>`
    }
    <path d="M${cx + 1} ${cy + 8} Q ${cx + 6} ${cy + 20} ${cx - 1} ${cy + 22}" stroke="${ART.skinShade}" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <path d="M${cx - 9} ${cy + 30} Q ${cx + 1} ${cy + 35} ${cx + 11} ${cy + 30}" stroke="#783c32" stroke-width="2.6" fill="none" stroke-linecap="round"/>
  </g>`;

const artTorso = (cx, topY, w = 90, bottomY = 320) => `
  <path d="M${cx - w - 20} ${bottomY} C ${cx - w - 22} ${topY + 50}, ${cx - w + 10} ${topY + 6}, ${cx - 36} ${topY} L${cx + 36} ${topY} C ${cx + w - 10} ${topY + 6}, ${cx + w + 22} ${topY + 50}, ${cx + w + 20} ${bottomY}Z" fill="url(#hood)"/>
  <rect x="${cx - 13}" y="${topY - 30}" width="26" height="34" rx="8" fill="${ART.skinShade}"/>
  <ellipse cx="${cx}" cy="${topY + 2}" rx="42" ry="15" fill="${ART.hoodDark}"/>
  <ellipse cx="${cx}" cy="${topY - 2}" rx="27" ry="9" fill="${ART.skinShade}"/>
  <path d="M${cx - 12} ${topY + 12} L${cx - 15} ${topY + 52}" stroke="#f8f8f4" stroke-width="3" stroke-linecap="round"/>
  <path d="M${cx + 12} ${topY + 12} L${cx + 15} ${topY + 52}" stroke="#f8f8f4" stroke-width="3" stroke-linecap="round"/>`;

const scene1 = artWrap(`
  <defs>
    <linearGradient id="wall1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fdf5ec"/><stop offset="1" stop-color="#f0dec2"/></linearGradient>
    <linearGradient id="sky1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c4e3f3"/><stop offset="1" stop-color="#ecf8e4"/></linearGradient>
    <linearGradient id="ray1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff8dc" stop-opacity=".65"/><stop offset="1" stop-color="#fff8dc" stop-opacity="0"/></linearGradient>
  </defs>
  <rect width="760" height="400" fill="url(#wall1)"/>
  <rect x="34" y="30" width="206" height="236" rx="10" fill="#fffdfb"/>
  <rect x="46" y="42" width="182" height="212" rx="4" fill="url(#sky1)"/>
  <circle cx="90" cy="210" r="46" fill="#6dbf7d"/><circle cx="150" cy="224" r="56" fill="#4fae6b"/><circle cx="200" cy="205" r="40" fill="#7ed490"/>
  <circle cx="170" cy="86" r="22" fill="#fff8d6" opacity=".9"/>
  <rect x="134" y="42" width="6" height="212" fill="#fffdfb"/><rect x="46" y="146" width="182" height="6" fill="#fffdfb"/>
  <path d="M10 20 C 40 60, 10 140, 30 270 L 46 270 L 46 20Z" fill="#f5e6d0"/>
  <path d="M60 252 L 226 252 L 340 400 L 76 400Z" fill="url(#ray1)"/>
  <rect x="24" y="266" width="224" height="11" rx="4" fill="#f0e2cd"/>
  ${artPlant(78, 262, 0.95)}${artPlant(196, 262, 0.75)}
  <g transform="translate(-74 0)"><rect x="334" y="44" width="92" height="108" rx="5" fill="#fffdfb" stroke="#e0cca8" stroke-width="5"/>
  <text x="380" y="86" font-family="Georgia, serif" font-size="15" fill="#7a6b56" text-anchor="middle" font-weight="bold">Your</text>
  <text x="380" y="106" font-family="Georgia, serif" font-size="15" fill="#7a6b56" text-anchor="middle" font-weight="bold">Mind</text>
  <path d="M380 130 c -10 -9 -14 -14 -9 -19 c 4 -4 8 -1 9 2 c 1 -3 5 -6 9 -2 c 5 5 1 10 -9 19z" fill="#d67b6e"/></g>
  <rect x="584" y="26" width="150" height="338" rx="6" fill="#a47248"/>
  <rect x="594" y="36" width="130" height="318" fill="#7c5938"/>
  ${artBooks(600, 128, [[16, 70, '#cc5f53'], [20, 82, '#dca63d'], [14, 64, '#4d82a8'], [18, 76, '#5e9d7c'], [22, 70, '#7d599c'], [14, 60, '#cf6d42']])}
  <rect x="594" y="128" width="130" height="9" fill="#946a42"/>
  ${artBooks(600, 232, [[22, 78, '#436988'], [16, 70, '#d6b057'], [20, 84, '#b84e5b'], [14, 62, '#699e7f'], [24, 76, '#5e5094']])}
  <rect x="594" y="232" width="130" height="9" fill="#946a42"/>
  ${artPlant(690, 336, 0.6)}
  <rect x="594" y="336" width="130" height="9" fill="#946a42"/>
  ${artLamp(530, 300)}
  ${artTorso(420, 216, 88, 320)}
  ${artHead(420, 150, 7, 'down')}
  <rect x="0" y="300" width="760" height="100" fill="url(#desk)"/>
  <rect x="0" y="300" width="760" height="7" fill="#ecc39c"/>
  <ellipse cx="420" cy="388" rx="260" ry="12" fill="#000" opacity=".15"/>
  <rect x="76" y="196" width="176" height="106" rx="7" fill="url(#metal)"/>
  <circle cx="164" cy="249" r="9" fill="#f8fafd" opacity=".9"/>
  <rect x="58" y="300" width="212" height="9" rx="4" fill="#b4b9c2"/>
  <rect x="288" y="272" width="32" height="34" rx="6" fill="#fcf9f2"/><path d="M320 280 q 14 0 14 12 q 0 12 -14 12" stroke="#fcf9f2" stroke-width="5" fill="none"/>
  <path d="M318 340 L412 332 L412 388 L306 392Z" fill="#fffdf8" stroke="#e8dec8"/>
  <path d="M412 332 L506 340 L516 392 L412 388Z" fill="#fffdf8" stroke="#e8dec8"/>
  <path d="M326 350 L404 344 M324 362 L404 356 M322 374 L404 368 M420 344 L498 350 M420 356 L500 362 M420 368 L502 374" stroke="#c4d0d6" stroke-width="2"/>
  <path d="M486 238 C 508 266, 500 304, 462 326" stroke="url(#hood)" stroke-width="38" stroke-linecap="round" fill="none"/>
  <path d="M354 240 C 332 270, 346 306, 392 330" stroke="url(#hood)" stroke-width="38" stroke-linecap="round" fill="none"/>
  <circle cx="458" cy="330" r="14" fill="${ART.skin}"/><circle cx="394" cy="334" r="13" fill="${ART.skin}"/>
  <path d="M458 326 L476 296" stroke="#223059" stroke-width="5" stroke-linecap="round"/>
  <rect x="548" y="350" width="130" height="24" rx="3" fill="#1d3552"/><rect x="556" y="358" width="60" height="4" fill="#fff" opacity=".65"/>
  <text x="640" y="367" font-family="Arial, sans-serif" font-size="9" fill="#d6e6f7" font-weight="bold">PSYCH</text>
  <rect x="556" y="328" width="112" height="22" rx="3" fill="#c4994d"/>
`);

const scene2 = artWrap(`
  <defs>
    <linearGradient id="wall2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#faebd7"/><stop offset="1" stop-color="#ebd1b0"/></linearGradient>
    <linearGradient id="sea2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8cc7e3"/><stop offset="1" stop-color="#f2dba6"/></linearGradient>
  </defs>
  <rect width="760" height="400" fill="url(#wall2)"/>
  <path d="M0 0 H 150 V 400 H 0Z" fill="#fff" opacity=".15" filter="url(#blur14)"/>
  ${artPlant(64, 300, 1.2)}
  <circle cx="190" cy="250" r="130" fill="url(#glow)"/>
  ${artPlant(690, 304, 1)}
  ${artTorso(392, 222, 90, 330)}
  ${artHead(386, 156, -9, 'down')}
  <rect x="0" y="318" width="760" height="82" fill="url(#desk)"/>
  <rect x="0" y="318" width="760" height="7" fill="#ecc39c"/>
  <rect x="56" y="232" width="150" height="88" rx="7" fill="url(#metal)"/>
  <rect x="40" y="318" width="182" height="8" rx="4" fill="#b4b9c2"/>
  <path d="M540 340 L620 334 L630 392 L536 394Z" fill="#fffdf8" stroke="#e8dec8"/>
  <path d="M462 250 C 490 280, 486 312, 458 330" stroke="url(#hood)" stroke-width="38" stroke-linecap="round" fill="none"/>
  <path d="M458 326 C 452 280, 440 232, 424 196" stroke="url(#hood)" stroke-width="32" stroke-linecap="round" fill="none"/>
  <circle cx="422" cy="188" r="17" fill="${ART.skin}"/>
  <path d="M322 250 C 300 280, 314 312, 346 316" stroke="url(#hood)" stroke-width="36" stroke-linecap="round" fill="none"/>
  <rect x="338" y="266" width="46" height="76" rx="9" fill="#1b222d" transform="rotate(8 361 304)"/>
  <circle cx="352" cy="278" r="4" fill="#323b4f" transform="rotate(8 361 304)"/>
  <circle cx="350" cy="320" r="13" fill="${ART.skin}"/>
  <g>
    <rect x="150" y="62" width="104" height="70" rx="22" fill="#fff" filter="url(#blur6)" opacity=".28" transform="translate(4 8)"/>
    <rect x="150" y="62" width="104" height="70" rx="22" fill="#fff"/>
    <path d="M178 130 L168 150 L196 132Z" fill="#fff"/>
    <circle cx="180" cy="97" r="6" fill="#3d4657"/><circle cx="202" cy="97" r="6" fill="#3d4657"/><circle cx="224" cy="97" r="6" fill="#3d4657"/>
  </g>
  <g transform="translate(200 168)">
    <rect width="70" height="70" rx="18" fill="#2b75ca"/>
    <path d="M35 16 c-13 0 -18 10 -18 22 v8 l-6 8 h48 l-6 -8 v-8 c0 -12 -5 -22 -18 -22z" fill="#fff"/>
    <circle cx="35" cy="60" r="6" fill="#fff"/>
    <circle cx="62" cy="8" r="14" fill="#dc3545"/><text x="62" y="13" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#fff" text-anchor="middle">2</text>
  </g>
  <g transform="translate(548 190)">
    <rect width="76" height="62" rx="18" fill="#e84a4a"/>
    <rect x="14" y="16" width="48" height="32" rx="5" fill="#fff"/>
    <path d="M16 20 L38 38 L60 20" stroke="#e84a4a" stroke-width="3.5" fill="none" stroke-linejoin="round"/>
    <circle cx="68" cy="6" r="14" fill="#dc3545"/><text x="68" y="11" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#fff" text-anchor="middle">5</text>
  </g>
  <g transform="translate(560 34) rotate(3)">
    <rect width="104" height="124" rx="4" fill="#fffdf8" stroke="#ebdcae" stroke-width="3"/>
    <rect x="9" y="9" width="86" height="106" fill="url(#sea2)"/>
    <rect x="9" y="72" width="86" height="43" fill="#ebd2a0"/>
    <path d="M9 72 Q 30 64 52 72 T 95 72 V 82 H 9Z" fill="#6db4d1"/>
    <circle cx="38" cy="66" r="6" fill="#6e5040"/><rect x="33" y="72" width="10" height="26" rx="4" fill="#d96550"/>
    <circle cx="62" cy="66" r="6" fill="#5e4235"/><rect x="57" y="72" width="10" height="26" rx="4" fill="#4295b5"/>
  </g>
`);

const scene3 = artWrap(`
  <defs>
    <linearGradient id="wall3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f5e4cc"/><stop offset="1" stop-color="#e2c098"/></linearGradient>
    <linearGradient id="forest3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bce0b9"/><stop offset="1" stop-color="#4e8a53"/></linearGradient>
    <linearGradient id="room3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b3d9d0"/><stop offset="1" stop-color="#7eb5a8"/></linearGradient>
    <linearGradient id="cork3" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#cca065"/><stop offset="1" stop-color="#b07d42"/></linearGradient>
  </defs>
  <rect width="760" height="400" fill="url(#wall3)"/>
  <path d="M220 0 H 500 V 360 H 220Z" fill="#fff" opacity=".16" filter="url(#blur14)"/>
  <g transform="translate(236 26)">
    <rect width="118" height="76" rx="3" fill="#fffdf8" stroke="#f9f4ea" stroke-width="5"/>
    <rect x="6" y="6" width="106" height="64" fill="url(#room3)"/>
    <rect x="6" y="52" width="106" height="18" fill="#bc956c"/>
    <rect x="52" y="30" width="38" height="26" rx="8" fill="#256959"/><rect x="48" y="38" width="12" height="20" rx="5" fill="#1f584b"/><rect x="82" y="38" width="12" height="20" rx="5" fill="#1f584b"/>
    <rect x="16" y="42" width="20" height="14" rx="2" fill="#996c40"/><rect x="22" y="22" width="10" height="20" fill="#72b580"/>
  </g>
  <g transform="translate(366 18)">
    <rect width="120" height="86" rx="3" fill="url(#cork3)" stroke="#f9f4ea" stroke-width="5"/>
    <g transform="rotate(-5 60 40)"><rect x="22" y="16" width="76" height="52" fill="#fffdf6"/><text x="60" y="44" font-family="Georgia, serif" font-style="italic" font-size="16" fill="#5c4d3b" text-anchor="middle">Breath</text><path d="M60 62 c -6 -5 -9 -8 -5 -12 c 3 -3 5 0 5 2 c 0 -2 3 -5 5 -2 c 4 4 1 7 -5 12z" fill="#d67b6e" transform="translate(0 -1)"/></g>
    <circle cx="60" cy="14" r="3.5" fill="#cc4e4e"/>
  </g>
  <g transform="translate(236 114)">
    <rect width="118" height="108" rx="3" fill="#fffdf8" stroke="#f9f4ea" stroke-width="5"/>
    <rect x="6" y="6" width="106" height="96" fill="url(#forest3)"/>
    <path d="M6 102 L 48 60 H 70 L 112 102Z" fill="#f0e5bf"/>
    <g fill="#336941"><path d="M22 76 L 34 30 L 46 76Z"/><path d="M78 74 L 92 24 L 106 74Z"/><path d="M10 80 L 20 44 L 30 80Z" opacity=".8"/></g>
    <circle cx="60" cy="48" r="9" fill="#fffbe3" opacity=".95"/>
  </g>
  <g transform="translate(366 118)">
    <rect width="120" height="104" rx="3" fill="#fffdf8" stroke="#f9f4ea" stroke-width="5"/>
    <rect x="6" y="6" width="108" height="92" fill="url(#forest3)"/>
    <path d="M6 98 L 50 56 H 72 L 114 98Z" fill="#ebe0b5"/>
    <g fill="#2d5e39"><path d="M16 74 L 30 26 L 44 74Z"/><path d="M80 72 L 96 20 L 110 72Z"/></g>
    <g transform="rotate(-6 60 70)"><rect x="34" y="40" width="64" height="62" fill="#99cfe8" filter="url(#blur6)" opacity=".38" transform="translate(3 4)"/><rect x="34" y="40" width="64" height="62" fill="#a8d6ec"/>
      <text x="66" y="62" font-family="Georgia, serif" font-style="italic" font-size="12" fill="#2c4557" text-anchor="middle">Small</text>
      <text x="66" y="77" font-family="Georgia, serif" font-style="italic" font-size="12" fill="#2c4557" text-anchor="middle">Steps</text>
      <text x="66" y="92" font-family="Georgia, serif" font-style="italic" font-size="12" fill="#2c4557" text-anchor="middle">Everyday ♡</text></g>
  </g>
  ${artPlant(66, 352, 1.35)}
  ${artLamp(128, 304)}
  <rect x="640" y="40" width="120" height="360" fill="#8e633e"/>
  ${artBooks(648, 150, [[16, 64, '#cc5f53'], [18, 76, '#dca63d'], [14, 60, '#4d82a8'], [20, 70, '#5e9d7c']])}
  <rect x="644" y="150" width="116" height="8" fill="#a4774e"/>
  <path d="M430 400 C 428 340, 470 296, 548 292 C 640 292, 700 340, 704 400Z" fill="url(#hood)"/>
  <ellipse cx="552" cy="294" rx="52" ry="16" fill="${ART.hoodDark}"/>
  <rect x="534" y="262" width="34" height="38" rx="10" fill="${ART.skinShade}"/>
  <ellipse cx="502" cy="236" rx="8" ry="12" fill="${ART.skin}"/>
  <ellipse cx="556" cy="226" rx="52" ry="58" fill="${ART.hair}"/>
  <path d="M520 190 C 544 176, 580 180, 598 204" stroke="#3d3030" stroke-width="5" fill="none" stroke-linecap="round" opacity=".6"/>
  <path d="M628 400 C 606 360, 560 336, 518 312" stroke="url(#hood)" stroke-width="40" stroke-linecap="round" fill="none"/>
  <ellipse cx="506" cy="296" rx="20" ry="17" fill="${ART.skin}"/>
  <path d="M492 288 q 6 -8 14 -4 M498 300 q 7 -7 14 -3" stroke="${ART.skinShade}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
`);

const bridgeSteps = (() => {
  const L = (t) => [215 + (600 - 215) * t, 400 - (400 - 184) * t];
  const R = (t) => [455 + (628 - 455) * t, 400 - (400 - 188) * t];
  let planks = '';
  for (let i = 1; i < 26; i += 1) {
    const t = 1 - (1 - i / 26) ** 2.1;
    const a = L(t);
    const b = R(t);
    planks += `<line x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}" stroke="#1d1612" stroke-width="${(2.4 * (1 - t) + 0.6).toFixed(1)}" opacity=".75"/>`;
  }
  let postsL = '';
  let postsR = '';
  const topsL = [];
  const topsR = [];
  for (let i = 0; i <= 9; i += 1) {
    const t = 1 - (1 - i / 10) ** 1.7;
    const h = 108 * (1 - t * 0.86);
    const a = L(t);
    const b = R(t);
    postsL += `<line x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${a[0].toFixed(1)}" y2="${(a[1] - h).toFixed(1)}" stroke="#241e19" stroke-width="${(7 * (1 - t) + 1.5).toFixed(1)}" stroke-linecap="round"/>`;
    postsR += `<line x1="${b[0].toFixed(1)}" y1="${b[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${(b[1] - h).toFixed(1)}" stroke="#241e19" stroke-width="${(6 * (1 - t) + 1.2).toFixed(1)}" stroke-linecap="round"/>`;
    topsL.push(`${a[0].toFixed(1)},${(a[1] - h).toFixed(1)}`);
    topsR.push(`${b[0].toFixed(1)},${(b[1] - h).toFixed(1)}`);
  }
  return `${planks}${postsR}<polyline points="${topsR.join(' ')}" stroke="#241e19" stroke-width="3" fill="none" stroke-linejoin="round"/>${postsL}<polyline points="${topsL.join(' ')}" stroke="#2d2621" stroke-width="5" fill="none" stroke-linejoin="round"/>`;
})();

const scene4 = artWrap(`
  <defs>
    <linearGradient id="sky4" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4c585f"/><stop offset=".55" stop-color="#9aa9ad"/><stop offset="1" stop-color="#d1d9d8"/></linearGradient>
    <linearGradient id="deck4" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#3d3025"/><stop offset="1" stop-color="#7a6a5a"/></linearGradient>
    <radialGradient id="fog4" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#e8edea" stop-opacity=".95"/><stop offset="1" stop-color="#e8edea" stop-opacity="0"/></radialGradient>
    <linearGradient id="water4" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5c6d73"/><stop offset="1" stop-color="#182326"/></linearGradient>
  </defs>
  <rect width="760" height="400" fill="url(#sky4)"/>
  <polygon points="0,214 92,150 172,192 262,120 362,204 452,142 562,208 652,128 760,192 760,280 0,280" fill="#78888f" opacity=".7"/>
  <polygon points="0,270 112,192 224,252 332,176 442,256 562,200 682,252 760,214 760,320 0,320" fill="#526266" opacity=".85"/>
  <ellipse cx="380" cy="230" rx="420" ry="46" fill="#e8edea" opacity=".5" filter="url(#blur14)"/>
  <polygon points="0,140 74,160 142,262 196,400 0,400" fill="#222e33"/>
  <polygon points="760,170 706,204 650,300 604,400 760,400" fill="#222e33"/>
  <polygon points="196,400 604,400 650,300 142,262" fill="url(#water4)" opacity=".9"/>
  <path d="M230 392 q 40 -10 80 0 M420 388 q 50 -8 100 2 M300 360 q 30 -6 60 0" stroke="#fff" stroke-width="2" opacity=".28" fill="none"/>
  <polygon points="215,400 455,400 628,188 600,184" fill="url(#deck4)"/>
  ${bridgeSteps}
  <circle cx="612" cy="188" r="190" fill="url(#fog4)"/>
  <ellipse cx="560" cy="250" rx="240" ry="30" fill="#e8edea" opacity=".42" filter="url(#blur14)"/>
  <ellipse cx="362" cy="376" rx="52" ry="9" fill="#000" opacity=".3"/>
  <path d="M350 292 C 348 322, 344 346, 340 372" stroke="#1b222d" stroke-width="22" stroke-linecap="round" fill="none"/>
  <path d="M372 292 C 376 320, 384 342, 392 364" stroke="#222c3b" stroke-width="22" stroke-linecap="round" fill="none"/>
  <ellipse cx="338" cy="377" rx="17" ry="7" fill="#0c1014"/><ellipse cx="398" cy="369" rx="17" ry="7" fill="#0c1014"/>
  <path d="M322 214 C 318 254, 324 288, 332 304 L 392 304 C 400 288, 404 254, 400 214 C 394 202, 330 202 322 214Z" fill="#171f2b"/>
  <path d="M322 218 C 312 246, 314 276, 318 292" stroke="#171f2b" stroke-width="17" stroke-linecap="round" fill="none"/>
  <path d="M400 218 C 410 246, 408 274, 404 290" stroke="#171f2b" stroke-width="17" stroke-linecap="round" fill="none"/>
  <circle cx="318" cy="296" r="8" fill="${ART.skinShade}"/><circle cx="404" cy="294" r="8" fill="${ART.skinShade}"/>
  <rect x="330" y="212" width="62" height="84" rx="16" fill="#2e3a4b"/>
  <rect x="340" y="256" width="42" height="30" rx="8" fill="#222c39"/>
  <path d="M338 214 V 264 M384 214 V 264" stroke="#1b2430" stroke-width="5" opacity=".75"/>
  <ellipse cx="361" cy="198" rx="26" ry="9" fill="#111721"/>
  <circle cx="361" cy="182" r="22" fill="${ART.hair}"/>
  <path d="M346 176 q 15 -12 30 0" stroke="#382e30" stroke-width="3" fill="none" stroke-linecap="round" opacity=".65"/>
`);

const SCENE_ART = {
  1: svgUri(scene1),
  2: svgUri(scene2),
  3: svgUri(scene3),
  4: svgUri(scene4),
};

export const STEPS = [
  {
    id: 1,
    title: 'Observe & Describe',
    prompt: 'Observe the scene and describe everything you see in your own words.',
    image: findScene(1) || SCENE_ART[1],
  },
  {
    id: 2,
    title: 'Read & Express',
    prompt: 'What do you think is happening in the story? Explain your thoughts.',
    image: findScene(2) || SCENE_ART[2],
  },
  {
    id: 3,
    title: 'Think & Reflect',
    prompt: 'What do you think might happen next in this situation?',
    image: findScene(3) || SCENE_ART[3],
  },
  {
    id: 4,
    title: 'Act & Grow',
    prompt: 'If you were in this situation, what would you do and why?',
    image: findScene(4) || SCENE_ART[4],
  },
];

export const RESPONSE_SECONDS = 40;
export const MIN_SPEECH_SECONDS = 8;
export const PHONATION_LETTERS = ['आ', 'ई', 'ऊ', 'ए', 'ओ', 'म', 'ह'];

export const formatClock = (totalSeconds) => {
  const s = Math.max(0, Math.floor(totalSeconds));
  const mm = String(Math.floor(s / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${mm}:${ss}`;
};

export const CALIBRATE_MS = 600;
export const MIC_CONSTRAINTS = {
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
};

const getAudioContextClass = () =>
  typeof window === 'undefined' ? null : window.AudioContext || window.webkitAudioContext;

export function stopStream(stream) {
  if (!stream) return;
  stream.getTracks().forEach((track) => track.stop());
}

export async function requestMic() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error('Microphone is not supported in this browser.');
  }
  return navigator.mediaDevices.getUserMedia({ audio: MIC_CONSTRAINTS });
}

export function createMeter(stream) {
  const Ctx = getAudioContextClass();
  if (!Ctx) throw new Error('Web Audio is not supported in this browser.');

  const ctx = new Ctx();
  if (ctx.state === 'suspended' && ctx.resume) {
    ctx.resume().catch(() => {});
  }

  const source = ctx.createMediaStreamSource(stream);
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 2048;
  analyser.smoothingTimeConstant = 0;
  source.connect(analyser);

  const buffer = new Float32Array(analyser.fftSize);
  const sampleRate = ctx.sampleRate;
  const minLag = Math.max(2, Math.floor(sampleRate / 500));
  const maxLag = Math.min(Math.floor(sampleRate / 70), buffer.length - 256);
  let closed = false;

  const read = () => {
    if (closed) return { rms: 0, pitch: 0, clarity: 0 };
    analyser.getFloatTimeDomainData(buffer);

    let sum = 0;
    for (let i = 0; i < buffer.length; i += 1) sum += buffer[i] * buffer[i];
    const rms = Math.sqrt(sum / buffer.length);

    let pitch = 0;
    let clarity = 0;

    if (rms > 0.008 && maxLag > minLag) {
      const n = buffer.length - maxLag;
      let e1 = 0;
      for (let i = 0; i < n; i += 1) e1 += buffer[i] * buffer[i];

      let best = 0;
      let bestLag = 0;
      for (let lag = minLag; lag <= maxLag; lag += 1) {
        let cross = 0;
        let e2 = 0;
        for (let i = 0; i < n; i += 1) {
          const b = buffer[i + lag];
          cross += buffer[i] * b;
          e2 += b * b;
        }
        const denom = Math.sqrt(e1 * e2) || 1;
        const c = cross / denom;
        if (c > best) {
          best = c;
          bestLag = lag;
        }
      }
      clarity = best;
      pitch = bestLag ? sampleRate / bestLag : 0;
    }

    return { rms, pitch, clarity };
  };

  const close = () => {
    if (closed) return;
    closed = true;
    try {
      source.disconnect();
    } catch (e) {}
    if (ctx.state !== 'closed') {
      ctx.close().catch(() => {});
    }
  };

  return { read, close };
}

export function speechThresholdFrom(samples) {
  if (!samples.length) return 0.02;
  const sorted = [...samples].sort((a, b) => a - b);
  const floor = sorted[Math.floor((sorted.length - 1) * 0.25)];
  return Math.min(0.08, Math.max(0.015, floor * 3));
}

export function calibrateThreshold(meter, ms = 700) {
  return new Promise((resolve) => {
    const samples = [];
    const id = setInterval(() => {
      samples.push(meter.read().rms);
    }, 50);
    setTimeout(() => {
      clearInterval(id);
      resolve(speechThresholdFrom(samples));
    }, ms);
  });
}

const pickMimeType = () => {
  if (typeof MediaRecorder === 'undefined' || !MediaRecorder.isTypeSupported) return '';
  const options = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'];
  return options.find((type) => MediaRecorder.isTypeSupported(type)) || '';
};

export function createRecorder(stream) {
  if (typeof MediaRecorder === 'undefined') return null;

  let recorder;
  try {
    const mimeType = pickMimeType();
    recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
  } catch (e) {
    return null;
  }

  let chunks = [];
  recorder.ondataavailable = (event) => {
    if (event.data && event.data.size > 0) chunks.push(event.data);
  };

  return {
    start() {
      chunks = [];
      try {
        recorder.start();
      } catch (e) {}
    },
    stop(keep) {
      return new Promise((resolve) => {
        if (recorder.state === 'inactive') {
          resolve(null);
          return;
        }
        recorder.onstop = () => {
          resolve(keep && chunks.length ? new Blob(chunks, { type: recorder.mimeType || 'audio/webm' }) : null);
        };
        try {
          recorder.stop();
        } catch (e) {
          resolve(null);
        }
      });
    },
  };
}

export function useCameraStream() {
  const [status, setStatus] = useState('pending');
  const [stream, setStream] = useState(null);
  const streamRef = useRef(null);
  const aliveRef = useRef(true);

  const request = useCallback(async () => {
    setStatus('pending');
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('unsupported');
      }
      const next = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: MIC_CONSTRAINTS,
      });
      if (!aliveRef.current) {
        stopStream(next);
        return null;
      }
      if (streamRef.current && streamRef.current !== next) stopStream(streamRef.current);
      streamRef.current = next;
      setStream(next);
      setStatus('ready');
      return next;
    } catch (e) {
      if (aliveRef.current) {
        setStream(null);
        setStatus('denied');
      }
      return null;
    }
  }, []);

  useEffect(() => {
    aliveRef.current = true;
    request();
    return () => {
      aliveRef.current = false;
      stopStream(streamRef.current);
      streamRef.current = null;
    };
  }, [request]);

  return { stream, status, request };
}

export function useFaceLight(videoRef, enabled) {
  const [status, setStatus] = useState({ face: false, light: true });
  const statsRef = useRef({ hits: 0, total: 0 });

  useEffect(() => {
    if (!enabled) {
      setStatus({ face: false, light: true });
      return undefined;
    }

    const W = 64;
    const H = 48;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return undefined;

    let detector = null;
    let useNative = false;
    if (typeof window !== 'undefined' && 'FaceDetector' in window) {
      try {
        detector = new window.FaceDetector({ fastMode: true, maxDetectedFaces: 1 });
        useNative = true;
      } catch (e) {
        detector = null;
        useNative = false;
      }
    }

    let stopped = false;
    let busy = false;
    let misses = 0;

    const tick = async () => {
      const video = videoRef.current;
      if (stopped || busy || !video || video.readyState < 2 || !video.videoWidth) return;
      busy = true;
      try {
        ctx.drawImage(video, 0, 0, W, H);
        const { data } = ctx.getImageData(0, 0, W, H);

        let lumaSum = 0;
        let skin = 0;
        let centre = 0;
        for (let y = 0; y < H; y += 1) {
          for (let x = 0; x < W; x += 1) {
            const i = (y * W + x) * 4;
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const luma = 0.299 * r + 0.587 * g + 0.114 * b;
            lumaSum += luma;
            if (x >= 16 && x < 48 && y >= 8 && y < 40) {
              centre += 1;
              const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
              const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;
              if (cb >= 77 && cb <= 127 && cr >= 133 && cr <= 173 && luma > 40) skin += 1;
            }
          }
        }

        const light = lumaSum / (W * H) >= 55 && lumaSum / (W * H) <= 225;
        let detected = skin / centre > 0.12;

        if (useNative && detector) {
          try {
            const faces = await detector.detect(video);
            detected = faces.length > 0;
          } catch (e) {
            useNative = false;
          }
        }

        misses = detected ? 0 : misses + 1;
        const face = misses < 3;

        statsRef.current.total += 1;
        if (face) statsRef.current.hits += 1;

        if (!stopped) {
          setStatus((prev) => (prev.face === face && prev.light === light ? prev : { face, light }));
        }
      } catch (e) {
      } finally {
        busy = false;
      }
    };

    const id = setInterval(tick, 600);
    return () => {
      stopped = true;
      clearInterval(id);
    };
  }, [videoRef, enabled]);

  return { status, statsRef };
}

const PHONATION_HOLD_MS = 1500;
const PHONATION_MIN_CLARITY = 0.55;
const PHONATION_GAP_MS = 400;
const PHONATION_REST_MS = 900;
const PHONATION_QUIET_MS = 450;
const PITCH_MIN = 70;
const PITCH_MAX = 500;

const MOODS = [
  { id: 'happy', label: 'Happy', desc: 'Positive and light', icon: '😊' },
  { id: 'calm', label: 'Calm', desc: 'Balanced and steady', icon: '😌' },
  { id: 'sad', label: 'Sad', desc: 'Low or heavy', icon: '🌧️' },
  { id: 'anxious', label: 'Anxious', desc: 'Restless mind', icon: '🪐' },
  { id: 'stressed', label: 'Stressed', desc: 'Pressure or tension', icon: '⚡' },
  { id: 'tired', label: 'Tired', desc: 'Low energy', icon: '💤' },
];

const own = Object.values(
  import.meta.glob('../../images/sanctuary.{jpg,jpeg,png,webp}', { eager: true, import: 'default' })
);
const CARD_BG_IMAGE =
  own[0] ||
  'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=1000';

const CAMERA_OFF_MSG =
  'Camera permission is off — allow it in your browser to record. Try again when ready.';

const animationCss = `
  @keyframes smoothZoom {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.08); }
  }
  @keyframes gentleFloat {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-6px); }
  }
  @keyframes scanMove {
    0%, 100% { top: 12%; }
    50% { top: 88%; }
  }
  @keyframes softPulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: scale(1.02); }
    to { opacity: 1; transform: scale(1); }
  }
  .animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
  .animate-smooth-zoom { animation: smoothZoom 22s ease-in-out infinite; }
  .animate-gentle-float { animation: gentleFloat 4s ease-in-out infinite; }
  .animate-scan { animation: scanMove 3s ease-in-out infinite; }
  .animate-soft-pulse { animation: softPulse 1.5s ease-in-out infinite; }

  @media (prefers-reduced-motion: reduce) {
    .animate-smooth-zoom, .animate-gentle-float, .animate-scan, .animate-soft-pulse, .animate-fade-in {
      animation: none !important;
    }
  }
`;

const MicIcon = ({ className = 'h-4 w-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
  </svg>
);

const CameraIcon = ({ className = 'h-9 w-9' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2.5" y="6" width="13" height="12" rx="3" />
    <path d="M15.5 10.5 21 7.5v9l-5.5-3" />
  </svg>
);

const BAR_FACTORS = [0.45, 0.8, 0.6, 1, 0.7, 0.85, 0.5];

function WaveBars({ level = 0, active = false, count = 7, className = 'bg-emerald-500' }) {
  const boost = Math.min(1, level * 10);
  return (
    <div className="flex h-8 items-center justify-center gap-1.5" aria-hidden="true">
      {BAR_FACTORS.slice(0, count).map((f, i) => (
        <span
          key={i}
          className={`w-1 rounded-full transition-[height] duration-100 ${className}`}
          style={{ height: `${active ? 6 + boost * f * 26 : 6}px` }}
        />
      ))}
    </div>
  );
}

function SceneImage({ step }) {
  const [broken, setBroken] = useState(false);
  if (!step.image || broken) {
    return (
      <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[#bfe5cb] to-[#8fd0a8] px-6 text-center">
        <div>
          <p className="font-serif text-5xl font-bold text-[#0f3b2a]/70">{step.id}</p>
          <p className="mt-2 text-xs font-medium text-[#0f3b2a]/70">
            Add scene-{step.id}.png to src/images to show the picture here.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="relative h-full w-full overflow-hidden">
      <img
        src={step.image}
        alt={`Scene ${step.id}`}
        onError={() => setBroken(true)}
        className="animate-fade-in h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10" />
    </div>
  );
}

function ProgressDots({ currentId, completedIds }) {
  return (
    <ol className="flex items-center" aria-label="Progress">
      {STEPS.map((s, i) => {
        const done = completedIds.includes(s.id);
        const current = s.id === currentId;
        return (
          <li key={s.id} className="flex items-center">
            {i > 0 && (
              <span
                className={`mx-1.5 h-0.5 w-4 rounded-full transition-colors ${
                  completedIds.includes(STEPS[i - 1].id) ? 'bg-[#10b981]' : 'bg-emerald-950/10'
                }`}
              />
            )}
            <span
              className={`grid h-7 w-7 place-items-center rounded-full text-[11px] font-bold shadow-xs transition-all ${
                done || current ? 'bg-[#0d2b20] text-emerald-100 ring-2 ring-emerald-500/20' : 'bg-white/80 text-emerald-900/60'
              }`}
            >
              {done ? '✓' : s.id}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function MoodPage({ moods, selectedMood, setSelectedMood, onStart }) {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1250px] w-full mx-auto flex items-center justify-center min-h-full font-sans">
      <div className="bg-white/95 backdrop-blur-xl border border-emerald-900/10 rounded-[30px] p-6 lg:p-10 w-full shadow-[0_20px_40px_rgba(13,43,32,0.06)] grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 lg:gap-8 items-center relative overflow-hidden">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <span className="inline-flex items-center gap-1.5 text-[0.65rem] font-bold tracking-widest uppercase text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full w-fit border border-emerald-600/15">
              ✦ WELLNESS CHECK
            </span>
            <h1 className="font-serif text-2xl lg:text-4xl font-bold text-[#0d2b20] tracking-tight leading-[1.15]">
              How are you <span className="text-emerald-600 underline decoration-emerald-500/30 underline-offset-6">feeling</span> today?
            </h1>
            <p className="text-xs text-emerald-950/70 leading-relaxed font-normal">
              Take a moment to check in with yourself. Pick your current mood to customize your mindfulness session.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {moods.map((m) => {
              const sel = selectedMood === m.id;
              return (
                <div
                  key={m.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={sel}
                  onClick={() => setSelectedMood(m.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedMood(m.id);
                    }
                  }}
                  className={`cursor-pointer rounded-xl p-3 border flex flex-col items-center justify-center text-center gap-2 transition-all duration-300 relative select-none ${
                    sel
                      ? 'border-emerald-600 bg-emerald-50/90 ring-2 ring-emerald-500/20 shadow-sm transform scale-[1.02]'
                      : 'border-emerald-950/10 bg-white hover:border-emerald-600/40 hover:bg-emerald-50/20 shadow-2xs'
                  }`}
                >
                  {sel && (
                    <span className="absolute top-2 right-2 w-3.5 h-3.5 bg-emerald-600 text-white rounded-full flex items-center justify-center text-[8px] font-bold">
                      ✓
                    </span>
                  )}
                  <span className="text-2xl p-1.5 bg-white rounded-xl shadow-2xs border border-emerald-950/5">
                    {m.icon}
                  </span>
                  <div>
                    <b className="font-serif text-xs text-[#0d2b20] block font-bold leading-tight">{m.label}</b>
                    <span className="text-[9px] text-emerald-950/50 mt-0.5 block line-clamp-1">{m.desc}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-emerald-50/80 border border-emerald-600/20 rounded-xl px-3.5 py-3 flex items-center gap-2.5 text-xs text-emerald-800 font-medium">
            <span>✨</span>
            <span>
              Selected mood: <strong className="capitalize font-bold">{selectedMood ? selectedMood : 'Calm'}</strong>.
            </span>
          </div>
        </div>

        <div className="group relative text-white rounded-[24px] p-6 flex flex-col justify-between gap-5 shadow-xl border border-white/15 overflow-hidden h-full min-h-[380px] bg-[#0d2b20]">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img
              src={CARD_BG_IMAGE}
              alt="Sanctuary"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
              className="animate-smooth-zoom w-full h-full object-cover opacity-30 mix-blend-overlay"
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-b from-[#0d2b20]/95 via-[#0a2319]/85 to-[#05140e] pointer-events-none" />

          <div className="relative z-10 flex justify-end">
            <span className="text-[11px] font-serif italic text-emerald-100/70 text-right leading-relaxed">
              It's okay <br /> to feel what <br /> you feel ♡
            </span>
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center my-auto text-center gap-4 pt-1">
            <div className="animate-gentle-float w-16 h-16 bg-white/10 backdrop-blur-xl rounded-xl flex items-center justify-center text-3xl shadow-inner border border-white/20">
              🌱
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-serif text-xl font-bold tracking-wide text-white">Ready for Check-in</h3>
              <p className="text-[11px] text-emerald-100/80 max-w-[210px] leading-relaxed">
                Manovedh will lead you through mindful observations.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onStart}
            className="relative z-10 w-full bg-white text-[#0d2b20] py-3 rounded-xl font-bold text-[11px] tracking-wider uppercase hover:bg-emerald-50 hover:scale-[1.01] active:scale-[0.98] transition-all duration-300 cursor-pointer shadow-md flex items-center justify-center gap-2"
          >
            <span>Start Activity</span> <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

const NODES = [
  { x: 12.5, y: 35 },
  { x: 37.5, y: 65 },
  { x: 62.5, y: 35 },
  { x: 87.5, y: 65 },
];
const PATH = 'M125 150 C 220 150, 275 250, 375 250 S 525 150, 625 150 S 780 250, 875 250';

function Chip({ state }) {
  const styles = {
    done: 'bg-emerald-100 text-emerald-800 border border-emerald-300/50',
    ready: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    locked: 'bg-white/80 text-emerald-950/40 border border-emerald-950/10',
  };
  const labels = { done: 'Completed', ready: 'Ready', locked: 'Locked' };
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-[8px] font-bold tracking-wide ${styles[state]}`}>
      {labels[state]}
    </span>
  );
}

function Thumb({ step, state }) {
  return (
    <div
      className={`relative aspect-square w-16 sm:w-20 mx-auto rounded-full border-3 border-white bg-emerald-100 shadow-md transition-transform duration-300 hover:scale-105 ${
        state === 'ready' ? 'ring-3 ring-emerald-500/60 shadow-emerald-500/20' : ''
      }`}
    >
      <div className="h-full w-full overflow-hidden rounded-full">
        {step.image ? (
          <img src={step.image} alt={`Scene ${step.id}`} className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full w-full place-items-center bg-gradient-to-br from-emerald-100 to-emerald-200 font-serif text-base font-bold text-emerald-900/70">
            {step.id}
          </div>
        )}
      </div>
      <span
        className={`absolute -right-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-full border-2 border-white text-[9px] font-bold text-white shadow-xs ${
          state === 'locked' ? 'bg-gray-400' : 'bg-[#0d2b20]'
        }`}
      >
        {state === 'done' ? '✓' : step.id}
      </span>
    </div>
  );
}

function JourneyPage({ completedIds = [], onStart, onBack }) {
  const firstOpen = STEPS.find((s) => !completedIds.includes(s.id));
  const stateOf = (step) => {
    if (completedIds.includes(step.id)) return 'done';
    if (firstOpen && firstOpen.id === step.id) return 'ready';
    return 'locked';
  };
  const allDone = !firstOpen;
  const started = completedIds.length > 0;

  return (
    <div className="mx-auto w-full max-w-[1250px] p-4 font-sans sm:p-6 lg:p-8">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="mb-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold text-emerald-700 bg-white/80 border border-emerald-900/10 shadow-2xs transition hover:bg-white"
        >
          <span>←</span> Change mood
        </button>
      )}

      <div className="rounded-[30px] border border-white/80 bg-gradient-to-br from-[#d4f0e0] to-[#bce8cb] p-5 sm:p-8 shadow-[0_20px_40px_rgba(13,43,32,0.06)]">
        <div className="mb-6 text-center md:text-left">
          <span className="inline-block text-[0.65rem] font-bold uppercase tracking-widest text-emerald-800 bg-emerald-900/10 px-2.5 py-0.5 rounded-full mb-1.5">
            🧭 Your Roadmap
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#0d2b20]">
            Your Wellness Journey
          </h1>
          <p className="mt-1 text-xs text-emerald-950/70">
            Four compact observation steps, followed by a quick voice phonation session.
          </p>
        </div>

        <div className="relative mx-auto hidden aspect-[1000/380] w-full max-w-4xl md:block">
          <svg viewBox="0 0 1000 380" className="absolute inset-0 h-full w-full overflow-visible" fill="none" aria-hidden="true">
            <path d={PATH} stroke="#9ad3b4" strokeWidth="18" strokeLinecap="round" />
            <path d={PATH} stroke="#0d2b20" strokeWidth="3" strokeLinecap="round" strokeDasharray="10 8" />
          </svg>

          {STEPS.map((step, i) => {
            const state = stateOf(step);
            const isBottom = i % 2 === 1;
            return (
              <div
                key={step.id}
                className="absolute w-[22%] -translate-x-1/2 text-center pointer-events-auto"
                style={{ left: `${NODES[i].x}%`, top: `${NODES[i].y}%` }}
              >
                {isBottom ? (
                  <div className="flex flex-col items-center">
                    <div className="mb-2 text-center">
                      <p className="text-xs font-bold text-[#0d2b20] leading-tight">Step {step.id}</p>
                      <p className="text-[10px] text-emerald-950/70 font-medium truncate px-1">{step.title}</p>
                      <div className="mt-0.5">
                        <Chip state={state} />
                      </div>
                    </div>
                    <Thumb step={step} state={state} />
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Thumb step={step} state={state} />
                    <div className="mt-2 text-center">
                      <p className="text-xs font-bold text-[#0d2b20] leading-tight">Step {step.id}</p>
                      <p className="text-[10px] text-emerald-950/70 font-medium truncate px-1">{step.title}</p>
                      <div className="mt-0.5">
                        <Chip state={state} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <ol className="space-y-3 md:hidden">
          {STEPS.map((step) => {
            const state = stateOf(step);
            return (
              <li key={step.id} className="flex items-center gap-3.5 rounded-xl bg-white/70 backdrop-blur-sm p-3 border border-white/60 shadow-2xs">
                <div className="w-14 shrink-0">
                  <Thumb step={step} state={state} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#0d2b20]">Step {step.id}</p>
                  <p className="text-[11px] text-emerald-950/70 font-medium">{step.title}</p>
                  <div className="mt-1">
                    <Chip state={state} />
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-14 sm:mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-emerald-950/10 pt-5">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-amber-300 bg-amber-50 text-base text-amber-600 shadow-xs">
              ★
            </span>
            <div>
              <p className="text-xs font-bold text-[#0d2b20]">Final Phase</p>
              <p className="text-[10px] text-emerald-950/70">Voice Phonation & Summary</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onStart}
            className="group inline-flex items-center gap-2.5 rounded-xl bg-[#0d2b20] px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-white shadow-md transition-all hover:bg-emerald-900 active:scale-[0.98]"
          >
            {allDone ? 'Continue to Phonation' : started ? 'Continue Journey' : 'Start Journey'}
            <span className="grid h-5 w-5 place-items-center rounded-full bg-white/20 text-[9px] transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

function RecordingStep({
  step,
  stepIndex,
  completedIds,
  stream,
  camStatus,
  requestCamera,
  onComplete,
  onNext,
  onBack,
}) {
  const videoRef = useRef(null);
  const engineRef = useRef(null);
  const aliveRef = useRef(true);
  const busyRef = useRef(false);

  const [guideOpen, setGuideOpen] = useState(false);
  const [phase, setPhase] = useState('idle');
  const [message, setMessage] = useState('');
  const [remaining, setRemaining] = useState(RESPONSE_SECONDS);
  const [level, setLevel] = useState(0);
  const [speechSeconds, setSpeechSeconds] = useState(0);

  const { status: faceLight, statsRef } = useFaceLight(videoRef, camStatus === 'ready');

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.srcObject = stream || null;
    if (stream) {
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    }
  }, [stream]);

  const teardown = useCallback(() => {
    const e = engineRef.current;
    engineRef.current = null;
    if (!e) return;
    clearInterval(e.id);
    e.meter.close();
    if (e.rec) e.rec.stop(false);
  }, []);

  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
      teardown();
    };
  }, [teardown]);

  const handleStart = async () => {
    if (busyRef.current || engineRef.current) return;
    busyRef.current = true;
    setMessage('');
    setPhase('preparing');

    let meter = null;
    try {
      let s = stream;
      const live = s && s.getTracks().length > 0 && s.getTracks().every((t) => t.readyState === 'live');
      if (!live) s = await requestCamera();
      if (!aliveRef.current) return;
      if (!s) {
        setPhase('idle');
        setMessage(CAMERA_OFF_MSG);
        return;
      }

      const audioTracks = s.getAudioTracks();
      if (!audioTracks.length) {
        setPhase('idle');
        setMessage('No microphone found.');
        return;
      }

      const audioStream = new MediaStream(audioTracks);
      meter = createMeter(audioStream);
      const threshold = await calibrateThreshold(meter, CALIBRATE_MS);
      if (!aliveRef.current) {
        meter.close();
        return;
      }

      const rec = createRecorder(audioStream);
      if (rec) rec.start();
      statsRef.current = { hits: 0, total: 0 };

      const startedAt = performance.now();
      let last = startedAt;
      let speechMs = 0;
      let finished = false;
      const engine = { meter, rec, id: 0 };

      const finish = async () => {
        if (finished) return;
        finished = true;
        clearInterval(engine.id);
        engineRef.current = null;
        const blob = rec ? await rec.stop(true) : null;
        meter.close();
        if (!aliveRef.current) return;

        const speechSec = speechMs / 1000;
        const { hits, total } = statsRef.current;
        setSpeechSeconds(speechSec);
        setLevel(0);
        setRemaining(0);

        if (speechSec >= MIN_SPEECH_SECONDS) {
          setPhase('passed');
          onComplete({
            stepId: step.id,
            blob,
            speechSeconds: speechSec,
            faceRatio: total ? hits / total : 0,
          });
        } else {
          setPhase('failed');
          setMessage(`Recorded ${Math.round(speechSec)}s speech — at least ${MIN_SPEECH_SECONDS}s needed. Speak louder.`);
        }
      };

      engine.id = setInterval(() => {
        const now = performance.now();
        const dt = Math.min(250, now - last);
        last = now;
        const { rms } = meter.read();
        if (rms > threshold) speechMs += dt;
        const elapsed = (now - startedAt) / 1000;
        setLevel(rms);
        setRemaining(Math.max(0, RESPONSE_SECONDS - elapsed));
        if (elapsed >= RESPONSE_SECONDS) finish();
      }, 50);

      engineRef.current = engine;
      setRemaining(RESPONSE_SECONDS);
      setPhase('recording');
    } catch (e) {
      if (meter) meter.close();
      if (aliveRef.current) {
        setPhase('idle');
        setMessage('Could not start microphone.');
      }
    } finally {
      busyRef.current = false;
    }
  };

  const handleBack = () => {
    teardown();
    onBack();
  };

  const showScene = phase === 'recording' || phase === 'passed';
  const isLast = stepIndex === STEPS.length - 1;
  const startLabel =
    phase === 'preparing' ? 'Calibrating…' : phase === 'failed' ? 'Try Again' : 'Start Recording';

  return (
    <div className="mx-auto w-full max-w-[1050px] p-4 font-sans sm:p-6">
      <div className="rounded-[30px] border border-white/80 bg-gradient-to-br from-[#d4f0e0] to-[#bce8cb] p-4 sm:p-6 shadow-[0_20px_40px_rgba(13,43,32,0.06)]">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleBack}
              className="grid h-8 w-8 place-items-center rounded-full bg-white/80 text-sm text-[#0d2b20] border border-emerald-950/10 shadow-2xs"
            >
              ←
            </button>
            <div>
              <p className="text-[10px] font-bold text-emerald-900/60 uppercase tracking-widest">
                Step {stepIndex + 1} of {STEPS.length}
              </p>
              <h2 className="text-sm font-serif font-bold text-[#0d2b20]">{step.title}</h2>
            </div>
          </div>
          <ProgressDots currentId={step.id} completedIds={completedIds} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_280px]">
          <div className="rounded-2xl bg-white/50 backdrop-blur-md p-4 border border-white/60 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-[#091712] shadow-inner">
                <span className="absolute left-3 top-3 z-10 rounded-full bg-black/60 px-2.5 py-0.5 text-[9px] font-bold text-white border border-white/10">
                  Scene {step.id}
                </span>

                {showScene ? (
                  <>
                    <SceneImage step={step} />
                    {phase === 'recording' && (
                      <span className="absolute right-3 top-3 z-10 rounded-full bg-rose-600 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-md flex items-center gap-1.5 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        {formatClock(remaining)}
                      </span>
                    )}
                  </>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-3 px-4 text-center bg-gradient-to-br from-[#0d2b20] to-[#071711]">
                    <button
                      type="button"
                      onClick={handleStart}
                      disabled={phase === 'preparing'}
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#0d2b20] shadow-md transition-all hover:bg-emerald-400 active:scale-[0.98]"
                    >
                      <MicIcon className="w-3.5 h-3.5" />
                      {startLabel}
                    </button>
                    <p className="max-w-[240px] text-[11px] leading-relaxed text-emerald-100/80">
                      {phase === 'preparing' ? 'Calibrating noise level…' : `Click to view scene & start ${RESPONSE_SECONDS}s response`}
                    </p>
                    {message && (
                      <p className="text-[10px] font-semibold text-amber-300 bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-500/30">
                        {message}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <p className="mt-3.5 text-center text-xs font-serif font-bold text-[#0d2b20] sm:text-sm">{step.prompt}</p>
            </div>

            {phase === 'recording' && (
              <div className="mt-3 flex flex-col items-center gap-1.5 bg-white/60 py-2.5 rounded-xl border border-white/80">
                <WaveBars level={level} active />
                <p className="text-[9px] font-bold uppercase tracking-widest text-rose-600">● Recording audio…</p>
              </div>
            )}

            {phase === 'passed' && (
              <div className="mt-3 flex flex-col items-center gap-2 bg-emerald-100/70 p-3 rounded-xl border border-emerald-300/50">
                <p className="text-[11px] font-bold text-emerald-900">
                  ✓ Captured ({Math.round(speechSeconds)}s clear speech)
                </p>
                <button
                  type="button"
                  onClick={onNext}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#0d2b20] px-5 py-2 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-emerald-900"
                >
                  {isLast ? 'Continue to Phonation' : 'Next Step'} →
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <div className="rounded-2xl bg-white/50 backdrop-blur-md p-4 border border-white/60 shadow-2xs">
              <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-full border-3 border-white bg-emerald-100 shadow-md ring-3 ring-emerald-500/20">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className={`h-full w-full -scale-x-100 object-cover ${stream ? '' : 'hidden'}`}
                />
                {!stream && (
                  <div className="grid h-full w-full place-items-center text-emerald-900/40">
                    <CameraIcon className="w-7 h-7" />
                  </div>
                )}
                <span className="animate-scan pointer-events-none absolute left-[6%] right-[6%] h-0.5 rounded-full bg-emerald-400" />
              </div>

              <div className="mt-3 border-t border-emerald-950/10 pt-3">
                <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-900/70">Camera check:</p>
                <div className="mt-2 flex items-center justify-between rounded-xl bg-white/80 px-3 py-2 text-[10px] font-bold border border-emerald-950/5">
                  <span className={faceLight.face ? 'text-emerald-700' : 'text-gray-500'}>
                    {faceLight.face ? '✓ Face OK' : '● Searching'}
                  </span>
                  <span className={faceLight.light ? 'text-emerald-700' : 'text-amber-600'}>
                    ● {faceLight.light ? 'Light OK' : 'Low Light'}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white/50 backdrop-blur-md p-3 border border-white/60 shadow-2xs">
              <button
                type="button"
                onClick={() => setGuideOpen((o) => !o)}
                className="flex w-full items-center justify-between text-left text-[11px] font-bold text-[#0d2b20]"
              >
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-1 rounded-full bg-emerald-600" />
                  Quick Tips
                </span>
                <span className="text-emerald-900/50 text-xs">{guideOpen ? '▲' : '▼'}</span>
              </button>
              {guideOpen && (
                <ul className="mt-2 list-disc space-y-1 pl-3.5 text-[10px] text-emerald-950/70">
                  <li>Observe carefully.</li>
                  <li>Speak clearly.</li>
                  <li>Hold speech for 8s+.</li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepsRunner({ startIndex, responses, onStepComplete, onExit, onFinish }) {
  const { stream, status, request } = useCameraStream();
  const [idx, setIdx] = useState(startIndex);
  const step = STEPS[idx];
  const completedIds = Object.keys(responses).map(Number);

  const next = () => {
    if (idx + 1 < STEPS.length) setIdx(idx + 1);
    else onFinish();
  };

  return (
    <RecordingStep
      key={step.id}
      step={step}
      stepIndex={idx}
      completedIds={completedIds}
      stream={stream}
      camStatus={status}
      requestCamera={request}
      onComplete={onStepComplete}
      onNext={next}
      onBack={onExit}
    />
  );
}

function PhonationActivity({ onFinish, onBack }) {
  const letters = PHONATION_LETTERS;
  const engineRef = useRef(null);
  const aliveRef = useRef(true);
  const blobsRef = useRef([]);
  const pendingRef = useRef([]);

  const [ui, setUi] = useState({
    phase: 'idle',
    index: 0,
    progress: 0,
    done: letters.map(() => false),
  });
  const [level, setLevel] = useState(0);
  const [hint, setHint] = useState('');
  const [error, setError] = useState('');

  const teardown = useCallback(() => {
    const e = engineRef.current;
    engineRef.current = null;
    if (!e) return;
    clearInterval(e.id);
    if (e.rec) e.rec.stop(false);
    e.meter.close();
    stopStream(e.stream);
  }, []);

  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
      teardown();
    };
  }, [teardown]);

  const begin = (stream, meter, threshold) => {
    const st = {
      index: 0,
      phase: 'listening',
      voicedMs: 0,
      gapMs: 0,
      unclearMs: 0,
      silentMs: 0,
      restMs: 0,
      quietMs: 0,
    };
    const done = letters.map(() => false);
    const engine = { stream, meter, rec: createRecorder(stream), id: 0 };
    if (engine.rec) engine.rec.start();
    const gate = Math.max(0.012, threshold * 0.7);
    let last = performance.now();

    engine.id = setInterval(() => {
      const now = performance.now();
      const dt = Math.min(250, now - last);
      last = now;
      const { rms, pitch, clarity } = meter.read();
      const loud = rms > gate;
      setLevel(rms);

      if (st.phase === 'listening') {
        const voiced = loud && clarity >= PHONATION_MIN_CLARITY && pitch >= PITCH_MIN && pitch <= PITCH_MAX;

        if (voiced) {
          st.voicedMs += dt;
          st.gapMs = 0;
          st.unclearMs = 0;
          st.silentMs = 0;
        } else {
          st.gapMs += dt;
          if (st.gapMs > PHONATION_GAP_MS) st.voicedMs = 0;
          if (loud) {
            st.unclearMs += dt;
            st.silentMs = 0;
          } else {
            st.silentMs += dt;
            st.unclearMs = 0;
          }
        }

        setHint(st.unclearMs > 1800 ? 'unclear' : st.silentMs > 5000 ? 'quiet' : '');

        if (st.voicedMs >= PHONATION_HOLD_MS) {
          const finishedIndex = st.index;
          done[finishedIndex] = true;
          st.phase = 'resting';
          st.restMs = 0;
          st.quietMs = 0;
          const r = engine.rec;
          engine.rec = null;
          if (r) {
            pendingRef.current.push(
              r.stop(true).then((blob) => {
                blobsRef.current[finishedIndex] = blob;
              })
            );
          }
          setHint('');
          setUi({ phase: 'resting', index: finishedIndex, progress: 1, done: [...done] });
        } else {
          const progress = Math.min(1, st.voicedMs / PHONATION_HOLD_MS);
          setUi((u) => (u.phase === 'listening' && u.index === st.index ? { ...u, progress } : u));
        }
      } else if (st.phase === 'resting') {
        st.restMs += dt;
        st.quietMs = loud ? 0 : st.quietMs + dt;
        const isLastLetter = st.index + 1 >= letters.length;

        if (st.restMs >= PHONATION_REST_MS && (isLastLetter || st.quietMs >= PHONATION_QUIET_MS)) {
          if (isLastLetter) {
            clearInterval(engine.id);
            engineRef.current = null;
            meter.close();
            stopStream(stream);
            setLevel(0);
            setUi({ phase: 'done', index: st.index, progress: 1, done: [...done] });
          } else {
            st.index += 1;
            st.phase = 'listening';
            st.voicedMs = 0;
            st.gapMs = 0;
            st.unclearMs = 0;
            st.silentMs = 0;
            engine.rec = createRecorder(stream);
            if (engine.rec) engine.rec.start();
            setUi({ phase: 'listening', index: st.index, progress: 0, done: [...done] });
          }
        }
      }
    }, 60);

    engineRef.current = engine;
    setUi({ phase: 'listening', index: 0, progress: 0, done: [...done] });
  };

  const handleStart = async () => {
    if (engineRef.current || ui.phase === 'starting') return;
    setError('');
    setHint('');
    blobsRef.current = [];
    pendingRef.current = [];
    setUi({ phase: 'starting', index: 0, progress: 0, done: letters.map(() => false) });

    let stream = null;
    let meter = null;
    try {
      stream = await requestMic();
      if (!aliveRef.current) {
        stopStream(stream);
        return;
      }
      meter = createMeter(stream);
      const threshold = await calibrateThreshold(meter, 900);
      if (!aliveRef.current) {
        meter.close();
        stopStream(stream);
        return;
      }
      begin(stream, meter, threshold);
    } catch (e) {
      if (meter) meter.close();
      stopStream(stream);
      if (aliveRef.current) {
        setError('Microphone permission is off.');
        setUi({ phase: 'idle', index: 0, progress: 0, done: letters.map(() => false) });
      }
    }
  };

  const handleFinish = async () => {
    await Promise.all(pendingRef.current);
    if (!aliveRef.current) return;
    onFinish(letters.map((letter, i) => ({ letter, blob: blobsRef.current[i] || null })));
  };

  const handleBack = () => {
    teardown();
    onBack();
  };

  const { phase, index, progress, done } = ui;
  const completedCount = done.filter(Boolean).length;
  const letter = letters[Math.min(index, letters.length - 1)];
  const R = 64;
  const CIRC = 2 * Math.PI * R;
  const active = phase === 'listening';

  let status = 'Press Start Activity to capture sounds.';
  if (phase === 'starting') status = 'Calibrating mic…';
  else if (phase === 'listening') {
    status =
      hint === 'unclear'
        ? 'Use a steady, resonant voice.'
        : hint === 'quiet'
        ? 'Speech not detected — speak louder.'
        : `Say “${letter}” and hold it steadily…`;
  } else if (phase === 'resting') status = '✓ Sound captured. Brief pause…';
  else if (phase === 'done') status = 'All sounds captured successfully.';

  return (
    <div className="mx-auto w-full max-w-[950px] p-4 font-sans sm:p-6">
      <div className="rounded-[30px] border border-white/80 bg-gradient-to-br from-[#d4f0e0] to-[#bce8cb] p-5 sm:p-8 shadow-[0_20px_40px_rgba(13,43,32,0.06)]">
        <button
          type="button"
          onClick={handleBack}
          className="mb-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold text-emerald-700 bg-white/85 border border-emerald-900/10 shadow-2xs"
        >
          <span>←</span> Back to journey
        </button>

        <div className="relative mx-auto max-w-[540px] overflow-hidden rounded-[26px] border border-white/85 bg-white/80 backdrop-blur-xl px-5 py-6 shadow-lg">
          <div className="text-center">
            <span className="inline-block text-[0.65rem] font-bold uppercase tracking-widest text-emerald-800 bg-emerald-900/10 px-2.5 py-0.5 rounded-full mb-1">
              🎙️ Vocal Phonation
            </span>
            <h2 className="font-serif text-xl font-bold tracking-tight text-[#0d2b20]">Voice Phonation Activity</h2>
            <p className="mt-0.5 text-[11px] text-emerald-950/60 font-medium">Hold steady vowel sounds</p>
            <p className="mt-2.5 inline-block bg-emerald-100/90 px-3.5 py-0.5 rounded-full text-[11px] font-bold text-emerald-800">
              {completedCount} / {letters.length} completed
            </p>
          </div>

          <div className="mt-5 flex items-center justify-center gap-3 sm:gap-6">
            <WaveBars level={level} active={active} count={4} className="bg-emerald-500" />
            <div className="relative grid h-36 w-36 place-items-center rounded-full bg-white shadow-md border border-emerald-950/5">
              <svg viewBox="0 0 150 150" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
                <circle cx="75" cy="75" r={R} fill="none" stroke="#e2f5ec" strokeWidth="5" />
                <circle
                  cx="75"
                  cy="75"
                  r={R}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={CIRC}
                  strokeDashoffset={CIRC * (1 - (phase === 'done' ? 1 : progress))}
                  style={{ transition: 'stroke-dashoffset 120ms linear' }}
                />
              </svg>
              <span className="relative text-5xl font-serif font-bold text-[#0d2b20]" lang="hi">
                {phase === 'done' ? '✓' : letter}
              </span>
            </div>
            <WaveBars level={level} active={active} count={4} className="bg-emerald-500" />
          </div>

          <div className="mt-5 flex justify-center">
            {phase === 'done' ? (
              <button
                type="button"
                onClick={handleFinish}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0d2b20] px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-md hover:bg-emerald-900"
              >
                Complete Phonation ✓
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStart}
                disabled={phase !== 'idle'}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#0d2b20] px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-md hover:bg-emerald-900 disabled:opacity-60"
              >
                <MicIcon className="h-3.5 w-3.5" />
                {phase === 'idle' ? 'Start Activity' : phase === 'starting' ? 'Calibrating…' : 'Listening…'}
              </button>
            )}
          </div>

          <p
            className={`mx-auto mt-3 max-w-[380px] rounded-xl bg-white/90 border border-emerald-950/5 px-3 py-1.5 text-center text-[11px] ${
              hint ? 'font-bold text-amber-700 bg-amber-50' : 'text-emerald-950/70'
            }`}
            role="status"
            aria-live="polite"
          >
            {status}
          </p>
          {error && (
            <p className="mt-2 text-center text-[10px] font-semibold text-rose-600 bg-rose-50 py-1.5 rounded-lg border border-rose-200" role="alert">
              {error}
            </p>
          )}

          <ol className="mx-auto mt-5 flex max-w-[440px] items-center justify-between gap-1 rounded-xl bg-white/90 p-1.5 shadow-2xs border border-emerald-950/5">
            {letters.map((l, i) => {
              const isDone = done[i];
              const isCurrent = i === index && phase !== 'done';
              return (
                <li
                  key={l}
                  lang="hi"
                  className={`grid h-8 flex-1 place-items-center rounded-lg text-xs font-bold transition ${
                    isDone
                      ? 'bg-emerald-100 text-emerald-800'
                      : isCurrent
                      ? 'border border-emerald-500/40 bg-emerald-50 text-[#0d2b20]'
                      : 'text-emerald-950/40'
                  }`}
                >
                  {l}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}

function CompletePage({ mood, moods, onRestart }) {
  const m = moods.find((x) => x.id === mood);
  return (
    <div className="mx-auto w-full max-w-[640px] p-4 font-sans sm:p-6">
      <div className="rounded-[30px] border border-white/80 bg-gradient-to-br from-[#d4f0e0] to-[#bce8cb] p-6 sm:p-10 text-center shadow-[0_20px_40px_rgba(13,43,32,0.06)]">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#0d2b20] text-3xl text-emerald-400 shadow-lg">
          ✓
        </span>
        <h1 className="mt-4 font-serif text-2xl font-bold text-[#0d2b20]">Wellness Check Complete</h1>
        <p className="mt-1.5 text-xs text-emerald-950/70">Thank you for your time. Your session data has been captured.</p>

        <div className="mt-6 grid grid-cols-1 gap-3 text-left sm:grid-cols-3">
          <div className="rounded-xl bg-white/80 backdrop-blur-md p-3 border border-white/60 shadow-2xs">
            <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-900/60">Today's Mood</p>
            <p className="mt-0.5 text-xs font-bold capitalize text-[#0d2b20]">
              {m ? `${m.icon} ${m.label}` : mood}
            </p>
          </div>
          <div className="rounded-xl bg-white/80 backdrop-blur-md p-3 border border-white/60 shadow-2xs">
            <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-900/60">Story Steps</p>
            <p className="mt-0.5 text-xs font-bold text-[#0d2b20]">
              {STEPS.length} / {STEPS.length} done
            </p>
          </div>
          <div className="rounded-xl bg-white/80 backdrop-blur-md p-3 border border-white/60 shadow-2xs">
            <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-900/60">Voice Phonation</p>
            <p className="mt-0.5 text-xs font-bold text-[#0d2b20]">
              {PHONATION_LETTERS.length} / {PHONATION_LETTERS.length} captured
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onRestart}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0d2b20] px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-white shadow-md hover:bg-emerald-900"
        >
          Start New Check-in
        </button>
      </div>
    </div>
  );
}

export default function WellnessCheck({
  selectedMood: moodProp,
  setSelectedMood: setMoodProp,
  moods = MOODS,
  onComplete,
}) {
  const [stage, setStage] = useState('mood');
  const [startIndex, setStartIndex] = useState(0);
  const [localMood, setLocalMood] = useState('calm');
  const [responses, setResponses] = useState({});
  const [, setPhonation] = useState(null);

  const selectedMood = moodProp !== undefined && moodProp !== null ? moodProp : localMood;
  const setSelectedMood = (id) => {
    setLocalMood(id);
    if (setMoodProp) setMoodProp(id);
  };

  const completedIds = Object.keys(responses).map(Number);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.scrollTo) window.scrollTo(0, 0);
  }, [stage]);

  const startJourney = () => {
    const firstOpen = STEPS.findIndex((s) => !completedIds.includes(s.id));
    if (firstOpen === -1) {
      setStage('phonation');
    } else {
      setStartIndex(firstOpen);
      setStage('steps');
    }
  };

  const restart = () => {
    setResponses({});
    setPhonation(null);
    setStartIndex(0);
    setStage('mood');
  };

  return (
    <>
      <style>{animationCss}</style>

      {stage === 'mood' && (
        <MoodPage
          moods={moods}
          selectedMood={selectedMood}
          setSelectedMood={setSelectedMood}
          onStart={() => setStage('journey')}
        />
      )}

      {stage === 'journey' && (
        <JourneyPage completedIds={completedIds} onStart={startJourney} onBack={() => setStage('mood')} />
      )}

      {stage === 'steps' && (
        <StepsRunner
          startIndex={startIndex}
          responses={responses}
          onStepComplete={(res) => setResponses((prev) => ({ ...prev, [res.stepId]: res }))}
          onExit={() => setStage('journey')}
          onFinish={() => setStage('phonation')}
        />
      )}

      {stage === 'phonation' && (
        <PhonationActivity
          onBack={() => setStage('journey')}
          onFinish={(results) => {
            setPhonation(results);
            setStage('done');
            if (onComplete) onComplete({ mood: selectedMood, responses, phonation: results });
          }}
        />
      )}

      {stage === 'done' && <CompletePage mood={selectedMood} moods={moods} onRestart={restart} />}
    </>
  );
}