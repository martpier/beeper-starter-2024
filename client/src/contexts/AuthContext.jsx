import { createContext, useContext, useState, useEffect } from 'react';
import { apiCall, API_BASE } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await apiCall('/api/me');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else if (response.status === 401) {
          // Not authenticated - redirect to login
          window.location.href = `${API_BASE}/login`;
          return;
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        // On error, also redirect to login
        window.location.href = `${API_BASE}/login`;
        return;
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
