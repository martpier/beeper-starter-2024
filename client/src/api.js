// API base URL - use localhost:3000 directly (no proxy)
export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Helper function to make authenticated API calls
export async function apiCall(endpoint, options = {}, getAccessToken) {
  // Get access token from Auth0 (if getAccessToken function provided)
  let token = null;
  if (getAccessToken) {
    try {
      token = await getAccessToken();
    } catch (error) {
      console.error('Failed to get access token:', error);
      throw error;
    }
  }

  const headers = {
    ...options.headers,
  };

  // Add Authorization header if we have a token
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    // Using Bearer tokens now, not cookies
  });

  return response;
}
