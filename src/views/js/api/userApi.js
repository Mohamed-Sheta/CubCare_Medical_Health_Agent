import { request } from './client.js';

export const UserApi = {
  async searchUser(username) {
    return await request('/api/v1/user/', {
      method: 'GET',
      body: { username }
    });
  },

  async updateProfile(username, email) {
    return await request('/api/v1/user/', {
      method: 'PUT',
      body: {
        username,
        email
      }
    });
  },

  async deleteAccount() {
    return await request('/api/v1/user/', {
      method: 'DELETE'
    });
  }
};
