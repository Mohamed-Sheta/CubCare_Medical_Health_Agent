import { Storage } from './utils/storage.js';

class State {
  constructor() {
    this.token = Storage.getToken();
    this.user = Storage.getUser();
    this.activeProject = null;
    this.listeners = [];
  }

  isAuthenticated() {
    return !!this.token;
  }

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

  setActiveProject(project) {
    this.activeProject = project;
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    for (const listener of this.listeners) {
      try {
        listener(this);
      } catch (e) {
        console.error('State subscriber error:', e);
      }
    }
  }
}

export const AppState = new State();
