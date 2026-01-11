// API base URL - can be changed for production
export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Helper function to make API calls with credentials
export async function apiCall(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    credentials: 'include', // Include cookies for Auth0 sessions
  });
  return response;
}
