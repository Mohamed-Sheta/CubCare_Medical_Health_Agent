import { request, API_BASE } from './client.js';

export const AuthApi = {
  async login(emailOrUsername, password) {
    // FastAPI OAuth2PasswordRequestForm expects form-urlencoded with username and password fields
    const params = new URLSearchParams();
    params.append('username', emailOrUsername);
    params.append('password', password);

    return await request('/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    });
  },

  async register(username, email, password) {
    return await request('/api/v1/auth/register', {
      method: 'POST',
      body: {
        username,
        email,
        password
      }
    });
  },

  getGoogleLoginUrl() {
    return `${API_BASE}/api/v1/auth/google/login`;
  }
};
