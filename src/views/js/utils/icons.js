// Custom SVG Icons matching CubCare Pediatric Medical Theme
export const Icons = {
  // CubCare Brand Bear Face Logo
  logo: `
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-brand-bear">
      <circle cx="24" cy="28" r="16" fill="#00897B"/>
      <circle cx="24" cy="28" r="9" fill="#80CBC4"/>
      <circle cx="76" cy="28" r="16" fill="#00897B"/>
      <circle cx="76" cy="28" r="9" fill="#80CBC4"/>
      <circle cx="50" cy="55" r="38" fill="#00897B"/>
      <ellipse cx="50" cy="62" rx="22" ry="17" fill="#E0F2F1"/>
      <!-- Eyes -->
      <circle cx="37" cy="48" r="4.5" fill="#0F3460"/>
      <circle cx="38.5" cy="46.5" r="1.5" fill="#FFFFFF"/>
      <circle cx="63" cy="48" r="4.5" fill="#0F3460"/>
      <circle cx="64.5" cy="46.5" r="1.5" fill="#FFFFFF"/>
      <!-- Nose & Mouth -->
      <path d="M46 56C46 54.5 54 54.5 54 56C54 58.5 50 60 46 56Z" fill="#0F3460"/>
      <path d="M50 59V64M46 64C47.5 66 52.5 66 54 64" stroke="#0F3460" stroke-width="2.5" stroke-linecap="round"/>
      <!-- Rosy Cheeks -->
      <circle cx="28" cy="56" r="5" fill="#FF8A80" fill-opacity="0.6"/>
      <circle cx="72" cy="56" r="5" fill="#FF8A80" fill-opacity="0.6"/>
    </svg>
  `,

  // Hero Stethoscope forming a heart on the left
  stethoscopeArt: `
    <svg viewBox="0 0 380 480" fill="none" xmlns="http://www.w3.org/2000/svg" class="stethoscope-svg">
      <!-- Decorative background soft circles and dots -->
      <circle cx="110" cy="85" r="42" fill="#E3F2FD" fill-opacity="0.6"/>
      <circle cx="270" cy="85" r="42" fill="#E3F2FD" fill-opacity="0.6"/>
      <circle cx="190" cy="345" r="60" fill="#E8F5E9" fill-opacity="0.5"/>
      <circle cx="60" cy="330" r="16" fill="#81D4FA" fill-opacity="0.4"/>
      <circle cx="325" cy="330" r="20" fill="#A5D6A7" fill-opacity="0.4"/>
      <circle cx="320" cy="180" r="12" fill="#80CBC4" fill-opacity="0.4"/>
      
      <!-- Stethoscope Earpieces -->
      <ellipse cx="110" cy="65" rx="14" ry="12" fill="#1E88E5"/>
      <ellipse cx="270" cy="65" rx="14" ry="12" fill="#1E88E5"/>
      
      <!-- Stethoscope Metal Tubes -->
      <path d="M110 74 C110 140 180 180 180 200" stroke="#1E88E5" stroke-width="12" stroke-linecap="round"/>
      <path d="M270 74 C270 140 200 180 200 200" stroke="#1E88E5" stroke-width="12" stroke-linecap="round"/>
      
      <!-- Stethoscope Flexible Tubing forming a beautiful balanced Heart -->
      <path d="M190 195 C190 230, 320 250, 320 330 C320 395, 250 435, 190 465 C130 435, 60 395, 60 330 C60 250, 190 230, 190 195 Z" 
            stroke="#1976D2" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      
      <!-- Inner Green Heart Tubing Accent -->
      <path d="M190 240 C190 265, 280 280, 280 335 C280 380, 230 410, 190 430 C150 410, 100 380, 100 335 C100 280, 190 265, 190 240 Z" 
            stroke="#2E7D32" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" fill="none"/>

      <!-- Stethoscope Chest Piece / Diaphragm -->
      <circle cx="320" cy="330" r="30" fill="#E3F2FD" stroke="#1565C0" stroke-width="7"/>
      <circle cx="320" cy="330" r="18" fill="#1976D2"/>
      <circle cx="320" cy="330" r="9" fill="#E8F5E9"/>

      <!-- Little green heart inside the main heart -->
      <path d="M190 330 C178 315, 152 320, 152 338 C152 358, 190 378, 190 378 C190 378, 228 358, 228 338 C228 320, 202 315, 190 330 Z" 
            fill="#43A047"/>
    </svg>
  `,

  // Hero Right Child with Teddy Bear Illustration Art
  childTeddyArt: `
    <svg viewBox="0 0 400 380" fill="none" xmlns="http://www.w3.org/2000/svg" class="child-teddy-svg">
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#E1F5FE"/>
          <stop offset="100%" stop-color="#E8F5E9"/>
        </linearGradient>
      </defs>
      <!-- Soft Rounded Card Background -->
      <rect width="400" height="380" rx="36" fill="url(#skyGrad)"/>
      
      <!-- Sparkles / Decorative Doodles -->
      <path d="M340 50L343 60L353 63L343 66L340 76L337 66L327 63L337 60Z" fill="#FDD835"/>
      <path d="M60 40L62 48L70 50L62 52L60 60L58 52L50 50L58 48Z" fill="#43A047"/>
      
      <!-- Child Silhouette & Warm Teddy Hug -->
      <!-- Child Head -->
      <circle cx="170" cy="130" r="55" fill="#FFE0B2"/>
      <!-- Hair -->
      <path d="M120 130C115 85 155 70 170 70C190 70 230 85 220 130C205 95 190 90 170 90C145 90 135 105 120 130Z" fill="#8D6E63"/>
      <!-- Happy Smiling Face -->
      <ellipse cx="150" cy="132" rx="4" ry="5" fill="#37474F"/>
      <ellipse cx="185" cy="132" rx="4" ry="5" fill="#37474F"/>
      <path d="M158 148C162 155 174 155 178 148" stroke="#E57373" stroke-width="3" stroke-linecap="round"/>
      <circle cx="140" cy="142" r="7" fill="#FFAB91" fill-opacity="0.7"/>
      <circle cx="195" cy="142" r="7" fill="#FFAB91" fill-opacity="0.7"/>
      <!-- Child Sweater (Blue) -->
      <path d="M120 185C110 240 90 320 90 380H260C260 320 240 240 220 185Z" fill="#42A5F5"/>
      
      <!-- Teddy Bear Hugged on the Right -->
      <!-- Teddy Body -->
      <ellipse cx="255" cy="270" rx="65" ry="60" fill="#BCAAA4"/>
      <!-- Teddy Head -->
      <circle cx="260" cy="190" r="50" fill="#BCAAA4"/>
      <!-- Teddy Ears -->
      <circle cx="225" cy="150" r="16" fill="#A1887F"/>
      <circle cx="225" cy="150" r="9" fill="#D7CCC8"/>
      <circle cx="295" cy="150" r="16" fill="#A1887F"/>
      <circle cx="295" cy="150" r="9" fill="#D7CCC8"/>
      <!-- Teddy Snout -->
      <ellipse cx="260" cy="205" rx="20" ry="15" fill="#EFEBE9"/>
      <ellipse cx="260" cy="198" rx="7" ry="5" fill="#4E342E"/>
      <path d="M260 203V212M254 212C257 215 263 215 266 212" stroke="#4E342E" stroke-width="2.5" stroke-linecap="round"/>
      <!-- Teddy Eyes -->
      <circle cx="245" cy="185" r="4" fill="#3E2723"/>
      <circle cx="275" cy="185" r="4" fill="#3E2723"/>
      <!-- Teddy Paws Hugging -->
      <ellipse cx="190" cy="250" rx="26" ry="18" fill="#A1887F" transform="rotate(-20 190 250)"/>
    </svg>
  `,

  shield: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  `,

  heart: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  `,

  people: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  `,

  leaf: `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
    </svg>
  `,

  lightbulb: `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9 18h6"/>
      <path d="M10 22h4"/>
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.76.76 1.23 1.52 1.41 2.5"/>
    </svg>
  `,

  google: `
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"/>
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z"/>
      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"/>
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"/>
    </svg>
  `,

  send: `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/>
      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  `,

  paperclip: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
    </svg>
  `,

  plus: `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  `,

  trash: `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    </svg>
  `,

  edit: `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  `,

  arrowRight: `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  `,

  backArrow: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"/>
      <polyline points="12 19 5 12 12 5"/>
    </svg>
  `,

  close: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  `,

  check: `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  `,

  user: `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  `,

  logout: `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  `,

  eye: `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  `,

  eyeOff: `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  `,

  mic: `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
      <line x1="12" y1="19" x2="12" y2="23"/>
      <line x1="8" y1="23" x2="16" y2="23"/>
    </svg>
  `,

  stop: `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <rect x="5" y="5" width="14" height="14" rx="2"/>
    </svg>
  `
};
