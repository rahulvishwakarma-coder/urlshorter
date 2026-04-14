import { useState, useEffect } from 'react';
import axios from 'axios';
import type { User } from '../types';
import { API_BASE_URL } from '../constants';

axios.defaults.withCredentials = true;

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get<{ success: boolean; user: User }>(
          `${API_BASE_URL}/api/auth/v1/me`
        );
        if (response.data.success) setUser(response.data.user);
      } catch (err) {
        console.log('No active session', err);
      }
    };
    fetchProfile();
  }, []);

  const login = (userData: User) => setUser(userData);

  const logout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/auth/v1/logout`);
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      setUser(null);
    }
  };

  const incrementTokens = () => {
    if (user) setUser({ ...user, tokensUsed: user.tokensUsed + 1 });
  };

  return { user, login, logout, incrementTokens };
}