/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { getProfile, loginUser, registerUser } from '../services/auth.service';
import type { AuthLoginResponse, AuthProfileResponse, AuthUser, LoginPayload, RegisterPayload } from '../types';
import { getStoredToken, getStoredUser, setStoredToken, setStoredUser } from '../utils/storage';

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isHydrating: boolean;
  login: (payload: LoginPayload) => Promise<AuthLoginResponse>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<AuthProfileResponse | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(getStoredUser());
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    const handleLogout = () => {
      setUser(null);
      setToken(null);
      setStoredToken(null);
      setStoredUser(null);
    };

    window.addEventListener('oj:logout', handleLogout);
    return () => window.removeEventListener('oj:logout', handleLogout);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function hydrate() {
      if (!token) {
        setIsHydrating(false);
        return;
      }

      try {
        const profile = await getProfile();
        if (!isMounted) {
          return;
        }
        setUser(profile.user);
        setStoredUser(profile.user);
      } catch {
        setUser(null);
        setToken(null);
        setStoredToken(null);
        setStoredUser(null);
      } finally {
        if (isMounted) {
          setIsHydrating(false);
        }
      }
    }

    void hydrate();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const login = async (payload: LoginPayload) => {
    const response = await loginUser(payload);
    setToken(response.token);
    setStoredToken(response.token);
    setUser(response.user);
    setStoredUser(response.user);
    return response;
  };

  const register = async (payload: RegisterPayload) => {
    await registerUser(payload);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setStoredToken(null);
    setStoredUser(null);
  };

  const refreshProfile = async () => {
    if (!token) {
      return null;
    }

    const profile = await getProfile();
    setUser(profile.user);
    setStoredUser(profile.user);
    return profile;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token),
        isHydrating,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}
