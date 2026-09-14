import { Icons } from '../utils/icons.js';

export function renderFooter(navigate) {
  return `
    <footer style="background: #ffffff; border-top: 1px solid var(--border-light); padding: 40px 0 30px; margin-top: auto;">
      <div class="container" style="display: flex; flex-direction: column; gap: 24px;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 32px; height: 32px;">${Icons.logo}</div>
            <span style="font-weight: 800; font-size: 1.2rem; color: #0f3460;">CubCare</span>
            <span style="color: var(--text-light); font-size: 0.9rem;">— Pediatric AI Assistant</span>
          </div>

          <div style="display: flex; gap: 24px; font-size: 0.9rem; font-weight: 600;">
            <a data-nav="/" style="cursor: pointer;">Home</a>
            <a data-nav="/about" style="cursor: pointer;">About</a>
            <a data-nav="/contact" style="cursor: pointer;">Contact</a>
          </div>
        </div>

        <div style="border-top: 1px solid #f1f5f9; padding-top: 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; font-size: 0.85rem; color: var(--text-muted);">
          <div>&copy; ${new Date().getFullYear()} CubCare. Caring today for brighter tomorrows ♡</div>
          <div style="color: #64748b;">Educational AI tool • Not a substitute for emergency medical care</div>
        </div>
      </div>
    </footer>
  `;
}
