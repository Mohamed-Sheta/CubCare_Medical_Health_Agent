import { request } from './client.js';

export const MessageApi = {
  async getAllMessages(projectName, page = 1, limit = 20) {
    return await request(`/api/v1/message/all/${encodeURIComponent(projectName)}?page=${page}&limit=${limit}`, {
      method: 'GET'
    });
  }
};
