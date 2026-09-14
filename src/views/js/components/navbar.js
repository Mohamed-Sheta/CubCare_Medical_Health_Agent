import { Icons } from '../utils/icons.js';
import { AppState } from '../state.js';

export function renderNavbar(currentPath, navigate) {
  const isAuth = AppState.isAuthenticated();
  const user = AppState.user;
  const username = user?.username || 'Parent';
  const initial = username.charAt(0).toUpperCase();

  const isHome = currentPath === '/' || currentPath === '';
  const isAbout = currentPath === '/about';
  const isContact = currentPath === '/contact';
  const isDashboard = currentPath === '/dashboard' || currentPath.startsWith('/chat');
  const isProfile = currentPath === '/profile';

  return `
    <header class="navbar">
      <div class="container nav-container">
        <!-- Brand Logo -->
        <a class="brand" data-nav="/">
          <div class="brand-icon">
            ${Icons.logo}
          </div>
          <div class="brand-text-wrap">
            <span class="brand-name">CubCare</span>
            <span class="brand-tagline">Little Steps • Healthier Tomorrows</span>
          </div>
        </a>

        <!-- Center Nav Links -->
        <ul class="nav-links" id="nav-links-menu">
          <li><a class="nav-link ${isHome ? 'active' : ''}" data-nav="/">Home</a></li>
          <li><a class="nav-link ${isAbout ? 'active' : ''}" data-nav="/about">About</a></li>
          <li><a class="nav-link ${isContact ? 'active' : ''}" data-nav="/contact">Contact</a></li>
          ${isAuth ? `<li><a class="nav-link ${isDashboard ? 'active' : ''}" data-nav="/dashboard">AI Model</a></li>` : ''}

          <!-- Mobile Auth Buttons -->
          <li class="nav-actions-mobile hidden">
            ${!isAuth ? `
              <button class="btn btn-outline" data-nav="/login">
                ${Icons.user} Login
              </button>
              <button class="btn btn-primary" data-nav="/register">
                ${Icons.plus} Register
              </button>
            ` : `
              <button class="btn btn-secondary" data-nav="/profile">
                ${Icons.user} Profile (${username})
              </button>
            `}
          </li>
        </ul>

        <!-- Right Actions Desktop -->
        <div class="nav-actions">
          ${!isAuth ? `
            <button class="btn btn-outline" data-nav="/login" id="nav-login-btn">
              ${Icons.user}
              <span>Login</span>
            </button>
            <button class="btn btn-primary" data-nav="/register" id="nav-register-btn">
              ${Icons.plus}
              <span>Register</span>
            </button>
          ` : `
            <div class="user-profile-badge" data-nav="/profile" id="nav-profile-badge" title="Open Profile">
              <div class="user-avatar-circle">${initial}</div>
              <span>${username}</span>
            </div>
          `}
        </div>

        <!-- Mobile Hamburger Toggle -->
        <button class="mobile-toggle" id="mobile-menu-toggle" aria-label="Toggle menu">
          ☰
        </button>
      </div>
    </header>
  `;
}

export function setupNavbarEvents(container, navigate) {
  const links = container.querySelectorAll('[data-nav]');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const path = link.getAttribute('data-nav');
      if (path) navigate(path);
      
      // Close mobile menu if open
      const menu = document.getElementById('nav-links-menu');
      if (menu) menu.classList.remove('is-open');
    });
  });

  const toggle = container.querySelector('#mobile-menu-toggle');
  const menu = container.querySelector('#nav-links-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('is-open');
    });
  }
}
