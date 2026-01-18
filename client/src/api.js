// API base URL - empty for relative URLs (Vite proxy handles routing)
export const API_BASE = '';

// Helper function to make API calls with credentials
export async function apiCall(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    credentials: 'include', // Include cookies for Auth0 sessions
  });
  return response;
}
