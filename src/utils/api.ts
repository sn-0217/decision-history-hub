// API utility functions with authentication support

/**
 * Get authentication headers from session storage
 */
const getAuthHeaders = (): HeadersInit => {
  const auth = sessionStorage.getItem('auth');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  if (auth) {
    headers['Authorization'] = `Basic ${auth}`;
  }
  
  return headers;
};

/**
 * Make an authenticated API call
 */
export const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  const authHeaders = getAuthHeaders();
  
  const fetchOptions: RequestInit = {
    ...options,
    headers: {
      ...authHeaders,
      ...options.headers,
    },
    credentials: 'include',
  };
  
  const response = await fetch(url, fetchOptions);
  
  if (response.status === 401) {
    // Clear invalid auth and redirect to login
    sessionStorage.removeItem('auth');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('username');
    window.location.href = '/';
    throw new Error('Authentication required');
  }
  
  return response;
};

/**
 * Make a public API call (no authentication required)
 */
export const publicFetch = async (url: string, options: RequestInit = {}) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
  };
  
  return fetch(url, {
    ...options,
    headers,
  });
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!sessionStorage.getItem('auth');
};

/**
 * Get current user info
 */
export const getCurrentUser = () => {
  return {
    username: sessionStorage.getItem('username'),
    role: sessionStorage.getItem('userRole'),
    isAdmin: sessionStorage.getItem('userRole') === 'ADMIN',
  };
};
