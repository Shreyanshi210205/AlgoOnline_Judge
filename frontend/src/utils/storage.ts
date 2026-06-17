import { AUTH_TOKEN_KEY, AUTH_USER_KEY, THEME_KEY } from '../constants';
import type { AuthUser } from '../types';

export function getStoredToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    return;
  }
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function getStoredUser() {
  const serialized = localStorage.getItem(AUTH_USER_KEY);
  if (!serialized) {
    return null;
  }

  try {
    return JSON.parse(serialized) as AuthUser;
  } catch {
    return null;
  }
}

export function setStoredUser(user: AuthUser | null) {
  if (user) {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    return;
  }
  localStorage.removeItem(AUTH_USER_KEY);
}

export function getStoredTheme() {
  return (localStorage.getItem(THEME_KEY) as 'dark' | 'light' | null) || 'dark';
}

export function setStoredTheme(theme: 'dark' | 'light') {
  localStorage.setItem(THEME_KEY, theme);
}
