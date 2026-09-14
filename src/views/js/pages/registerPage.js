import { Icons } from '../utils/icons.js';
import { AuthApi } from '../api/authApi.js';
import { Toast } from '../components/toast.js';
import { Validators } from '../utils/validators.js';

export function renderRegisterPage(navigate) {
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
        <h1 class="auth-title">Create Account</h1>
        <p class="auth-subtitle">Join CubCare to support your child's health journey</p>
      </div>

      <div id="register-alert-container"></div>

      <!-- Google Sign In -->
      <button type="button" class="btn btn-google" id="google-register-btn">
        ${Icons.google}
        <span>Sign up with Google</span>
      </button>

      <div class="auth-divider">
        <span>or register with email</span>
      </div>

      <form id="register-form">
        <div class="form-group">
          <label class="form-label" for="reg-username">Username</label>
          <input 
            type="text" 
            id="reg-username" 
            class="form-input" 
            placeholder="johndoe" 
            required 
            autocomplete="username"
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="reg-email">Email Address</label>
          <input 
            type="email" 
            id="reg-email" 
            class="form-input" 
            placeholder="parent@example.com" 
            required 
            autocomplete="email"
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="reg-password">Password</label>
          <input 
            type="password" 
            id="reg-password" 
            class="form-input" 
            placeholder="At least 6 characters" 
            required 
            autocomplete="new-password"
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="reg-confirm-password">Confirm Password</label>
          <input 
            type="password" 
            id="reg-confirm-password" 
            class="form-input" 
            placeholder="Re-type your password" 
            required 
            autocomplete="new-password"
          />
          <div id="password-match-error" class="form-error-text hidden">Passwords do not match</div>
        </div>

        <button type="submit" class="btn btn-primary" id="register-submit-btn" style="width: 100%; padding: 12px; margin-top: 8px;">
          <span>Create Account</span>
        </button>
      </form>

      <div class="auth-footer">
        Already have an account? <a href="#/login" data-nav="/login">Sign in</a>
      </div>
    </div>
  `;

  // Google Register
  const googleBtn = container.querySelector('#google-register-btn');
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

  const form = container.querySelector('#register-form');
  const alertContainer = container.querySelector('#register-alert-container');
  const submitBtn = container.querySelector('#register-submit-btn');
  const matchError = container.querySelector('#password-match-error');

  const pwd = container.querySelector('#reg-password');
  const confirmPwd = container.querySelector('#reg-confirm-password');

  // Real-time password check
  confirmPwd.addEventListener('input', () => {
    if (confirmPwd.value && pwd.value !== confirmPwd.value) {
      matchError.classList.remove('hidden');
      confirmPwd.classList.add('is-invalid');
    } else {
      matchError.classList.add('hidden');
      confirmPwd.classList.remove('is-invalid');
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    alertContainer.innerHTML = '';

    const username = container.querySelector('#reg-username').value.trim();
    const email = container.querySelector('#reg-email').value.trim();
    const password = pwd.value;
    const confirmPassword = confirmPwd.value;

    if (!Validators.isValidUsername(username)) {
      alertContainer.innerHTML = `<div class="alert alert-error">Username must be at least 3 characters.</div>`;
      return;
    }

    if (!Validators.isValidEmail(email)) {
      alertContainer.innerHTML = `<div class="alert alert-error">Please enter a valid email address.</div>`;
      return;
    }

    if (!Validators.isValidPassword(password)) {
      alertContainer.innerHTML = `<div class="alert alert-error">Password must be at least 6 characters.</div>`;
      return;
    }

    if (password !== confirmPassword) {
      alertContainer.innerHTML = `<div class="alert alert-error">Passwords do not match.</div>`;
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<div class="spinner"></div><span>Creating Account...</span>`;

    try {
      await AuthApi.register(username, email, password);
      Toast.success('Account created successfully! Please sign in.');
      navigate('/login');
    } catch (err) {
      alertContainer.innerHTML = `<div class="alert alert-error">${err.message || 'Registration failed. Please try again.'}</div>`;
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span>Create Account</span>`;
    }
  });

  return container;
}
