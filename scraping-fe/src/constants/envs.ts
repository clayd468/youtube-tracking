export const BASE_URL =
  import.meta.env.REACT_APP_BASE_URL || "http://localhost:8888";
export const API_URL = `${BASE_URL}/api/v1`;

// Auth
export const AUTH_LOGIN_URL = `${API_URL}/auth/login`;
export const AUTH_REGISTER_URL = `${API_URL}/auth/register`;

// User
export const USER_URL = `${API_URL}/users`;
export const USER_ME_URL = `${API_URL}/users/me`;

// Media
export const MEDIA_URL = `${API_URL}/media`;

// Scraping
export const SCRAP_URL = `${API_URL}/scraping`;
