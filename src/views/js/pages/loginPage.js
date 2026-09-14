import { Icons } from '../utils/icons.js';
import { AuthApi } from '../api/authApi.js';
import { AppState } from '../state.js';
import { Toast } from '../components/toast.js';
import { Validators } from '../utils/validators.js';

export function renderLoginPage(navigate) {
  const container = document.createElement('div');
  container.className = 'auth-page';

  container.innerHTML = `
    <div class="auth-card">
      <div class="auth-header">
        <div class="auth-logo-wrap">
          <div style="width: 54px; height: 54px;">
            ${Icons.logo}
          </div>
        </div>
        <h1 class="auth-title">Welcome Back</h1>
        <p class="auth-subtitle">Sign in to access your child's health assistant</p>
      </div>

      <div id="auth-alert-container"></div>

      <!-- Google Sign In -->
      <button type="button" class="btn btn-google" id="google-login-btn">
        ${Icons.google}
        <span>Sign in with Google</span>
      </button>

      <div class="auth-divider">
        <span>or sign in with email</span>
      </div>

      <form id="login-form">
        <div class="form-group">
          <label class="form-label" for="login-email">Email or Username</label>
          <input 
            type="text" 
            id="login-email" 
            class="form-input" 
            placeholder="parent@example.com" 
            required 
            autocomplete="username"
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="login-password">Password</label>
          <div class="password-input-wrap">
            <input 
              type="password" 
              id="login-password" 
              class="form-input" 
              placeholder="••••••••" 
              required 
              autocomplete="current-password"
            />
            <button type="button" class="password-toggle-btn" id="toggle-password" aria-label="Toggle password visibility">
              ${Icons.eye}
            </button>
          </div>
        </div>

        <button type="submit" class="btn btn-primary" id="login-submit-btn" style="width: 100%; padding: 12px; margin-top: 8px;">
          <span>Sign In</span>
        </button>
      </form>

      <div class="auth-footer">
        Don't have an account? <a href="#/register" data-nav="/register">Create one here</a>
      </div>
    </div>
  `;

  // Password toggle
  const pwdInput = container.querySelector('#login-password');
  const toggleBtn = container.querySelector('#toggle-password');
  if (pwdInput && toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const isPwd = pwdInput.type === 'password';
      pwdInput.type = isPwd ? 'text' : 'password';
      toggleBtn.innerHTML = isPwd ? Icons.eyeOff : Icons.eye;
    });
  }

  // Google Login
  const googleBtn = container.querySelector('#google-login-btn');
  if (googleBtn) {
    googleBtn.addEventListener('click', () => {
      window.location.href = AuthApi.getGoogleLoginUrl();
    });
  }

  // Navigation link
  container.querySelectorAll('[data-nav]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navigate(link.getAttribute('data-nav'));
    });
  });

  // Form submit
  const form = container.querySelector('#login-form');
  const alertContainer = container.querySelector('#auth-alert-container');
  const submitBtn = container.querySelector('#login-submit-btn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    alertContainer.innerHTML = '';

    const emailOrUser = container.querySelector('#login-email').value.trim();
    const password = pwdInput.value;

    if (!emailOrUser || !password) {
      alertContainer.innerHTML = `<div class="alert alert-error">Please enter your email and password.</div>`;
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<div class="spinner"></div><span>Signing In...</span>`;

    try {
      const res = await AuthApi.login(emailOrUser, password);

      // Construct user object (from input or username)
      const username = emailOrUser.includes('@') ? emailOrUser.split('@')[0] : emailOrUser;
      const user = {
        username: username,
        email: emailOrUser.includes('@') ? emailOrUser : ''
      };

      AppState.setAuth(res.access_token, user);
      Toast.success('Signed in successfully!');
      navigate('/');
    } catch (err) {
      alertContainer.innerHTML = `<div class="alert alert-error">${err.message || 'Invalid credentials. Please try again.'}</div>`;
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span>Sign In</span>`;
    }
  });

  return container;
}
