import { Icons } from '../utils/icons.js';
import { AppState } from '../state.js';
import { ProjectApi } from '../api/projectApi.js';
import { Storage } from '../utils/storage.js';
import { Toast } from '../components/toast.js';
import { Modal } from '../components/modal.js';
import { Validators } from '../utils/validators.js';

export function renderDashboardPage(navigate) {
  const container = document.createElement('div');
  container.className = 'dashboard-page';

  const user = AppState.user;
  const username = user?.username || 'Parent';

  container.innerHTML = `
    <div class="container">
      <!-- Dashboard Top Header -->
      <div class="dashboard-header">
        <div class="dashboard-welcome">
          <h1>Hello, ${username} 👋</h1>
          <p>Manage your child's health assistant projects and pediatric records.</p>
        </div>

        <button class="btn btn-primary" id="btn-create-new-project">
          ${Icons.plus}
          <span>New Project</span>
        </button>
      </div>

      <!-- Quick Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon" style="background: #e3f2fd; color: #1565c0;">
            📁
          </div>
          <div class="stat-info">
            <h3 id="stat-project-count">0</h3>
            <p>Active Projects</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: #e8f5e9; color: #2e7d32;">
            📄
          </div>
          <div class="stat-info">
            <h3>Upload Documents</h3>
            <p>Add Child Health Files</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: #e0f2f1; color: #00897b;">
            🛡️
          </div>
          <div class="stat-info">
            <h3>Encrypted</h3>
            <p>HIPAA-Aware Storage</p>
          </div>
        </div>
      </div>

      <!-- Projects Section -->
      <div class="projects-header-bar">
        <h2 class="projects-title">Your Health Projects</h2>
      </div>

      <div class="projects-grid" id="projects-grid-container">
        <!-- Project Cards will be rendered dynamically -->
      </div>
    </div>
  `;

  const gridContainer = container.querySelector('#projects-grid-container');
  const countStat = container.querySelector('#stat-project-count');

  let currentPage = 1;
  const limit = 10;

  async function loadProjects(page = 1) {
    currentPage = page;
    gridContainer.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;"><div class="spinner"></div><p style="color:#64748b;margin-top:10px;">Loading projects...</p></div>`;

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

    countStat.textContent = totalProjects;
    gridContainer.innerHTML = '';

    if (projects.length === 0) {
      gridContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📂</div>
          <h3 style="font-size: 1.25rem; font-weight: 700; color: #0f3460;">No Projects Yet</h3>
          <p style="color: #64748b; max-width: 400px;">
            Create your first project to start uploading medical records and chatting with CubCare AI.
          </p>
          <button class="btn btn-primary" id="btn-empty-create">
            ${Icons.plus} Create Project
          </button>
        </div>
      `;

      gridContainer.querySelector('#btn-empty-create')?.addEventListener('click', openCreateModal);
      return;
    }

    projects.forEach(project => {
      const card = document.createElement('div');
      card.className = 'project-card';

      card.innerHTML = `
        <div>
          <div class="project-card-top">
            <span class="project-tag">Pediatric Assistant</span>
            <div class="project-actions-menu">
              <button class="project-action-btn edit-title-btn" title="Edit Title">
                ${Icons.edit}
              </button>
              <button class="project-action-btn delete delete-project-btn" title="Delete Project">
                ${Icons.trash}
              </button>
            </div>
          </div>

          <h3 class="project-card-title">${project.title || project.project_name}</h3>
          <div class="project-card-slug">${project.project_name}</div>
        </div>

        <div class="project-card-footer">
          <button class="project-open-btn open-chat-btn">
            <span>Open Consultation</span>
            ${Icons.arrowRight}
          </button>
        </div>
      `;

      // Open Chat
      card.querySelector('.open-chat-btn').addEventListener('click', () => {
        AppState.setActiveProject(project);
        navigate(`/chat/${encodeURIComponent(project.project_name)}`);
      });

      // Edit Title
      card.querySelector('.edit-title-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        openEditTitleModal(project);
      });

      // Delete Project
      card.querySelector('.delete-project-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        openDeleteModal(project);
      });

      gridContainer.appendChild(card);
    });
  }

  // Create Project Modal
  function openCreateModal() {
    const bodyHtml = `
      <div id="modal-error-box"></div>
      <div class="form-group">
        <label class="form-label" for="new-project-slug">Project Name (Slug / Identifier)</label>
        <input type="text" id="new-project-slug" class="form-input" placeholder="e.g. leo_cold_records" required />
        <span style="font-size: 0.78rem; color: #64748b; margin-top: 4px;">Only letters, numbers, hyphens, and underscores.</span>
      </div>

      <div class="form-group">
        <label class="form-label" for="new-project-title">Project Chat Title</label>
        <input type="text" id="new-project-title" class="form-input" placeholder="e.g. Leo's Flu and Fever Tracking" required />
      </div>
    `;

    const footerHtml = `
      <button class="btn btn-outline" data-close>Cancel</button>
      <button class="btn btn-primary" id="modal-submit-create">
        <span>Create Project</span>
      </button>
    `;

    const { overlay, close } = Modal.createModal('create-project-modal', 'Create New Project', bodyHtml, footerHtml);

    const submitBtn = overlay.querySelector('#modal-submit-create');
    const errBox = overlay.querySelector('#modal-error-box');

    submitBtn.addEventListener('click', async () => {
      const projectName = overlay.querySelector('#new-project-slug').value.trim().toLowerCase();
      const title = overlay.querySelector('#new-project-title').value.trim();

      if (!Validators.isValidProjectName(projectName)) {
        errBox.innerHTML = `<div class="alert alert-error">Project Name must be 3-50 characters (letters, numbers, hyphens, underscores).</div>`;
        return;
      }

      if (!title) {
        errBox.innerHTML = `<div class="alert alert-error">Please enter a project title.</div>`;
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<div class="spinner"></div><span>Creating...</span>`;

      try {
        await ProjectApi.createProject(projectName, title);
        const newProj = {
          project_name: projectName,
          title: title,
          created_at: new Date().toISOString()
        };
        Storage.saveProject(newProj);
        Toast.success(`Project "${title}" created successfully!`);
        close();
        loadProjects();
      } catch (err) {
        errBox.innerHTML = `<div class="alert alert-error">${err.message || 'Failed to create project.'}</div>`;
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Create Project</span>`;
      }
    });
  }

  // Edit Title Modal
  function openEditTitleModal(project) {
    const bodyHtml = `
      <div id="modal-error-box"></div>
      <div class="form-group">
        <label class="form-label" for="edit-project-title">New Project Title</label>
        <input type="text" id="edit-project-title" class="form-input" value="${project.title || project.project_name}" required />
      </div>
    `;

    const footerHtml = `
      <button class="btn btn-outline" data-close>Cancel</button>
      <button class="btn btn-primary" id="modal-submit-edit">
        <span>Save Title</span>
      </button>
    `;

    const { overlay, close } = Modal.createModal('edit-title-modal', 'Edit Project Title', bodyHtml, footerHtml);

    const submitBtn = overlay.querySelector('#modal-submit-edit');
    const errBox = overlay.querySelector('#modal-error-box');

    submitBtn.addEventListener('click', async () => {
      const newTitle = overlay.querySelector('#edit-project-title').value.trim();
      if (!newTitle) {
        errBox.innerHTML = `<div class="alert alert-error">Title cannot be empty.</div>`;
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<div class="spinner"></div><span>Saving...</span>`;

      try {
        await ProjectApi.updateChatTitle(project.project_name, newTitle);
        Storage.updateProjectTitle(project.project_name, newTitle);
        Toast.success('Project title updated!');
        close();
        loadProjects();
      } catch (err) {
        errBox.innerHTML = `<div class="alert alert-error">${err.message || 'Failed to update title.'}</div>`;
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Save Title</span>`;
      }
    });
  }

  // Delete Project Modal
  function openDeleteModal(project) {
    const bodyHtml = `
      <div id="modal-error-box"></div>
      <p style="color: #475569; margin-bottom: 16px;">
        Are you sure you want to permanently delete project <strong>${project.title || project.project_name}</strong>?
      </p>
      <p style="font-size: 0.88rem; color: #c62828;">
        This will permanently remove all chat messages, uploaded assets, and vector embeddings.
      </p>
    `;

    const footerHtml = `
      <button class="btn btn-outline" data-close>Cancel</button>
      <button class="btn btn-danger" id="modal-submit-delete">
        <span>Delete Project</span>
      </button>
    `;

    const { overlay, close } = Modal.createModal('delete-project-modal', 'Delete Project', bodyHtml, footerHtml);

    const submitBtn = overlay.querySelector('#modal-submit-delete');
    const errBox = overlay.querySelector('#modal-error-box');

    submitBtn.addEventListener('click', async () => {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<div class="spinner"></div><span>Deleting...</span>`;

      try {
        await ProjectApi.deleteProject(project.project_name);
        Storage.removeProject(project.project_name);
        Toast.success(`Project deleted.`);
        close();
        loadProjects();
      } catch (err) {
        errBox.innerHTML = `<div class="alert alert-error">${err.message || 'Failed to delete project.'}</div>`;
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Delete Project</span>`;
      }
    });
  }

  container.querySelector('#btn-create-new-project').addEventListener('click', openCreateModal);

  // Initial load
  loadProjects();

  return container;
}
