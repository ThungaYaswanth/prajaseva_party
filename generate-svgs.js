const fs = require('fs');
const path = require('path');

// 1. Party Emblem SVG (Intricate golden radiant Sri Yantra / Surya Chakra)
const partyEmblemSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <defs>
    <radialGradient id="goldGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFF5C2"/>
      <stop offset="40%" stop-color="#FFD23F"/>
      <stop offset="75%" stop-color="#E59500"/>
      <stop offset="100%" stop-color="#B26500"/>
    </radialGradient>
    <linearGradient id="goldLinear" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFE885"/>
      <stop offset="50%" stop-color="#FFC928"/>
      <stop offset="100%" stop-color="#D97706"/>
    </linearGradient>
    <radialGradient id="centerGem" cx="40%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#FF4D4D"/>
      <stop offset="60%" stop-color="#C81016"/>
      <stop offset="100%" stop-color="#80080B"/>
    </radialGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#80080B" flood-opacity="0.3"/>
    </filter>
  </defs>

  <!-- Outer halo glow -->
  <circle cx="100" cy="100" r="95" fill="none" stroke="url(#goldLinear)" stroke-width="1.5" opacity="0.6"/>
  <circle cx="100" cy="100" r="91" fill="none" stroke="url(#goldLinear)" stroke-width="2.5" stroke-dasharray="3,3"/>
  <circle cx="100" cy="100" r="85" fill="#FFFDF0" stroke="url(#goldLinear)" stroke-width="3" filter="url(#shadow)"/>

  <!-- Radiating Petals / Rays (24 petals) -->
  <g fill="url(#goldLinear)" stroke="#B26500" stroke-width="0.75">
    ${Array.from({length: 24}).map((_, i) => {
      const angle = (i * 360) / 24;
      return `<path d="M 100 20 L 104 33 L 96 33 Z" transform="rotate(${angle} 100 100)"/>`;
    }).join('\n    ')}
  </g>

  <!-- Outer Ring with Beads -->
  <circle cx="100" cy="100" r="67" fill="none" stroke="#C81016" stroke-width="2"/>
  <circle cx="100" cy="100" r="63" fill="#FFFBEB" stroke="url(#goldLinear)" stroke-width="2"/>
  
  <g fill="#C81016">
    ${Array.from({length: 16}).map((_, i) => {
      const angle = (i * 360) / 16;
      return `<circle cx="100" cy="39" r="1.8" transform="rotate(${angle} 100 100)"/>`;
    }).join('\n    ')}
  </g>

  <!-- 16-Petal Lotus Band -->
  <g fill="none" stroke="url(#goldLinear)" stroke-width="1.8">
    ${Array.from({length: 16}).map((_, i) => {
      const angle = (i * 360) / 16;
      return `<path d="M 94 43 Q 100 37 106 43" transform="rotate(${angle} 100 100)"/>`;
    }).join('\n    ')}
  </g>

  <!-- 8-Petal Inner Lotus -->
  <circle cx="100" cy="100" r="50" fill="none" stroke="#C81016" stroke-width="1.5"/>
  <g fill="url(#goldGlow)" stroke="#B26500" stroke-width="0.8" opacity="0.9">
    ${Array.from({length: 8}).map((_, i) => {
      const angle = (i * 360) / 8;
      return `<path d="M 92 53 C 92 46, 108 46, 108 53 C 108 59, 92 59, 92 53 Z" transform="rotate(${angle} 100 100)"/>`;
    }).join('\n    ')}
  </g>

  <!-- Sri Yantra Sacred Geometry Intersecting Triangles -->
  <circle cx="100" cy="100" r="41" fill="#FFFDF8" stroke="url(#goldLinear)" stroke-width="2.2"/>
  <g stroke="#C81016" stroke-width="1.6" fill="none" stroke-linejoin="round">
    <!-- Upward Triangles -->
    <polygon points="100,61 70,113 130,113"/>
    <polygon points="100,67 76,118 124,118"/>
    <polygon points="100,74 81,123 119,123"/>
    <polygon points="100,80 86,128 114,128"/>
    
    <!-- Downward Triangles -->
    <polygon points="100,139 70,87 130,87" stroke="#D97706"/>
    <polygon points="100,133 76,82 124,82" stroke="#D97706"/>
    <polygon points="100,126 81,77 119,77" stroke="#D97706"/>
    <polygon points="100,120 86,72 114,72" stroke="#D97706"/>
    <polygon points="100,114 90,68 110,68" stroke="#D97706"/>
  </g>

  <!-- Central Radiant Bindu -->
  <circle cx="100" cy="100" r="6" fill="url(#centerGem)" stroke="url(#goldLinear)" stroke-width="1.5"/>
  <circle cx="100" cy="100" r="2" fill="#FFFFFF"/>
</svg>`;

// 2. Anti-corruption SVG for Card 09 (Bribe forbidden icon with red slash)
const antiCorruptionSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="100%" height="100%">
  <!-- White circular card badge -->
  <circle cx="80" cy="80" r="75" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
  
  <!-- Silhouette of hand giving money / bribe in dark slate #1E293B -->
  <g fill="#1E293B" transform="translate(30, 48) scale(0.65)">
    <!-- Hand Left -->
    <path d="M5 45 C15 35 25 35 45 42 L65 42 C70 42 75 38 75 30 C75 22 68 20 60 20 L30 20 C20 20 10 28 5 45 Z" />
    <path d="M40 48 L70 48 C75 48 80 52 80 56 C80 62 72 65 65 65 L35 65" />
    <!-- Banknotes / Cash bundle -->
    <rect x="52" y="22" width="48" height="28" rx="3" fill="#059669" transform="rotate(-15 65 35)"/>
    <circle cx="68" cy="33" r="5" fill="#34D399"/>
    <!-- Hand Right receiving -->
    <path d="M125 50 C115 40 105 40 90 44 L78 44 C72 44 68 38 70 30 C72 22 80 20 88 20 L115 20 C125 20 135 28 140 48 Z" />
  </g>

  <!-- Universal Prohibited Ring & Slash in vivid red #DC2626 -->
  <circle cx="80" cy="80" r="56" fill="none" stroke="#DC2626" stroke-width="9"/>
  <line x1="40" y1="40" x2="120" y2="120" stroke="#DC2626" stroke-width="9" stroke-linecap="round"/>
</svg>`;

// 3. Stylized Telangana Map SVG
const telanganaMapSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320" width="100%" height="100%">
  <defs>
    <radialGradient id="tsGlow" cx="45%" cy="45%" r="60%">
      <stop offset="0%" stop-color="#E51E25"/>
      <stop offset="60%" stop-color="#C81016"/>
      <stop offset="100%" stop-color="#8E080D"/>
    </radialGradient>
    <filter id="tgShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.45"/>
    </filter>
  </defs>

  <!-- Telangana State Path with 33 districts subtle faceted mesh -->
  <g filter="url(#tgShadow)">
    <path d="M 120 40 
             C 145 35, 175 42, 205 60 
             C 225 72, 245 95, 255 120 
             C 265 145, 258 175, 245 200 
             C 230 228, 205 255, 180 270 
             C 160 282, 140 285, 125 275 
             C 105 260, 90 240, 80 215 
             C 70 190, 65 165, 75 135 
             C 85 105, 95 70, 110 50 Z" 
          fill="url(#tsGlow)" stroke="#FFD23F" stroke-width="3" />
    
    <!-- Stylized district contour lines inside map -->
    <path d="M 140 65 L 175 105 L 210 90 M 175 105 L 165 160 L 220 180 M 165 160 L 125 150 L 105 190 M 165 160 L 160 220 L 195 245 M 125 150 L 95 125 M 160 220 L 120 240" 
          stroke="#FFFFFF" stroke-opacity="0.35" stroke-width="1.5" fill="none" stroke-linejoin="round"/>
    
    <!-- Hyderabad Capital Star / Glow Pin -->
    <circle cx="155" cy="165" r="9" fill="#FFC928" stroke="#FFFFFF" stroke-width="2"/>
    <circle cx="155" cy="165" r="3.5" fill="#C81016"/>
    <circle cx="155" cy="165" r="16" fill="none" stroke="#FFC928" stroke-width="1.5" stroke-dasharray="3,3" opacity="0.8"/>
  </g>

  <!-- 70% Reservation Badge Overlay -->
  <g transform="translate(195, 45)">
    <circle cx="28" cy="28" r="28" fill="#FFC928" stroke="#FFFFFF" stroke-width="2.5" filter="url(#tgShadow)"/>
    <text x="28" y="28" font-family="'Noto Sans Telugu', sans-serif" font-weight="900" font-size="14" fill="#C81016" text-anchor="middle">70%</text>
    <text x="28" y="42" font-family="'Noto Sans Telugu', sans-serif" font-weight="bold" font-size="9" fill="#0F172A" text-anchor="middle">స్థానికులకు</text>
  </g>
</svg>`;

// Write all SVGs
fs.writeFileSync(path.join(__dirname, 'assets/images/party-emblem.svg'), partyEmblemSvg);
fs.writeFileSync(path.join(__dirname, 'assets/images/telangana-map.svg'), telanganaMapSvg);
fs.writeFileSync(path.join(__dirname, 'assets/images/policy/policy-anticorruption.svg'), antiCorruptionSvg);

console.log('SVGs created successfully.');
