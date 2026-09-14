/**
 * CubCare — Pediatric AI Health Assistant Frontend
 * Unified Application Bundle for Zero-Config, Cross-Platform Compatibility
 */
(function () {
  'use strict';

  // ==========================================
  // 1. ICONS & ART
  // ==========================================
  const Icons = {
    logo: `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-brand-bear" style="width:100%;height:100%;">
        <circle cx="24" cy="28" r="16" fill="#00897B"/>
        <circle cx="24" cy="28" r="9" fill="#80CBC4"/>
        <circle cx="76" cy="28" r="16" fill="#00897B"/>
        <circle cx="76" cy="28" r="9" fill="#80CBC4"/>
        <circle cx="50" cy="55" r="38" fill="#00897B"/>
        <ellipse cx="50" cy="62" rx="22" ry="17" fill="#E0F2F1"/>
        <circle cx="37" cy="48" r="4.5" fill="#0F3460"/>
        <circle cx="38.5" cy="46.5" r="1.5" fill="#FFFFFF"/>
        <circle cx="63" cy="48" r="4.5" fill="#0F3460"/>
        <circle cx="64.5" cy="46.5" r="1.5" fill="#FFFFFF"/>
        <path d="M46 56C46 54.5 54 54.5 54 56C54 58.5 50 60 46 56Z" fill="#0F3460"/>
        <path d="M50 59V64M46 64C47.5 66 52.5 66 54 64" stroke="#0F3460" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="28" cy="56" r="5" fill="#FF8A80" fill-opacity="0.6"/>
        <circle cx="72" cy="56" r="5" fill="#FF8A80" fill-opacity="0.6"/>
      </svg>
    `,

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

    childTeddyArt: `
      <svg viewBox="0 0 400 380" fill="none" xmlns="http://www.w3.org/2000/svg" class="child-teddy-svg" style="width:100%;height:100%;">
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#E1F5FE"/>
            <stop offset="100%" stop-color="#E8F5E9"/>
          </linearGradient>
        </defs>
        <rect width="400" height="380" rx="36" fill="url(#skyGrad)"/>
        <path d="M340 50L343 60L353 63L343 66L340 76L337 66L327 63L337 60Z" fill="#FDD835"/>
        <path d="M60 40L62 48L70 50L62 52L60 60L58 52L50 50L58 48Z" fill="#43A047"/>
        
        <circle cx="170" cy="130" r="55" fill="#FFE0B2"/>
        <path d="M120 130C115 85 155 70 170 70C190 70 230 85 220 130C205 95 190 90 170 90C145 90 135 105 120 130Z" fill="#8D6E63"/>
        <ellipse cx="150" cy="132" rx="4" ry="5" fill="#37474F"/>
        <ellipse cx="185" cy="132" rx="4" ry="5" fill="#37474F"/>
        <path d="M158 148C162 155 174 155 178 148" stroke="#E57373" stroke-width="3" stroke-linecap="round"/>
        <circle cx="140" cy="142" r="7" fill="#FFAB91" fill-opacity="0.7"/>
        <circle cx="195" cy="142" r="7" fill="#FFAB91" fill-opacity="0.7"/>
        <path d="M120 185C110 240 90 320 90 380H260C260 320 240 240 220 185Z" fill="#42A5F5"/>
        
        <ellipse cx="255" cy="270" rx="65" ry="60" fill="#BCAAA4"/>
        <circle cx="260" cy="190" r="50" fill="#BCAAA4"/>
        <circle cx="225" cy="150" r="16" fill="#A1887F"/>
        <circle cx="225" cy="150" r="9" fill="#D7CCC8"/>
        <circle cx="295" cy="150" r="16" fill="#A1887F"/>
        <circle cx="295" cy="150" r="9" fill="#D7CCC8"/>
        <ellipse cx="260" cy="205" rx="20" ry="15" fill="#EFEBE9"/>
        <ellipse cx="260" cy="198" rx="7" ry="5" fill="#4E342E"/>
        <path d="M260 203V212M254 212C257 215 263 215 266 212" stroke="#4E342E" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="245" cy="185" r="4" fill="#3E2723"/>
        <circle cx="275" cy="185" r="4" fill="#3E2723"/>
        <ellipse cx="190" cy="250" rx="26" ry="18" fill="#A1887F" transform="rotate(-20 190 250)"/>
      </svg>
    `,

    shield: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    heart: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
    people: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    leaf: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`,
    lightbulb: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.76.76 1.23 1.52 1.41 2.5"/></svg>`,
    google: `<svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z"/><path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"/></svg>`,
    send: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
    paperclip: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>`,
    plus: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
    trash: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
    edit: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
    arrowRight: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
    backArrow: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>`,
    close: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    check: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    user: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    logout: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
    eye: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
    eyeOff: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`,
    mic: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>`,
    stop: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="5" width="14" height="14" rx="2"/></svg>`
  };

  // ==========================================
  // 2. STORAGE UTILITIES
  // ==========================================
  const TOKEN_KEY = 'cubcare_access_token';
  const USER_KEY = 'cubcare_user_data';
  const PROJECTS_KEY = 'cubcare_projects_cache';

  const Storage = {
    getToken() { return localStorage.getItem(TOKEN_KEY); },
    setToken(t) { t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY); },
    getUser() {
      try { const d = localStorage.getItem(USER_KEY); return d ? JSON.parse(d) : null; } catch { return null; }
    },
    setUser(u) { u ? localStorage.setItem(USER_KEY, JSON.stringify(u)) : localStorage.removeItem(USER_KEY); },
    getProjects() {
      try {
        const d = localStorage.getItem(PROJECTS_KEY);
        const list = d ? JSON.parse(d) : [];
        return list.filter(x => x && x.project_name && x.project_name !== 'pediatric_general');
      } catch {
        return [];
      }
    },
    saveProject(p) {
      const list = this.getProjects().filter(x => x.project_name !== p.project_name);
      list.unshift(p);
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(list));
    },
    saveProjects(projects) {
      if (Array.isArray(projects)) {
        localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
      }
    },
    removeProject(name) {
      const list = this.getProjects().filter(x => x.project_name !== name);
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(list));
    },
    updateProjectTitle(name, title) {
      const list = this.getProjects().map(x => x.project_name === name ? { ...x, title } : x);
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(list));
    },
    getProjectFiles(projectName) {
      try {
        const d = localStorage.getItem(`cubcare_files_${projectName}`);
        return d ? JSON.parse(d) : [];
      } catch {
        return [];
      }
    },
    saveProjectFile(projectName, fileInfo) {
      const list = this.getProjectFiles(projectName).filter(x => x.name !== fileInfo.name);
      list.unshift(fileInfo);
      localStorage.setItem(`cubcare_files_${projectName}`, JSON.stringify(list));
    },
    clearAuth() {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  };

  // ==========================================
  // 3. STATE MANAGEMENT
  // ==========================================
  class State {
    constructor() {
      this.token = Storage.getToken();
      this.user = Storage.getUser();
      this.activeProject = null;
      this.listeners = [];
    }
    isAuthenticated() { return !!this.token; }
    setAuth(token, user) {
      this.token = token;
      this.user = user;
      Storage.setToken(token);
      Storage.setUser(user);
      this.notify();
    }
    clearAuth() {
      this.token = null;
      this.user = null;
      this.activeProject = null;
      Storage.clearAuth();
      this.notify();
    }
    setActiveProject(p) { this.activeProject = p; this.notify(); }
    subscribe(l) { this.listeners.push(l); return () => this.listeners = this.listeners.filter(x => x !== l); }
    notify() { this.listeners.forEach(l => { try { l(this); } catch(e) { console.error(e); } }); }
  }

  const AppState = new State();

  // ==========================================
  // 4. HELPERS & VALIDATORS
  // ==========================================
  const Helpers = {
    escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    },
    renderMarkdown(text) {
      if (!text) return '';
      let parsed = this.escapeHtml(text);
      parsed = parsed.replace(/```([\s\S]*?)```/g, '<pre class="code-block"><code>$1</code></pre>');
      parsed = parsed.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
      parsed = parsed.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      parsed = parsed.replace(/\*([^*]+)\*/g, '<em>$1</em>');
      parsed = parsed.replace(/^\s*[-*]\s+(.+)$/gm, '<li>$1</li>');
      parsed = parsed.replace(/(<li>[\s\S]*?<\/li>)/g, '<ul class="chat-bullet-list">$1</ul>');
      parsed = parsed.replace(/^\s*(\d+)\.\s+(.+)$/gm, '<li value="$1">$2</li>');
      parsed = parsed.replace(/\n/g, '<br>');
      return parsed;
    }
  };

  const Validators = {
    isValidEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(e).toLowerCase()); },
    isValidPassword(p) { return typeof p === 'string' && p.length >= 6; },
    isValidUsername(u) { return typeof u === 'string' && u.trim().length >= 3; },
    isValidProjectName(n) { return /^[a-zA-Z0-9_-]{3,50}$/.test(String(n).trim()); }
  };

  // ==========================================
  // 5. TOAST & MODAL SYSTEM
  // ==========================================
  class ToastManager {
    init() {
      if (!document.getElementById('toast-container')) {
        this.container = document.createElement('div');
        this.container.id = 'toast-container';
        document.body.appendChild(this.container);
      } else {
        this.container = document.getElementById('toast-container');
      }
    }
    show(message, type = 'info', duration = 4000) {
      this.init();
      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      let icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ️';
      toast.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;">
          <span style="font-weight:800;">${icon}</span>
          <span>${message}</span>
        </div>
        <span class="toast-close">&times;</span>
      `;
      toast.querySelector('.toast-close').addEventListener('click', () => toast.remove());
      this.container.appendChild(toast);
      if (duration > 0) {
        setTimeout(() => {
          if (toast.parentElement) {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(50px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
          }
        }, duration);
      }
    }
    success(m, d) { this.show(m, 'success', d); }
    error(m, d) { this.show(m, 'error', d); }
    info(m, d) { this.show(m, 'info', d); }
  }
  const Toast = new ToastManager();

  const Modal = {
    createModal(id, title, bodyHtml, footerHtml) {
      const existing = document.getElementById(id);
      if (existing) existing.remove();
      const overlay = document.createElement('div');
      overlay.id = id;
      overlay.className = 'modal-overlay';
      overlay.innerHTML = `
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">${title}</h3>
            <button class="modal-close-btn" data-close>&times;</button>
          </div>
          <div class="modal-body">${bodyHtml}</div>
          <div class="modal-footer" style="margin-top:24px;display:flex;justify-content:flex-end;gap:12px;">${footerHtml}</div>
        </div>
      `;
      document.body.appendChild(overlay);
      const close = () => {
        overlay.classList.remove('is-active');
        setTimeout(() => overlay.remove(), 250);
      };
      overlay.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', close));
      overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
      setTimeout(() => overlay.classList.add('is-active'), 10);
      return { overlay, close };
    }
  };

  // ==========================================
  // 6. API CLIENT
  // ==========================================
  function getBaseUrl() {
    if (typeof window === 'undefined' || window.location.protocol === 'file:') return 'http://localhost:5000';
    if (window.location.port !== '5000') {
      const host = window.location.hostname || 'localhost';
      return `http://${host}:5000`;
    }
    return '';
  }
  const API_BASE = getBaseUrl();

  async function request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const headers = options.headers || {};
    const token = Storage.getToken();
    if (token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    let body = options.body;
    if (body && typeof body === 'object' && !(body instanceof FormData) && !(body instanceof URLSearchParams)) {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(body);
    }
    const res = await fetch(url, { ...options, headers, body });
    if (res.status === 204) return { success: true };
    const contentType = res.headers.get('content-type') || '';
    const data = contentType.includes('application/json') ? await res.json() : await res.text();
    if (!res.ok) {
      const msg = (data && data.detail) || (typeof data === 'string' ? data : 'Request failed');
      const err = new Error(msg);
      err.status = res.status;
      throw err;
    }
    return data;
  }

  const AuthApi = {
    async login(username, password) {
      const params = new URLSearchParams();
      params.append('username', username);
      params.append('password', password);
      return await request('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params
      });
    },
    async register(username, email, password) {
      return await request('/api/v1/auth/register', {
        method: 'POST',
        body: { username, email, password }
      });
    },
    getGoogleLoginUrl() { return `${API_BASE}/api/v1/auth/google/login`; }
  };

  const UserApi = {
    async updateProfile(username, email) {
      return await request('/api/v1/user/', { method: 'PUT', body: { username, email } });
    },
    async deleteAccount() {
      return await request('/api/v1/user/', { method: 'DELETE' });
    }
  };

  const ProjectApi = {
    async getAllProjects(page = 1, limit = 10) {
      return await request(`/api/v1/project/all?page=${page}&limit=${limit}`, { method: 'GET' });
    },
    async getProjectAssets(name) {
      return await request(`/api/v1/data/assets/${encodeURIComponent(name)}`, { method: 'GET' });
    },
    async createProject(name, title) {
      return await request(`/api/v1/data/create/${encodeURIComponent(name)}`, { method: 'POST', body: { title } });
    },
    async uploadFile(name, file) {
      const fd = new FormData();
      fd.append('file', file);
      return await request(`/api/v1/data/upload/${encodeURIComponent(name)}`, { method: 'POST', body: fd });
    },
    async updateChatTitle(name, title) {
      return await request(`/api/v1/data/update/title/${encodeURIComponent(name)}`, { method: 'POST', body: { title } });
    },
    async deleteProject(name) {
      return await request(`/api/v1/data/delete/${encodeURIComponent(name)}`, { method: 'DELETE' });
    },
    async processFile(name, fileName, chunkSize = 1000, overlapSize = 100, doReset = 0) {
      return await request(`/api/v1/data/process/${encodeURIComponent(name)}`, {
        method: 'POST',
        body: { file_name: fileName, chunk_size: chunkSize, overlap_size: overlapSize, do_reset: doReset }
      });
    }
  };

  const MessageApi = {
    async getAllMessages(projectName, page = 1, limit = 20) {
      return await request(`/api/v1/message/all/${encodeURIComponent(projectName)}?page=${page}&limit=${limit}`, { method: 'GET' });
    }
  };

  const NlpApi = {
    async pushToVectorDb(name, doReset = 0) {
      return await request(`/api/v1/nlp/index/push/${encodeURIComponent(name)}`, { method: 'POST', body: { do_reset: doReset } });
    },
    async getProjectInfo(name) {
      return await request(`/api/v1/nlp/index/info/${encodeURIComponent(name)}`, { method: 'GET' });
    },
    async answerQuestionStream(projectName, text, limit = 3, onChunk, onDone, onError, signal) {
      const url = `${API_BASE}/api/v1/nlp/index/answer/stream/${encodeURIComponent(projectName)}`;
      const token = Storage.getToken();
      const headers = { 'Content-Type': 'application/json', 'Accept': 'text/event-stream' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify({ text, limit }),
          signal
        });

        if (!response.ok) {
          let msg = 'Failed to stream response';
          try { const d = await response.json(); msg = d.detail || msg; } catch { msg = await response.text(); }
          throw new Error(msg);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';
        let fullAnswer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith('data:')) continue;
            const payload = trimmed.replace(/^data:\s*/, '').trim();

            if (payload === '[DONE]') {
              if (onDone) onDone(fullAnswer);
              return;
            }
            try {
              const parsed = JSON.parse(payload);
              if (parsed.error && onError) { onError(new Error(parsed.error)); return; }
              if (parsed.text !== undefined) {
                fullAnswer += parsed.text;
                if (onChunk) onChunk(parsed.text, fullAnswer);
              }
            } catch {
              fullAnswer += payload;
              if (onChunk) onChunk(payload, fullAnswer);
            }
          }
        }
        if (onDone) onDone(fullAnswer);
      } catch (err) {
        if (err.name !== 'AbortError' && onError) onError(err);
      }
    },
    async answerVoiceStream(projectName, audioBlob, onChunk, onDone, onError, signal) {
      const url = `${API_BASE}/api/v1/nlp/index/voice/answer/stream/${encodeURIComponent(projectName)}`;
      const token = Storage.getToken();
      const headers = { 'Accept': 'text/event-stream' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const formData = new FormData();
      formData.append('user_voice', audioBlob, 'recording.wav');

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers,
          body: formData,
          signal
        });

        if (!response.ok) {
          let msg = 'Failed to stream voice response';
          try { const d = await response.json(); msg = d.detail || msg; } catch { msg = await response.text(); }
          throw new Error(msg);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';
        let fullAnswer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith('data:')) continue;
            const payload = trimmed.replace(/^data:\s*/, '').trim();

            if (payload === '[DONE]') {
              if (onDone) onDone(fullAnswer);
              return;
            }
            try {
              const parsed = JSON.parse(payload);
              if (parsed.error && onError) { onError(new Error(parsed.error)); return; }
              if (parsed.text !== undefined) {
                fullAnswer += parsed.text;
                if (onChunk) onChunk(parsed.text, fullAnswer);
              }
            } catch {
              fullAnswer += payload;
              if (onChunk) onChunk(payload, fullAnswer);
            }
          }
        }
        if (onDone) onDone(fullAnswer);
      } catch (err) {
        if (err.name !== 'AbortError' && onError) onError(err);
      }
    }
  };

  // ==========================================
  // 7. UI PAGES & COMPONENTS
  // ==========================================
  function renderNavbar(currentPath, navigate) {
    const isAuth = AppState.isAuthenticated();
    const user = AppState.user;
    const username = user?.username || 'Parent';
    const initial = username.charAt(0).toUpperCase();

    return `
      <header class="navbar">
        <div class="container nav-container">
          <a class="brand" data-nav="/">
            <div class="brand-icon">${Icons.logo}</div>
            <div class="brand-text-wrap">
              <span class="brand-name">CubCare</span>
              <span class="brand-tagline">Little Steps • Healthier Tomorrows</span>
            </div>
          </a>

          <ul class="nav-links" id="nav-links-menu">
            <li><a class="nav-link ${currentPath === '/' ? 'active' : ''}" data-nav="/">Home</a></li>
            <li><a class="nav-link ${currentPath === '/about' ? 'active' : ''}" data-nav="/about">About</a></li>
            <li><a class="nav-link ${currentPath === '/contact' ? 'active' : ''}" data-nav="/contact">Contact</a></li>
            ${isAuth ? `<li><a class="nav-link ${currentPath === '/dashboard' || currentPath.startsWith('/chat') ? 'active' : ''}" data-nav="/dashboard">AI Model</a></li>` : ''}
          </ul>

          <div class="nav-actions">
            ${!isAuth ? `
              <button class="btn btn-outline" data-nav="/login">
                ${Icons.user} <span>Login</span>
              </button>
              <button class="btn btn-primary" data-nav="/register">
                ${Icons.plus} <span>Register</span>
              </button>
            ` : `
              <div class="user-profile-badge" data-nav="/profile">
                <div class="user-avatar-circle">${initial}</div>
                <span>${username}</span>
              </div>
            `}
          </div>
        </div>
      </header>
    `;
  }

  function renderFooter(navigate) {
    return `
      <footer style="background:#ffffff;border-top:1px solid var(--border-light);padding:40px 0 30px;margin-top:auto;">
        <div class="container" style="display:flex;flex-direction:column;gap:24px;">
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:20px;">
            <div style="display:flex;align-items:center;gap:10px;">
              <div style="width:32px;height:32px;">${Icons.logo}</div>
              <span style="font-weight:800;font-size:1.2rem;color:#0f3460;">CubCare</span>
              <span style="color:var(--text-light);font-size:0.9rem;">— Pediatric AI Assistant</span>
            </div>
            <div style="display:flex;gap:24px;font-size:0.9rem;font-weight:600;">
              <a data-nav="/" style="cursor:pointer;">Home</a>
              <a data-nav="/about" style="cursor:pointer;">About</a>
              <a data-nav="/contact" style="cursor:pointer;">Contact</a>
            </div>
          </div>
          <div style="border-top:1px solid #f1f5f9;padding-top:20px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;font-size:0.85rem;color:var(--text-muted);">
            <div>&copy; ${new Date().getFullYear()} CubCare. Caring today for brighter tomorrows ♡</div>
            <div>Educational AI tool • Not a substitute for emergency medical care</div>
          </div>
        </div>
      </footer>
    `;
  }

  function renderHomePage(navigate) {
    const isAuth = AppState.isAuthenticated();
    const container = document.createElement('div');
    container.innerHTML = `
      <section class="hero-section">
        <div class="container">
          <div class="hero-grid">
            <div class="hero-left">
              <div class="stethoscope-container">
                ${Icons.stethoscopeArt}
                <div class="quote-bubble-left">Small<br>Checkups,<br>Brighter<br>Tomorrows ♡</div>
              </div>
            </div>

            <div class="hero-center">
              <div class="tag-pill">AI-Powered Pediatric Care</div>
              <h1 class="hero-title">
                <span class="hero-title-blue">Healthier Kids,</span>
                <span class="hero-title-green">Happier Tomorrows</span>
              </h1>
              <p class="hero-description">
                CubCare uses advanced AI to support parents with reliable, easy-to-understand health guidance for their children — because every child deserves the best care.
              </p>
              <div class="hero-features-row">
                <div class="feature-pill">
                  <div class="feature-icon-circle blue">${Icons.shield}</div>
                  <span class="feature-pill-title">Trusted<br>Information</span>
                </div>
                <div class="feature-pill">
                  <div class="feature-icon-circle blue">${Icons.heart}</div>
                  <span class="feature-pill-title">Child-Focused<br>Guidance</span>
                </div>
                <div class="feature-pill">
                  <div class="feature-icon-circle green">${Icons.people}</div>
                  <span class="feature-pill-title">Support<br>for Every Parent</span>
                </div>
              </div>

              <div class="hero-cta-wrapper">
                <button class="btn btn-hero" id="hero-try-btn">
                  <span>Try Model</span> ${Icons.arrowRight}
                </button>
                <div class="hero-note">
                  <span>↳</span> <span>See how AI can support your child's health!</span>
                </div>
              </div>
            </div>

            <div class="hero-right">
              <div class="child-visual-wrapper">
                <div class="floating-top-quote">Healthy Children,<br>Stronger Futures ♡</div>
                <div class="child-image-card">${Icons.childTeddyArt}</div>
                <div class="floating-card-quote">Because they deserve a healthier, brighter tomorrow ♡</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="why-section">
        <div class="container">
          <div class="why-header">
            <div class="why-eyebrow">WHY CUBCARE?</div>
            <h2 class="why-title">More Than Answers — A Healthier Childhood</h2>
            <p class="why-subtitle">CubCare combines the power of AI with trusted pediatric knowledge to help parents make informed decisions with confidence.</p>
          </div>

          <div class="why-grid">
            <div class="why-card">
              <div class="why-icon-box mint">${Icons.leaf}</div>
              <h3 class="why-card-title">Reliable Health Guidance</h3>
              <p class="why-card-desc">Evidence-based information and pediatric guidelines you can trust for peace of mind.</p>
            </div>
            <div class="why-card">
              <div class="why-icon-box green">${Icons.people}</div>
              <h3 class="why-card-title">Built for Parents</h3>
              <p class="why-card-desc">Simple, clear, and supportive advice without confusing medical jargon.</p>
            </div>
            <div class="why-card">
              <div class="why-icon-box teal">${Icons.heart}</div>
              <h3 class="why-card-title">Focus on Child Wellbeing</h3>
              <p class="why-card-desc">From common symptom questions to nutrition milestones and sleep habits.</p>
            </div>
            <div class="why-card">
              <div class="why-icon-box blue">${Icons.lightbulb}</div>
              <h3 class="why-card-title">Powered by AI</h3>
              <p class="why-card-desc">Smart technology fetching your medical records for personalized context.</p>
            </div>
          </div>

          <div class="bottom-caring-banner">Caring Today for Brighter Tomorrows ♡</div>
        </div>
      </section>
    `;

    container.querySelector('#hero-try-btn').addEventListener('click', () => {
      navigate(isAuth ? '/dashboard' : '/login');
    });

    return container;
  }

  function renderLoginPage(navigate) {
    const container = document.createElement('div');
    container.className = 'auth-page';
    container.innerHTML = `
      <div class="auth-card">
        <div class="auth-header">
          <div class="auth-logo-wrap"><div style="width:54px;height:54px;">${Icons.logo}</div></div>
          <h1 class="auth-title">Welcome Back</h1>
          <p class="auth-subtitle">Sign in to access your child's health assistant</p>
        </div>
        <div id="auth-alert"></div>
        <button type="button" class="btn btn-google" id="google-btn">${Icons.google} <span>Sign in with Google</span></button>
        <div class="auth-divider"><span>or sign in with email</span></div>
        <form id="login-form">
          <div class="form-group">
            <label class="form-label">Email or Username</label>
            <input type="text" id="login-email" class="form-input" placeholder="parent@example.com" required />
          </div>
          <div class="form-group">
            <label class="form-label">Password</label>
            <div class="password-input-wrap">
              <input type="password" id="login-pwd" class="form-input" placeholder="••••••••" required />
              <button type="button" class="password-toggle-btn" id="toggle-pwd">${Icons.eye}</button>
            </div>
          </div>
          <button type="submit" class="btn btn-primary" id="login-sub" style="width:100%;padding:12px;margin-top:8px;">
            <span>Sign In</span>
          </button>
        </form>
        <div class="auth-footer">Don't have an account? <a data-nav="/register">Create one here</a></div>
      </div>
    `;

    const pwd = container.querySelector('#login-pwd');
    const toggle = container.querySelector('#toggle-pwd');
    toggle.addEventListener('click', () => {
      const isP = pwd.type === 'password';
      pwd.type = isP ? 'text' : 'password';
      toggle.innerHTML = isP ? Icons.eyeOff : Icons.eye;
    });

    container.querySelector('#google-btn').addEventListener('click', () => {
      window.location.href = AuthApi.getGoogleLoginUrl();
    });

    container.querySelector('#login-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = container.querySelector('#login-email').value.trim();
      const password = pwd.value;
      const alert = container.querySelector('#auth-alert');
      const sub = container.querySelector('#login-sub');
      alert.innerHTML = '';
      sub.disabled = true;
      sub.innerHTML = `<div class="spinner"></div> <span>Signing In...</span>`;

      try {
        const res = await AuthApi.login(email, password);
        const username = email.includes('@') ? email.split('@')[0] : email;
        AppState.setAuth(res.access_token, { username, email });
        Toast.success('Welcome back to CubCare!');
        navigate('/');
      } catch (err) {
        alert.innerHTML = `<div class="alert alert-error">${err.message || 'Invalid credentials'}</div>`;
      } finally {
        sub.disabled = false;
        sub.innerHTML = `<span>Sign In</span>`;
      }
    });

    return container;
  }

  function renderRegisterPage(navigate) {
    const container = document.createElement('div');
    container.className = 'auth-page';
    container.innerHTML = `
      <div class="auth-card">
        <div class="auth-header">
          <div class="auth-logo-wrap"><div style="width:54px;height:54px;">${Icons.logo}</div></div>
          <h1 class="auth-title">Create Account</h1>
          <p class="auth-subtitle">Join CubCare to support your child's health journey</p>
        </div>
        <div id="reg-alert"></div>
        <button type="button" class="btn btn-google" id="reg-google-btn">${Icons.google} <span>Sign up with Google</span></button>
        <div class="auth-divider"><span>or register with email</span></div>
        <form id="reg-form">
          <div class="form-group">
            <label class="form-label">Username</label>
            <input type="text" id="reg-user" class="form-input" placeholder="sarah_parent" required />
          </div>
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input type="email" id="reg-email" class="form-input" placeholder="sarah@example.com" required />
          </div>
          <div class="form-group">
            <label class="form-label">Password</label>
            <input type="password" id="reg-pwd" class="form-input" placeholder="At least 6 characters" required />
          </div>
          <div class="form-group">
            <label class="form-label">Confirm Password</label>
            <input type="password" id="reg-cpwd" class="form-input" placeholder="Re-type password" required />
          </div>
          <button type="submit" class="btn btn-primary" id="reg-sub" style="width:100%;padding:12px;margin-top:8px;">
            <span>Create Account</span>
          </button>
        </form>
        <div class="auth-footer">Already have an account? <a data-nav="/login">Sign in</a></div>
      </div>
    `;

    container.querySelector('#reg-google-btn').addEventListener('click', () => {
      window.location.href = AuthApi.getGoogleLoginUrl();
    });

    container.querySelector('#reg-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = container.querySelector('#reg-user').value.trim();
      const email = container.querySelector('#reg-email').value.trim();
      const pwd = container.querySelector('#reg-pwd').value;
      const cpwd = container.querySelector('#reg-cpwd').value;
      const alert = container.querySelector('#reg-alert');
      const sub = container.querySelector('#reg-sub');
      alert.innerHTML = '';

      if (pwd !== cpwd) {
        alert.innerHTML = `<div class="alert alert-error">Passwords do not match.</div>`;
        return;
      }
      if (!Validators.isValidPassword(pwd)) {
        alert.innerHTML = `<div class="alert alert-error">Password must be at least 6 characters.</div>`;
        return;
      }

      sub.disabled = true;
      sub.innerHTML = `<div class="spinner"></div> <span>Creating Account...</span>`;

      try {
        await AuthApi.register(username, email, pwd);
        Toast.success('Account created! Please sign in.');
        navigate('/login');
      } catch (err) {
        alert.innerHTML = `<div class="alert alert-error">${err.message || 'Registration failed'}</div>`;
      } finally {
        sub.disabled = false;
        sub.innerHTML = `<span>Create Account</span>`;
      }
    });

    return container;
  }

  function renderAboutPage(navigate) {
    const container = document.createElement('div');
    container.className = 'content-page';
    container.innerHTML = `
      <div class="container container-narrow">
        <div class="content-header">
          <div class="badge badge-mint" style="margin-bottom:14px;">ABOUT CUBCARE</div>
          <h1>Dedicated to Healthier, Happier Children</h1>
          <p>Empowering parents with accessible, reliable pediatric health guidance powered by AI.</p>
        </div>
        <div class="content-card-section">
          <h2>${Icons.heart} Our Mission</h2>
          <p>At CubCare, we believe every parent deserves quick, calm, and evidence-backed answers when caring for their children.</p>
        </div>
        <div class="content-card-section">
          <h2>${Icons.lightbulb} How CubCare AI Works</h2>
          <p>Upload your child's clinical summaries or immunization charts. When you ask a question, our AI retrieves the exact relevant excerpts and provides actionable explanations.</p>
        </div>
        <div class="disclaimer-banner">
          <div class="disclaimer-banner-icon">⚠️</div>
          <div class="disclaimer-banner-text">
            <h4>Important Medical Disclaimer</h4>
            <p>CubCare is designed as an educational tool and does not provide diagnoses or replace a licensed pediatrician.</p>
          </div>
        </div>
      </div>
    `;
    return container;
  }

  function renderContactPage(navigate) {
    const container = document.createElement('div');
    container.className = 'content-page';
    container.innerHTML = `
      <div class="container">
        <div class="content-header">
          <div class="badge badge-mint" style="margin-bottom:14px;">GET IN TOUCH</div>
          <h1>We're Here for You</h1>
          <p>Have questions about CubCare? Reach out to our team.</p>
        </div>
        <div class="contact-grid">
          <div class="contact-info-card">
            <h3 style="font-size:1.4rem;font-weight:800;color:#0f3460;">Contact Information</h3>
            <div class="contact-method-item">
              <div class="contact-method-icon">✉️</div>
              <div class="contact-method-text">
                <h4>Email Support</h4>
                <a href="mailto:childcare@cubcare.com">childcare@cubcare.com</a>
              </div>
            </div>
          </div>
          <div class="card" style="padding:36px;">
            <h3 style="font-size:1.4rem;font-weight:800;color:#0f3460;margin-bottom:20px;">Send Us a Message</h3>
            <form id="contact-form">
              <div class="form-group">
                <label class="form-label">Your Name</label>
                <input type="text" class="form-input" placeholder="Sarah Jenkins" required />
              </div>
              <div class="form-group">
                <label class="form-label">Email Address</label>
                <input type="email" class="form-input" placeholder="sarah@example.com" required />
              </div>
              <div class="form-group">
                <label class="form-label">Message</label>
                <textarea class="form-input" rows="4" placeholder="How can we help?" required></textarea>
              </div>
              <button type="submit" class="btn btn-primary" style="width:100%;padding:12px;">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    `;
    container.querySelector('#contact-form').addEventListener('submit', (e) => {
      e.preventDefault();
      Toast.success('Thank you! We will reply from childcare@cubcare.com soon.');
      e.target.reset();
    });
    return container;
  }

  function renderDashboardPage(navigate) {
    const container = document.createElement('div');
    container.className = 'dashboard-page';
    const user = AppState.user;
    const username = user?.username || 'Parent';

    container.innerHTML = `
      <div class="container">
        <div class="dashboard-header">
          <div class="dashboard-welcome">
            <h1>Hello, ${username} 👋</h1>
            <p>Manage your child's health assistant projects and pediatric records.</p>
          </div>
          <button class="btn btn-primary" id="btn-create-proj">${Icons.plus} <span>New Project</span></button>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon" style="background:#e3f2fd;color:#1565c0;">📁</div>
            <div class="stat-info"><h3 id="stat-count">0</h3><p>Active Projects</p></div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background:#e8f5e9;color:#2e7d32;">📄</div>
            <div class="stat-info"><h3>Upload Documents</h3><p>Add Child Health Files</p></div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background:#e0f2f1;color:#00897b;">🛡️</div>
            <div class="stat-info"><h3>Encrypted</h3><p>Secure Storage</p></div>
          </div>
        </div>

        <div class="projects-header-bar">
          <h2 class="projects-title">Your Health Projects</h2>
          <div id="pagination-info" style="font-size:0.9rem;font-weight:600;color:#64748b;"></div>
        </div>
        <div class="projects-grid" id="proj-grid"></div>
        <div id="proj-pagination" style="display:flex;justify-content:center;align-items:center;gap:12px;margin-top:28px;"></div>
      </div>
    `;

    const grid = container.querySelector('#proj-grid');
    const statCount = container.querySelector('#stat-count');
    const pagInfo = container.querySelector('#pagination-info');
    const pagContainer = container.querySelector('#proj-pagination');

    let currentPage = 1;
    const limit = 10;

    async function loadProjects(page = 1) {
      currentPage = page;
      grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;"><div class="spinner"></div><p style="color:#64748b;margin-top:10px;">Loading projects...</p></div>`;
      pagContainer.innerHTML = '';
      pagInfo.textContent = '';

      let projects = [];
      let totalPages = 1;
      let totalProjects = 0;

      try {
        const res = await ProjectApi.getAllProjects(currentPage, limit);
        projects = res.projects || [];
        totalPages = res.total_pages || 1;
        totalProjects = res.total_projects !== undefined ? res.total_projects : projects.length;
        Storage.saveProjects(projects);
      } catch (err) {
        console.warn('Backend get projects failed, falling back to cache:', err.message);
        projects = Storage.getProjects() || [];
        totalProjects = projects.length;
        totalPages = Math.ceil(totalProjects / limit) || 1;
      }

      statCount.textContent = totalProjects;
      grid.innerHTML = '';

      if (projects.length === 0) {
        grid.innerHTML = `
          <div class="empty-state">
            <div class="empty-icon">📂</div>
            <h3 style="font-size:1.25rem;font-weight:700;color:#0f3460;">No Projects Yet</h3>
            <p style="color:#64748b;max-width:400px;margin-bottom:8px;">
              Create your first project to begin asking pediatric questions and uploading child health records.
            </p>
            <button class="btn btn-primary" id="btn-empty-create">
              ${Icons.plus} <span>Create First Project</span>
            </button>
          </div>
        `;
        grid.querySelector('#btn-empty-create')?.addEventListener('click', () => {
          container.querySelector('#btn-create-proj').click();
        });
        return;
      }

      pagInfo.textContent = `Showing Page ${currentPage} of ${totalPages} (${totalProjects} total)`;

      projects.forEach(p => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
          <div>
            <div class="project-card-top">
              <span class="project-tag">Pediatric Assistant</span>
              <div class="project-actions-menu">
                <button class="project-action-btn edit-btn" title="Edit Title">${Icons.edit}</button>
                <button class="project-action-btn delete del-btn" title="Delete">${Icons.trash}</button>
              </div>
            </div>
            <h3 class="project-card-title">${p.title || p.project_name}</h3>
            <div class="project-card-slug">${p.project_name}</div>
          </div>
          <div class="project-card-footer">
            <button class="project-open-btn open-btn"><span>Open Consultation</span> ${Icons.arrowRight}</button>
          </div>
        `;

        card.querySelector('.open-btn').addEventListener('click', () => {
          AppState.setActiveProject(p);
          navigate(`/chat/${encodeURIComponent(p.project_name)}`);
        });

        card.querySelector('.edit-btn').addEventListener('click', () => {
          const bodyHtml = `
            <div class="form-group">
              <label class="form-label">New Title</label>
              <input type="text" id="edit-t" class="form-input" value="${p.title || p.project_name}" required />
            </div>
          `;
          const footerHtml = `<button class="btn btn-outline" data-close>Cancel</button><button class="btn btn-primary" id="save-t">Save</button>`;
          const { overlay, close } = Modal.createModal('edit-m', 'Edit Project Title', bodyHtml, footerHtml);
          overlay.querySelector('#save-t').addEventListener('click', async () => {
            const val = overlay.querySelector('#edit-t').value.trim();
            if (val) {
              try {
                await ProjectApi.updateChatTitle(p.project_name, val);
              } catch (e) {
                console.warn('Update title:', e.message);
              }
              Storage.updateProjectTitle(p.project_name, val);
              Toast.success('Title updated');
              close();
              loadProjects(currentPage);
            }
          });
        });

        card.querySelector('.del-btn').addEventListener('click', () => {
          const bodyHtml = `<p>Are you sure you want to delete <strong>${p.title || p.project_name}</strong>?</p>`;
          const footerHtml = `<button class="btn btn-outline" data-close>Cancel</button><button class="btn btn-danger" id="del-t">Delete</button>`;
          const { overlay, close } = Modal.createModal('del-m', 'Delete Project', bodyHtml, footerHtml);
          const delBtn = overlay.querySelector('#del-t');
          delBtn.addEventListener('click', async () => {
            delBtn.disabled = true;
            delBtn.innerHTML = `<div class="spinner"></div> <span>Deleting...</span>`;
            try {
              await ProjectApi.deleteProject(p.project_name);
            } catch (e) {
              console.warn('Backend delete response:', e.message);
            } finally {
              Storage.removeProject(p.project_name);
              Toast.success('Project deleted');
              close();
              loadProjects(currentPage);
            }
          });
        });

        grid.appendChild(card);
      });

      // Pagination controls
      if (totalPages > 1) {
        pagContainer.innerHTML = `
          <button class="btn btn-outline btn-sm" id="btn-prev-page" ${currentPage <= 1 ? 'disabled' : ''}>← Previous</button>
          <span style="font-weight:700;font-size:0.9rem;color:#0f3460;">Page ${currentPage} of ${totalPages}</span>
          <button class="btn btn-outline btn-sm" id="btn-next-page" ${currentPage >= totalPages ? 'disabled' : ''}>Next →</button>
        `;
        pagContainer.querySelector('#btn-prev-page')?.addEventListener('click', () => {
          if (currentPage > 1) loadProjects(currentPage - 1);
        });
        pagContainer.querySelector('#btn-next-page')?.addEventListener('click', () => {
          if (currentPage < totalPages) loadProjects(currentPage + 1);
        });
      }
    }

    container.querySelector('#btn-create-proj').addEventListener('click', () => {
      const bodyHtml = `
        <div id="m-err"></div>
        <div class="form-group">
          <label class="form-label">Project Slug (Identifier)</label>
          <input type="text" id="p-slug" class="form-input" placeholder="e.g. leo_fever_tracking" required />
        </div>
        <div class="form-group">
          <label class="form-label">Project Chat Title</label>
          <input type="text" id="p-title" class="form-input" placeholder="e.g. Leo's Fever & Cold Consultation" required />
        </div>
      `;
      const footerHtml = `<button class="btn btn-outline" data-close>Cancel</button><button class="btn btn-primary" id="create-t">Create Project</button>`;
      const { overlay, close } = Modal.createModal('create-m', 'New Project', bodyHtml, footerHtml);

      overlay.querySelector('#create-t').addEventListener('click', async () => {
        const slug = overlay.querySelector('#p-slug').value.trim().toLowerCase();
        const title = overlay.querySelector('#p-title').value.trim();
        const err = overlay.querySelector('#m-err');

        if (!Validators.isValidProjectName(slug)) {
          err.innerHTML = `<div class="alert alert-error">Project name must be 3-50 letters/numbers/hyphens.</div>`;
          return;
        }
        if (!title) {
          err.innerHTML = `<div class="alert alert-error">Please enter a title.</div>`;
          return;
        }

        try {
          await ProjectApi.createProject(slug, title);
          Storage.saveProject({ project_name: slug, title });
          Toast.success('Project created successfully!');
          close();
          loadProjects(1);
        } catch (e) {
          err.innerHTML = `<div class="alert alert-error">${e.message || 'Creation failed'}</div>`;
        }
      });
    });

    loadProjects(1);
    return container;
  }

  function renderChatPage(projectName, navigate) {
    const container = document.createElement('div');
    container.className = 'chat-page-layout';
    const projects = Storage.getProjects();
    const p = projects.find(x => x.project_name === projectName) || { project_name: projectName, title: projectName };
    const username = AppState.user?.username || 'Parent';
    const initial = username.charAt(0).toUpperCase();

    let messagePage = 1;
    let hasMoreMessages = false;
    let isLoadingMore = false;

    container.innerHTML = `
      <div class="chat-main-container">
        <button class="chat-sidebar-tab-btn" id="chat-sidebar-tab" title="Open records panel">
          ${Icons.paperclip} <span>Records</span>
        </button>

        <div class="chat-header">
          <div class="chat-header-left">
            <button class="chat-back-btn" id="chat-back" title="Back to Dashboard">${Icons.backArrow}</button>
            <div class="chat-title-wrap">
              <h2>${p.title || p.project_name}</h2>
              <div class="chat-project-name">Project: ${p.project_name}</div>
            </div>
          </div>
        </div>

        <div class="chat-messages-area" id="chat-list">
          <div id="load-more-indicator" style="display:none;text-align:center;padding:8px 0;">
            <span class="badge badge-sky" style="font-size:0.75rem;">Loading earlier messages...</span>
          </div>
          <div class="chat-message assistant" id="welcome-msg">
            <div class="message-avatar ai-avatar"><div style="width:24px;height:24px;">${Icons.logo}</div></div>
            <div class="message-bubble">
              <p style="font-weight:700;color:#0f3460;margin-bottom:6px;">Hello ${username}! I'm CubCare AI 🐾</p>
              <p>Ask any pediatric health, nutrition, or wellness question to get real-time AI guidance.</p>
            </div>
          </div>
        </div>

        <div class="chat-input-wrapper">
          <form id="chat-f">
            <div class="chat-input-box" id="chat-input-box">
              <textarea id="chat-in" class="chat-textarea" placeholder="Ask a pediatric health question..." rows="1" required></textarea>
              <button type="submit" class="chat-action-btn chat-send-btn" id="chat-sub" title="Send text message">${Icons.send}</button>
              <button type="button" class="chat-action-btn chat-mic-btn" id="chat-mic-btn" title="Record voice message">${Icons.mic}</button>
            </div>
            <div class="chat-recording-bar" id="chat-rec-bar" style="display:none;">
              <div class="recording-indicator-wrap">
                <span class="recording-pulse-dot"></span>
                <span class="recording-label">Recording Voice...</span>
                <span class="recording-timer" id="rec-timer">00:00</span>
                <div class="recording-waveform">
                  <span></span><span></span><span></span><span></span><span></span>
                </div>
              </div>
              <div class="recording-actions">
                <button type="button" class="chat-action-btn chat-cancel-rec-btn" id="rec-cancel-btn" title="Cancel recording">${Icons.trash}</button>
                <button type="button" class="chat-action-btn chat-send-rec-btn" id="rec-send-btn" title="Finish & Send voice">${Icons.send}</button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <aside class="chat-sidebar" id="c-sidebar">
        <div class="chat-sidebar-resizer" id="c-resizer" title="Drag to resize panel"></div>
        <div class="chat-sidebar-header">
          <h3 class="chat-sidebar-title">${Icons.leaf} <span>Child Records</span></h3>
          <button class="modal-close-btn" id="c-close-side" title="Close Panel">&times;</button>
        </div>
        <div class="chat-sidebar-content">
          <input type="file" id="f-in" style="display:none;" />
          <div class="upload-dropzone" id="d-zone">
            <div style="font-size:1.8rem;margin-bottom:4px;">📄</div>
            <div style="font-weight:700;color:#1565c0;font-size:0.95rem;">Upload Record File</div>
            <div style="font-size:0.8rem;color:#64748b;margin-top:2px;">PDF or TXT document</div>
          </div>
          <div id="u-status"></div>

          <div class="uploaded-files-section">
            <div class="uploaded-files-header">
              <span>Attached Documents</span>
              <span class="badge badge-sky" id="files-count">0</span>
            </div>
            <div class="uploaded-files-list" id="files-list"></div>
          </div>
        </div>
      </aside>
    `;

    container.querySelector('#chat-back').addEventListener('click', () => navigate('/dashboard'));
    const sidebar = container.querySelector('#c-sidebar');
    const tabBtn = container.querySelector('#chat-sidebar-tab');
    const closeSideBtn = container.querySelector('#c-close-side');
    const resizer = container.querySelector('#c-resizer');

    // Sidebar sliding & toggling
    function closeSidebar() {
      sidebar.classList.add('is-collapsed');
      sidebar.classList.remove('is-open');
      tabBtn.classList.add('is-visible');
    }

    function openSidebar() {
      sidebar.classList.remove('is-collapsed');
      sidebar.classList.add('is-open');
      tabBtn.classList.remove('is-visible');
    }

    closeSideBtn.addEventListener('click', closeSidebar);
    tabBtn.addEventListener('click', openSidebar);

    // Sidebar drag-to-resize
    let isResizing = false;
    resizer.addEventListener('mousedown', (e) => {
      isResizing = true;
      resizer.classList.add('is-resizing');
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
    });

    window.addEventListener('mousemove', (e) => {
      if (!isResizing) return;
      const containerRect = container.getBoundingClientRect();
      const newWidth = containerRect.right - e.clientX;
      if (newWidth >= 240 && newWidth <= 600) {
        sidebar.style.width = `${newWidth}px`;
      }
    });

    window.addEventListener('mouseup', () => {
      if (isResizing) {
        isResizing = false;
        resizer.classList.remove('is-resizing');
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    });

    // Upload & document list
    const fileIn = container.querySelector('#f-in');
    const dzone = container.querySelector('#d-zone');
    const uStatus = container.querySelector('#u-status');
    const filesList = container.querySelector('#files-list');
    const filesCount = container.querySelector('#files-count');

    async function renderFilesList() {
      let files = [];
      try {
        const res = await ProjectApi.getProjectAssets(projectName);
        if (res && res.assets && Array.isArray(res.assets)) {
          files = res.assets.map(a => ({
            name: a.asset_name,
            size: a.asset_size,
            uploadedAt: a.created_at ? new Date(a.created_at).toLocaleDateString() : 'Ready'
          }));
        }
      } catch (e) {
        console.warn('Fetch assets from DB fallback to cache:', e.message);
        files = Storage.getProjectFiles(projectName) || [];
      }

      filesCount.textContent = files.length;
      filesList.innerHTML = '';

      if (files.length === 0) {
        filesList.innerHTML = `<div style="color:#94a3b8;font-size:0.82rem;text-align:center;padding:12px;">No documents uploaded yet</div>`;
        return;
      }

      files.forEach(f => {
        const item = document.createElement('div');
        item.className = 'uploaded-file-card';
        item.innerHTML = `
          <div class="uploaded-file-icon">📄</div>
          <div class="uploaded-file-info">
            <div class="uploaded-file-name" title="${Helpers.escapeHtml(f.name)}">${Helpers.escapeHtml(f.name)}</div>
            <div class="uploaded-file-date">${f.uploadedAt || 'Ready for questions'}</div>
          </div>
          <div class="uploaded-file-status" title="Active">✓</div>
        `;
        filesList.appendChild(item);
      });
    }

    renderFilesList();
    dzone.addEventListener('click', () => fileIn.click());

    fileIn.addEventListener('change', async () => {
      const file = fileIn.files[0];
      if (!file) return;
      uStatus.innerHTML = `<div class="alert alert-info" style="font-size:0.85rem;padding:8px 12px;">Uploading ${file.name}...</div>`;
      try {
        const uRes = await ProjectApi.uploadFile(projectName, file);
        const fName = uRes.file_name || file.name;
        // Process single file using /api/v1/data/process/{project_name}
        await ProjectApi.processFile(projectName, fName);
        // Automatically push index to vector DB
        await NlpApi.pushToVectorDb(projectName);

        Toast.success('File uploaded successfully!');
        uStatus.innerHTML = `<div class="alert alert-success" style="font-size:0.85rem;padding:8px 12px;">✓ ${file.name} uploaded successfully!</div>`;

        Storage.saveProjectFile(projectName, {
          name: file.name,
          size: file.size,
          uploadedAt: new Date().toLocaleDateString()
        });
        renderFilesList();
      } catch (err) {
        uStatus.innerHTML = `<div class="alert alert-error" style="font-size:0.85rem;padding:8px 12px;">✕ Upload failed: ${err.message}</div>`;
      } finally {
        fileIn.value = '';
      }
    });

    const chatList = container.querySelector('#chat-list');
    const loadMoreIndicator = container.querySelector('#load-more-indicator');
    const welcomeMsg = container.querySelector('#welcome-msg');
    const chatInput = container.querySelector('#chat-in');
    const chatForm = container.querySelector('#chat-f');
    const chatSub = container.querySelector('#chat-sub');
    const micBtn = container.querySelector('#chat-mic-btn');
    const inputBox = container.querySelector('#chat-input-box');
    const recBar = container.querySelector('#chat-rec-bar');
    const recTimer = container.querySelector('#rec-timer');
    const cancelRecBtn = container.querySelector('#rec-cancel-btn');
    const sendRecBtn = container.querySelector('#rec-send-btn');

    // Voice recording state (16kHz Linear PCM WAV)
    let audioContext = null;
    let mediaStreamSource = null;
    let scriptProcessor = null;
    let pcmBuffers = [];
    let recordTimerInterval = null;
    let recordSeconds = 0;
    let streamInstance = null;

    function formatTimer(sec) {
      const m = Math.floor(sec / 60).toString().padStart(2, '0');
      const s = (sec % 60).toString().padStart(2, '0');
      return `${m}:${s}`;
    }

    function cleanupAudioNodes() {
      if (scriptProcessor) {
        scriptProcessor.onaudioprocess = null;
        try { scriptProcessor.disconnect(); } catch (e) {}
        scriptProcessor = null;
      }
      if (mediaStreamSource) {
        try { mediaStreamSource.disconnect(); } catch (e) {}
        mediaStreamSource = null;
      }
      if (audioContext && audioContext.state !== 'closed') {
        try { audioContext.close(); } catch (e) {}
        audioContext = null;
      }
      if (streamInstance) {
        streamInstance.getTracks().forEach(track => track.stop());
        streamInstance = null;
      }
      if (recordTimerInterval) {
        clearInterval(recordTimerInterval);
        recordTimerInterval = null;
      }
    }

    function encodeWavBlob(buffers, inputSampleRate, targetSampleRate = 16000) {
      let totalLength = 0;
      for (const b of buffers) totalLength += b.length;
      const merged = new Float32Array(totalLength);
      let offset = 0;
      for (const b of buffers) {
        merged.set(b, offset);
        offset += b.length;
      }

      let samples = merged;
      if (inputSampleRate !== targetSampleRate) {
        const ratio = inputSampleRate / targetSampleRate;
        const newLen = Math.round(merged.length / ratio);
        const downsampled = new Float32Array(newLen);
        for (let i = 0; i < newLen; i++) {
          const origIndex = Math.round(i * ratio);
          downsampled[i] = merged[Math.min(origIndex, merged.length - 1)];
        }
        samples = downsampled;
      }

      const wavBuffer = new ArrayBuffer(44 + samples.length * 2);
      const view = new DataView(wavBuffer);

      const writeStr = (v, off, str) => {
        for (let i = 0; i < str.length; i++) v.setUint8(off + i, str.charCodeAt(i));
      };

      writeStr(view, 0, 'RIFF');
      view.setUint32(4, 36 + samples.length * 2, true);
      writeStr(view, 8, 'WAVE');

      writeStr(view, 12, 'fmt ');
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true);
      view.setUint16(22, 1, true);
      view.setUint32(24, targetSampleRate, true);
      view.setUint32(28, targetSampleRate * 2, true);
      view.setUint16(32, 2, true);
      view.setUint16(34, 16, true);

      writeStr(view, 36, 'data');
      view.setUint32(40, samples.length * 2, true);

      let dataOffset = 44;
      for (let i = 0; i < samples.length; i++, dataOffset += 2) {
        const s = Math.max(-1, Math.min(1, samples[i]));
        view.setInt16(dataOffset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
      }

      return new Blob([wavBuffer], { type: 'audio/wav' });
    }

    async function startRecording() {
      try {
        pcmBuffers = [];
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            channelCount: 1,
            sampleRate: 16000,
            echoCancellation: true,
            noiseSuppression: true
          }
        });
        streamInstance = stream;

        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioContextClass();

        mediaStreamSource = audioContext.createMediaStreamSource(stream);
        scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1);

        scriptProcessor.onaudioprocess = (e) => {
          const inputData = e.inputBuffer.getChannelData(0);
          pcmBuffers.push(new Float32Array(inputData));
        };

        mediaStreamSource.connect(scriptProcessor);
        scriptProcessor.connect(audioContext.destination);

        recordSeconds = 0;
        recTimer.textContent = '00:00';
        recTimer.style.color = '#be123c';
        recordTimerInterval = setInterval(() => {
          recordSeconds++;
          recTimer.textContent = `${formatTimer(recordSeconds)}`;
          if (recordSeconds === 110) {
            Toast.info('10 seconds remaining (max 2 minutes).');
          }
          if (recordSeconds >= 120) {
            Toast.warning('Maximum voice length of 2 minutes reached.');
            finishAndSendRecording();
          }
        }, 1000);

        inputBox.style.display = 'none';
        recBar.style.display = 'flex';
      } catch (err) {
        console.error('Microphone access error:', err);
        Toast.error('Microphone access was denied or not found.');
        cleanupAudioNodes();
      }
    }

    function cancelRecording() {
      cleanupAudioNodes();
      pcmBuffers = [];
      recBar.style.display = 'none';
      inputBox.style.display = 'flex';
    }

    async function finishAndSendRecording() {
      if (!audioContext) return;
      const durationRecorded = recordSeconds;
      const inputRate = audioContext.sampleRate || 16000;
      const buffers = [...pcmBuffers];
      cleanupAudioNodes();
      pcmBuffers = [];

      recBar.style.display = 'none';
      inputBox.style.display = 'flex';

      if (durationRecorded > 120) {
        Toast.warning('Voice recording must be 2 minutes (120 seconds) or less. Please record a shorter message.');
        return;
      }

      const audioBlob = encodeWavBlob(buffers, inputRate, 16000);

      if (audioBlob.size < 500) {
        Toast.info('Voice recording was too short.');
        return;
      }

      const audioUrl = URL.createObjectURL(audioBlob);

      // Add user voice message node
      const uMsg = document.createElement('div');
      uMsg.className = 'chat-message user';
      uMsg.innerHTML = `
        <div class="message-avatar user-avatar">${initial}</div>
        <div class="message-bubble voice-message-bubble">
          <div class="voice-msg-player">
            <audio controls src="${audioUrl}" class="chat-audio-player"></audio>
          </div>
        </div>
      `;
      chatList.appendChild(uMsg);

      // Add assistant placeholder
      const aiMsg = document.createElement('div');
      aiMsg.className = 'chat-message assistant';
      aiMsg.innerHTML = `
        <div class="message-avatar ai-avatar"><div style="width:24px;height:24px;">${Icons.logo}</div></div>
        <div class="message-bubble"><span class="ai-text">Listening to your voice & thinking...</span><span class="streaming-cursor"></span></div>
      `;
      chatList.appendChild(aiMsg);
      chatList.scrollTop = chatList.scrollHeight;

      const textEl = aiMsg.querySelector('.ai-text');
      const cursor = aiMsg.querySelector('.streaming-cursor');
      chatSub.disabled = true;
      micBtn.disabled = true;

      let started = false;
      await NlpApi.answerVoiceStream(
        projectName,
        audioBlob,
        (token, full) => {
          if (!started) { started = true; textEl.innerHTML = ''; }
          textEl.innerHTML = Helpers.renderMarkdown(full);
          chatList.scrollTop = chatList.scrollHeight;
        },
        (final) => {
          cursor?.remove();
          if (final) textEl.innerHTML = Helpers.renderMarkdown(final);
          chatSub.disabled = false;
          micBtn.disabled = false;
          chatList.scrollTop = chatList.scrollHeight;
        },
        (err) => {
          cursor?.remove();
          textEl.innerHTML = `<span style="color:#c62828;">⚠️ ${err.message}</span>`;
          chatSub.disabled = false;
          micBtn.disabled = false;
        }
      );
    }

    micBtn.addEventListener('click', startRecording);
    cancelRecBtn.addEventListener('click', cancelRecording);
    sendRecBtn.addEventListener('click', finishAndSendRecording);

    function createMessageNode(role, content) {
      const el = document.createElement('div');
      el.className = `chat-message ${role === 'user' ? 'user' : 'assistant'}`;
      if (role === 'user') {
        el.innerHTML = `<div class="message-avatar user-avatar">${initial}</div><div class="message-bubble">${Helpers.escapeHtml(content)}</div>`;
      } else {
        el.innerHTML = `
          <div class="message-avatar ai-avatar"><div style="width:24px;height:24px;">${Icons.logo}</div></div>
          <div class="message-bubble">${Helpers.renderMarkdown(content)}</div>
        `;
      }
      return el;
    }

    async function loadInitialMessages() {
      try {
        const res = await MessageApi.getAllMessages(projectName, 1, 20);
        if (res && res.messages && res.messages.length > 0) {
          hasMoreMessages = !!res.has_more;
          messagePage = 1;
          res.messages.forEach(m => {
            const node = createMessageNode(m.role, m.content);
            chatList.appendChild(node);
          });
          chatList.scrollTop = chatList.scrollHeight;
        }
      } catch (err) {
        console.warn('Initial chat messages load skipped/offline:', err.message);
      }
    }

    chatList.addEventListener('scroll', async () => {
      if (chatList.scrollTop <= 40 && hasMoreMessages && !isLoadingMore) {
        isLoadingMore = true;
        if (loadMoreIndicator) loadMoreIndicator.style.display = 'block';

        const previousScrollHeight = chatList.scrollHeight;
        const previousScrollTop = chatList.scrollTop;
        const nextPage = messagePage + 1;

        try {
          const res = await MessageApi.getAllMessages(projectName, nextPage, 20);
          if (res && res.messages && res.messages.length > 0) {
            messagePage = nextPage;
            hasMoreMessages = !!res.has_more;

            // Prepend older messages right after welcome message / indicator
            const insertReference = welcomeMsg ? welcomeMsg.nextSibling : chatList.firstChild;
            res.messages.forEach(m => {
              const node = createMessageNode(m.role, m.content);
              chatList.insertBefore(node, insertReference);
            });

            // Maintain scroll position so view doesn't jump
            const newScrollHeight = chatList.scrollHeight;
            chatList.scrollTop = newScrollHeight - previousScrollHeight + previousScrollTop;
          } else {
            hasMoreMessages = false;
          }
        } catch (err) {
          console.warn('Load older messages failed:', err.message);
        } finally {
          if (loadMoreIndicator) loadMoreIndicator.style.display = 'none';
          isLoadingMore = false;
        }
      }
    });

    loadInitialMessages();

    // Dynamically auto-expand textarea for large prompts and enable scroll
    chatInput.addEventListener('input', () => {
      chatInput.style.height = 'auto';
      const scrollH = chatInput.scrollHeight;
      chatInput.style.height = `${Math.min(scrollH, 220)}px`;
    });

    // Enter sends message, Shift+Enter adds a new line
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        chatForm.dispatchEvent(new Event('submit'));
      }
    });

    chatForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const q = chatInput.value.trim();
      if (!q) return;
      chatInput.value = '';
      chatInput.style.height = 'auto';

      const uMsg = document.createElement('div');
      uMsg.className = 'chat-message user';
      uMsg.innerHTML = `<div class="message-avatar user-avatar">${initial}</div><div class="message-bubble">${Helpers.escapeHtml(q)}</div>`;
      chatList.appendChild(uMsg);

      const aiMsg = document.createElement('div');
      aiMsg.className = 'chat-message assistant';
      aiMsg.innerHTML = `
        <div class="message-avatar ai-avatar"><div style="width:24px;height:24px;">${Icons.logo}</div></div>
        <div class="message-bubble"><span class="ai-text">Thinking...</span><span class="streaming-cursor"></span></div>
      `;
      chatList.appendChild(aiMsg);
      chatList.scrollTop = chatList.scrollHeight;

      const textEl = aiMsg.querySelector('.ai-text');
      const cursor = aiMsg.querySelector('.streaming-cursor');
      chatSub.disabled = true;

      let started = false;
      await NlpApi.answerQuestionStream(
        projectName,
        q,
        3,
        (token, full) => {
          if (!started) { started = true; textEl.innerHTML = ''; }
          textEl.innerHTML = Helpers.renderMarkdown(full);
          chatList.scrollTop = chatList.scrollHeight;
        },
        (final) => {
          cursor?.remove();
          if (final) textEl.innerHTML = Helpers.renderMarkdown(final);
          chatSub.disabled = false;
          chatList.scrollTop = chatList.scrollHeight;
        },
        (err) => {
          cursor?.remove();
          textEl.innerHTML = `<span style="color:#c62828;">⚠️ ${err.message}</span>`;
          chatSub.disabled = false;
        }
      );
    });

    return container;
  }

  function renderProfilePage(navigate) {
    const container = document.createElement('div');
    container.className = 'profile-page';
    const user = AppState.user || { username: 'Parent', email: '' };
    const initial = (user.username || 'P').charAt(0).toUpperCase();

    container.innerHTML = `
      <div class="container container-narrow">
        <div class="profile-card">
          <div class="profile-header-area">
            <div class="profile-avatar-large">${initial}</div>
            <div class="profile-user-info">
              <h2>${user.username}</h2>
              <p>${user.email || 'CubCare Member'}</p>
            </div>
          </div>
          <div id="p-alert"></div>
          <form id="p-form">
            <div class="form-group">
              <label class="form-label">Username</label>
              <input type="text" id="pu-user" class="form-input" value="${user.username}" required />
            </div>
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input type="email" id="pu-email" class="form-input" value="${user.email || ''}" required />
            </div>
            <div style="display:flex;gap:14px;margin-top:24px;">
              <button type="submit" class="btn btn-primary">Save Changes</button>
              <button type="button" class="btn btn-outline" id="p-logout">${Icons.logout} <span>Sign Out</span></button>
            </div>
          </form>
        </div>

        <div class="danger-zone-card">
          <div class="danger-zone-title">${Icons.trash} <span>Danger Zone</span></div>
          <p class="danger-zone-desc">Permanently delete your CubCare account and all child records.</p>
          <button class="btn btn-danger" id="p-del">Delete Account</button>
        </div>
      </div>
    `;

    container.querySelector('#p-logout').addEventListener('click', () => {
      AppState.clearAuth();
      Toast.info('Signed out');
      navigate('/');
    });

    container.querySelector('#p-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const u = container.querySelector('#pu-user').value.trim();
      const em = container.querySelector('#pu-email').value.trim();
      try {
        await UserApi.updateProfile(u, em);
        AppState.setAuth(AppState.token, { ...user, username: u, email: em });
        Toast.success('Profile updated!');
      } catch (err) {
        Toast.error(err.message || 'Update failed');
      }
    });

    container.querySelector('#p-del').addEventListener('click', () => {
      const bodyHtml = `<p>Are you sure you want to permanently delete your account?</p>`;
      const footerHtml = `<button class="btn btn-outline" data-close>Cancel</button><button class="btn btn-danger" id="conf-del">Permanently Delete</button>`;
      const { overlay, close } = Modal.createModal('del-acc', 'Delete Account', bodyHtml, footerHtml);
      overlay.querySelector('#conf-del').addEventListener('click', async () => {
        try {
          await UserApi.deleteAccount();
          AppState.clearAuth();
          close();
          Toast.info('Account deleted');
          navigate('/');
        } catch (e) {
          Toast.error(e.message || 'Failed to delete');
        }
      });
    });

    return container;
  }

  // ==========================================
  // 8. SPA ROUTER & BOOTSTRAP
  // ==========================================
  class App {
    constructor() {
      this.navContainer = document.getElementById('navbar-container');
      this.contentContainer = document.getElementById('page-content');
      this.footerContainer = document.getElementById('footer-container');

      AppState.subscribe(() => this.render());
      window.addEventListener('popstate', () => this.render());
      window.addEventListener('hashchange', () => this.render());

      this.checkOAuth();
      this.render();
    }

    getPath() {
      const hash = window.location.hash.replace(/^#/, '');
      return hash.startsWith('/') ? hash : `/${hash}`;
    }

    navigate(path) {
      window.location.hash = path.startsWith('/') ? path : `/${path}`;
      this.render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    checkOAuth() {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('access_token');
      if (token) {
        AppState.setAuth(token, { username: 'Parent' });
        Toast.success('Signed in with Google!');
        window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
      }
    }

    render() {
      const path = this.getPath();
      const isAuth = AppState.isAuthenticated();

      if ((path === '/login' || path === '/register') && isAuth) {
        this.navigate('/dashboard');
        return;
      }
      if ((path === '/dashboard' || path === '/profile' || path.startsWith('/chat')) && !isAuth) {
        Toast.info('Please sign in to continue');
        this.navigate('/login');
        return;
      }

      this.navContainer.innerHTML = renderNavbar(path, p => this.navigate(p));
      this.navContainer.querySelectorAll('[data-nav]').forEach(el => {
        el.addEventListener('click', e => { e.preventDefault(); this.navigate(el.getAttribute('data-nav')); });
      });

      this.contentContainer.innerHTML = '';
      let pageEl = null;

      if (path === '/' || path === '') pageEl = renderHomePage(p => this.navigate(p));
      else if (path === '/login') pageEl = renderLoginPage(p => this.navigate(p));
      else if (path === '/register') pageEl = renderRegisterPage(p => this.navigate(p));
      else if (path === '/about') pageEl = renderAboutPage(p => this.navigate(p));
      else if (path === '/contact') pageEl = renderContactPage(p => this.navigate(p));
      else if (path === '/dashboard') pageEl = renderDashboardPage(p => this.navigate(p));
      else if (path.startsWith('/chat/')) {
        const name = decodeURIComponent(path.replace('/chat/', ''));
        pageEl = renderChatPage(name, p => this.navigate(p));
      }
      else if (path === '/profile') pageEl = renderProfilePage(p => this.navigate(p));
      else pageEl = renderHomePage(p => this.navigate(p));

      if (pageEl) {
        this.contentContainer.appendChild(pageEl);
        pageEl.querySelectorAll('[data-nav]').forEach(el => {
          el.addEventListener('click', e => { e.preventDefault(); this.navigate(el.getAttribute('data-nav')); });
        });
      }

      if (path.startsWith('/chat/')) {
        this.footerContainer.innerHTML = '';
      } else {
        this.footerContainer.innerHTML = renderFooter(p => this.navigate(p));
        this.footerContainer.querySelectorAll('[data-nav]').forEach(el => {
          el.addEventListener('click', e => { e.preventDefault(); this.navigate(el.getAttribute('data-nav')); });
        });
      }
    }
  }

  // Self-executing bootstrap
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new App());
  } else {
    new App();
  }
})();
