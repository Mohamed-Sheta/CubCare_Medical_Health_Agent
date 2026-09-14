import { Icons } from '../utils/icons.js';
import { AppState } from '../state.js';
import { UserApi } from '../api/userApi.js';
import { Toast } from '../components/toast.js';
import { Modal } from '../components/modal.js';
import { Validators } from '../utils/validators.js';

export function renderProfilePage(navigate) {
  const container = document.createElement('div');
  container.className = 'profile-page';

  const user = AppState.user || { username: 'Parent', email: '' };
  const initial = (user.username || 'P').charAt(0).toUpperCase();

  container.innerHTML = `
    <div class="container container-narrow">
      <!-- Profile Header Area -->
      <div class="profile-card">
        <div class="profile-header-area">
          <div class="profile-avatar-large">
            ${initial}
          </div>
          <div class="profile-user-info">
            <h2>${user.username}</h2>
            <p>${user.email || 'CubCare Member'}</p>
          </div>
        </div>

        <div id="profile-alert-box"></div>

        <!-- Edit Profile Form -->
        <form id="profile-form">
          <h3 style="font-size: 1.25rem; font-weight: 700; color: #0f3460; margin-bottom: 20px;">
            Account Details
          </h3>

          <div class="form-group">
            <label class="form-label" for="profile-username">Username</label>
            <input 
              type="text" 
              id="profile-username" 
              class="form-input" 
              value="${user.username}" 
              required 
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="profile-email">Email Address</label>
            <input 
              type="email" 
              id="profile-email" 
              class="form-input" 
              value="${user.email || ''}" 
              required 
            />
          </div>

          <div style="display: flex; gap: 14px; margin-top: 24px;">
            <button type="submit" class="btn btn-primary" id="save-profile-btn">
              <span>Save Changes</span>
            </button>
            <button type="button" class="btn btn-outline" id="btn-logout">
              ${Icons.logout}
              <span>Sign Out</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Danger Zone: Delete Account -->
      <div class="danger-zone-card">
        <div class="danger-zone-title">
          ${Icons.trash}
          <span>Danger Zone</span>
        </div>
        <p class="danger-zone-desc">
          Permanently delete your CubCare account and all associated child health records, projects, and chat history.
        </p>
        <button class="btn btn-danger" id="btn-delete-account">
          <span>Delete Account</span>
        </button>
      </div>
    </div>
  `;

  const form = container.querySelector('#profile-form');
  const alertBox = container.querySelector('#profile-alert-box');
  const saveBtn = container.querySelector('#save-profile-btn');
  const logoutBtn = container.querySelector('#btn-logout');
  const deleteBtn = container.querySelector('#btn-delete-account');

  // Sign out
  logoutBtn.addEventListener('click', () => {
    AppState.clearAuth();
    Toast.info('Signed out successfully.');
    navigate('/');
  });

  // Save changes
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    alertBox.innerHTML = '';

    const newUsername = container.querySelector('#profile-username').value.trim();
    const newEmail = container.querySelector('#profile-email').value.trim();

    if (!Validators.isValidUsername(newUsername)) {
      alertBox.innerHTML = `<div class="alert alert-error">Username must be at least 3 characters.</div>`;
      return;
    }

    if (!Validators.isValidEmail(newEmail)) {
      alertBox.innerHTML = `<div class="alert alert-error">Please enter a valid email address.</div>`;
      return;
    }

    saveBtn.disabled = true;
    saveBtn.innerHTML = `<div class="spinner"></div><span>Saving...</span>`;

    try {
      const updated = await UserApi.updateProfile(newUsername, newEmail);
      AppState.setAuth(AppState.token, {
        ...user,
        username: updated.username || newUsername,
        email: updated.email || newEmail
      });
      Toast.success('Profile updated successfully!');
      alertBox.innerHTML = `<div class="alert alert-success">Profile changes saved successfully!</div>`;
    } catch (err) {
      alertBox.innerHTML = `<div class="alert alert-error">${err.message || 'Failed to update profile.'}</div>`;
    } finally {
      saveBtn.disabled = false;
      saveBtn.innerHTML = `<span>Save Changes</span>`;
    }
  });

  // Delete Account Modal
  deleteBtn.addEventListener('click', () => {
    const bodyHtml = `
      <div id="modal-error-box"></div>
      <p style="color: #475569; margin-bottom: 16px;">
        Are you absolutely sure you want to delete your account?
      </p>
      <p style="font-size: 0.88rem; color: #c62828;">
        This action is irreversible and will delete all your child's data and projects.
      </p>
    `;

    const footerHtml = `
      <button class="btn btn-outline" data-close>Cancel</button>
      <button class="btn btn-danger" id="modal-confirm-delete-user">
        <span>Permanently Delete</span>
      </button>
    `;

    const { overlay, close } = Modal.createModal('delete-user-modal', 'Delete Account', bodyHtml, footerHtml);

    const submitDelete = overlay.querySelector('#modal-confirm-delete-user');
    const errBox = overlay.querySelector('#modal-error-box');

    submitDelete.addEventListener('click', async () => {
      submitDelete.disabled = true;
      submitDelete.innerHTML = `<div class="spinner"></div><span>Deleting...</span>`;

      try {
        await UserApi.deleteAccount();
        AppState.clearAuth();
        close();
        Toast.info('Your account has been deleted.');
        navigate('/');
      } catch (err) {
        errBox.innerHTML = `<div class="alert alert-error">${err.message || 'Failed to delete account.'}</div>`;
      } finally {
        submitDelete.disabled = false;
        submitDelete.innerHTML = `<span>Permanently Delete</span>`;
      }
    });
  });

  return container;
}
