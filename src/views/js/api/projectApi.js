import { request } from './client.js';

export const ProjectApi = {
  async getAllProjects(page = 1, limit = 10) {
    return await request(`/api/v1/project/all?page=${page}&limit=${limit}`, {
      method: 'GET'
    });
  },

  async getProjectAssets(projectName) {
    return await request(`/api/v1/data/assets/${encodeURIComponent(projectName)}`, {
      method: 'GET'
    });
  },

  async createProject(projectName, title) {
    return await request(`/api/v1/data/create/${encodeURIComponent(projectName)}`, {
      method: 'POST',
      body: { title }
    });
  },

  async uploadFile(projectName, file) {
    const formData = new FormData();
    formData.append('file', file);

    return await request(`/api/v1/data/upload/${encodeURIComponent(projectName)}`, {
      method: 'POST',
      body: formData
    });
  },

  async updateChatTitle(projectName, title) {
    return await request(`/api/v1/data/update/title/${encodeURIComponent(projectName)}`, {
      method: 'POST',
      body: { title }
    });
  },

  async deleteProject(projectName) {
    return await request(`/api/v1/data/delete/${encodeURIComponent(projectName)}`, {
      method: 'DELETE'
    });
  },

  async processFile(projectName, fileName, chunkSize = 1000, overlapSize = 100, doReset = 0) {
    return await request(`/api/v1/data/process/${encodeURIComponent(projectName)}`, {
      method: 'POST',
      body: {
        file_name: fileName,
        chunk_size: chunkSize,
        overlap_size: overlapSize,
        do_reset: doReset
      }
    });
  },

  async processAllFiles(projectName, chunkSize = 1000, overlapSize = 100, doReset = 0) {
    return await request(`/api/v1/data/process/all/${encodeURIComponent(projectName)}`, {
      method: 'POST',
      body: {
        chunk_size: chunkSize,
        overlap_size: overlapSize,
        do_reset: doReset
      }
    });
  }
};
