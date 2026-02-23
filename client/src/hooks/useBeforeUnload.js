import { useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';

const useBeforeUnload = (lectureId) => {
  const { backendUrl } = useAppContext();

  useEffect(() => {
    if (!lectureId) return;

    const handleBeforeUnload = () => {
      // Use sendBeacon for reliable request on page unload
      const url = `${backendUrl}/api/lectures/${lectureId}/leave`;

      // Note: sendBeacon sends a POST request. 
      // We need to ensure credentials are sent if your backend relies on cookies.
      // sendBeacon automatically sends cookies for same-origin or CORS if configured.
      // If using Bearer tokens, sendBeacon is harder. 
      // Assuming Cookie-based auth here based on "withCredentials" usage elsewhere.

      navigator.sendBeacon(url);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [lectureId, backendUrl]);
};

export default useBeforeUnload;