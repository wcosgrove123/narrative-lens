import { useEffect, useState } from 'react';

/**
 * Hook to convert a Blob to an Object URL for rendering
 * Automatically cleans up the URL when component unmounts
 * Also handles legacy base64 strings for backward compatibility
 */
export function usePhotoUrl(blob: Blob | string | undefined): string | undefined {
  const [url, setUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!blob) {
      setUrl(undefined);
      return;
    }

    // Handle legacy base64 strings (backward compatibility)
    if (typeof blob === 'string') {
      setUrl(blob);
      return;
    }

    // Create Object URL from Blob
    const objectUrl = URL.createObjectURL(blob);
    setUrl(objectUrl);

    // Cleanup: Revoke the URL when component unmounts or blob changes
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [blob]);

  return url;
}
