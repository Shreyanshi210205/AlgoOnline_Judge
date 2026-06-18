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
  const [hasHydrated, setHasHydrated] = useState(false);

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

  // Hydrate on app mount only, not on every token change during login
  useEffect(() => {
    let isMounted = true;

    async function hydrate() {
      const storedToken = getStoredToken();
      
      if (!storedToken) {
        setIsHydrating(false);
        setHasHydrated(true);
        return;
      }

      // Token exists, set it in state for immediate use
      setToken(storedToken);

      try {
        const profile = await getProfile();
        if (!isMounted) {
          return;
        }
        setUser(profile.user);
        setStoredUser(profile.user);
      } catch {
        // If profile fetch fails, DON'T clear the token. User is still logged in.
        // Just clear user data and continue.
        setUser(null);
        // eslint-disable-next-line no-console
        console.debug('auth: profile hydration failed, but token preserved', {});
      } finally {
        if (isMounted) {
          setIsHydrating(false);
          setHasHydrated(true);
        }
      }
    }

    // Only hydrate on app mount
    if (!hasHydrated) {
      void hydrate();
    }

    return () => {
      isMounted = false;
    };
  }, [hasHydrated]);

  const login = async (payload: LoginPayload) => {
    const response = await loginUser(payload);
    // Persist to storage immediately
    setStoredToken(response.token);
    setStoredUser(response.user);
    // Update state—this triggers redirect via isAuthenticated
    setToken(response.token);
    setUser(response.user);
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
