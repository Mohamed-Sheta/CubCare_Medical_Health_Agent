// Form validation rules
export const Validators = {
  isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  },

  isValidPassword(password) {
    return typeof password === 'string' && password.length >= 6;
  },

  isValidUsername(username) {
    return typeof username === 'string' && username.trim().length >= 3;
  },

  isValidProjectName(name) {
    // Project names are used in URL paths: lowercase letters, numbers, hyphens, underscores
    const re = /^[a-zA-Z0-9_-]{3,50}$/;
    return re.test(String(name).trim());
  }
};
