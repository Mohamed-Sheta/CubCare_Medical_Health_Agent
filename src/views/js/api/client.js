import { Storage } from '../utils/storage.js';

function getBaseUrl() {
  if (typeof window === 'undefined' || window.location.protocol === 'file:') {
    return 'http://localhost:5000';
  }
  if (window.location.port !== '5000') {
    const host = window.location.hostname || 'localhost';
    return `http://${host}:5000`;
  }
  return '';
}

export const API_BASE = getBaseUrl();

export async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = options.headers || {};

  const token = Storage.getToken();
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // If body is an object and not FormData or URLSearchParams, JSON encode it
  let body = options.body;
  if (body && typeof body === 'object' && !(body instanceof FormData) && !(body instanceof URLSearchParams)) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(body);
  }

  const config = {
    ...options,
    headers,
    body
  };

  try {
    const response = await fetch(url, config);

    // Handle 204 No Content
    if (response.status === 204) {
      return { success: true };
    }

    const contentType = response.headers.get('content-type') || '';
    let data;
    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorMessage = (data && data.detail) || (typeof data === 'string' ? data : 'An unexpected error occurred');
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (!err.status) {
      // Network or connection error
      const netError = new Error(err.message || 'Cannot connect to backend server. Make sure FastAPI is running on port 5000.');
      netError.status = 0;
      throw netError;
    }
    throw err;
  }
}
