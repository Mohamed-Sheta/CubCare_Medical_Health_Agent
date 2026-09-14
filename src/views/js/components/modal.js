import { Icons } from '../utils/icons.js';

export const Modal = {
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
        <div class="modal-body">
          ${bodyHtml}
        </div>
        <div class="modal-footer" style="margin-top: 24px; display: flex; justify-content: flex-end; gap: 12px;">
          ${footerHtml}
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    const close = () => {
      overlay.classList.remove('is-active');
      setTimeout(() => overlay.remove(), 250);
    };

    overlay.querySelectorAll('[data-close]').forEach(btn => {
      btn.addEventListener('click', close);
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });

    // Trigger animation in next tick
    setTimeout(() => overlay.classList.add('is-active'), 10);

    return { overlay, close };
  }
};
