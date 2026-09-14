// Centralized LocalStorage Management
const TOKEN_KEY = 'cubcare_access_token';
const USER_KEY = 'cubcare_user_data';
const PROJECTS_KEY = 'cubcare_projects_cache';

export const Storage = {
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token) {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  },

  getUser() {
    try {
      const data = localStorage.getItem(USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setUser(user) {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  },

  getProjects() {
    try {
      const data = localStorage.getItem(PROJECTS_KEY);
      const list = data ? JSON.parse(data) : [];
      return list.filter(x => x && x.project_name && x.project_name !== 'pediatric_general');
    } catch {
      return [];
    }
  },

  saveProject(project) {
    const list = this.getProjects().filter(p => p.project_name !== project.project_name);
    list.unshift(project);
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(list));
  },

  saveProjects(projects) {
    if (Array.isArray(projects)) {
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
    }
  },

  removeProject(projectName) {
    const list = this.getProjects().filter(p => p.project_name !== projectName);
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(list));
  },

  updateProjectTitle(projectName, newTitle) {
    const list = this.getProjects().map(p => {
      if (p.project_name === projectName) {
        return { ...p, title: newTitle };
      }
      return p;
    });
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(list));
  },

  getProjectFiles(projectName) {
    try {
      const data = localStorage.getItem(`cubcare_files_${projectName}`);
      return data ? JSON.parse(data) : [];
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
