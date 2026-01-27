import { useAuth0 } from '@auth0/auth0-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function useAuthenticatedFetch() {
  const { getAccessTokenSilently } = useAuth0();


  return async (endpoint, options = {}) => {
    const token = await getAccessTokenSilently();

    return fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
      },
    });
  };
}
