import { apiClient } from '../api/client';
import type {
  AuthLoginResponse,
  AuthProfileResponse,
  LoginPayload,
  RegisterPayload,
} from '../types';

export async function registerUser(payload: RegisterPayload) {
  const { data } = await apiClient.post<{ data: unknown }>('/api/auth/register', payload);
  return data;
}

export async function loginUser(payload: LoginPayload) {
  const { data } = await apiClient.post<{ data: AuthLoginResponse }>('/api/auth/login', payload);
  return data.data;
}

export async function getProfile() {
  const { data } = await apiClient.get<{ data: AuthProfileResponse }>('/api/auth/profile');
  return data.data;
}
