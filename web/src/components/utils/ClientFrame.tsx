'use client';

import { useEffect, useState } from "react";

export default function ClientFrame() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    const load = async () => {
      try {
        // Ensure we're in a browser environment before attempting to load the SDK
        if (typeof window !== 'undefined') {
          // Dynamically import everything
          const frameSDK = await import('@farcaster/frame-sdk');
          if (frameSDK?.default) {
            const sdk = frameSDK.default;
            await sdk.actions.ready({});
          }
        }
      } catch (err) {
        console.error('Failed to load Frame SDK:', err);
        setError(err instanceof Error ? err : new Error('Failed to load Frame SDK'));
      }
    };

    if (!isSDKLoaded) {
      setIsSDKLoaded(true);
      void load();
    }
  }, [isSDKLoaded]);

  // Don't render anything on the server
  if (typeof window === 'undefined') return null;

  if (error) {
    return null; // Silently fail if there's an error
  }

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return null;
} 