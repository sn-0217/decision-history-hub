
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Custom hook for robust navigation management
 * Prevents navigation issues after state changes
 */
export const useRobustNavigation = () => {
  const navigate = useNavigate();

  const navigateWithCleanup = useCallback((path: string, options?: { replace?: boolean }) => {
    // Clear any pending timeouts or intervals that might interfere
    const highestTimeoutId = window.setTimeout(() => {}, 0);
    for (let i = 1; i < highestTimeoutId; i++) {
      window.clearTimeout(i);
    }

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      navigate(path, options);
    });
  }, [navigate]);

  const navigateHome = useCallback(() => {
    navigateWithCleanup('/', { replace: true });
  }, [navigateWithCleanup]);

  const navigateToSubmissions = useCallback(() => {
    navigateWithCleanup('/submissions');
  }, [navigateWithCleanup]);

  const navigateToAdmin = useCallback(() => {
    navigateWithCleanup('/admin');
  }, [navigateWithCleanup]);

  const navigateToApp = useCallback((appName: string) => {
    navigateWithCleanup(`/app/${encodeURIComponent(appName)}`);
  }, [navigateWithCleanup]);

  const navigateToSubmissionsWithSearch = useCallback((searchTerm: string) => {
    navigateWithCleanup(`/submissions?search=${encodeURIComponent(searchTerm)}`);
  }, [navigateWithCleanup]);

  return {
    navigate: navigateWithCleanup,
    navigateHome,
    navigateToSubmissions,
    navigateToAdmin,
    navigateToApp,
    navigateToSubmissionsWithSearch,
  };
};
