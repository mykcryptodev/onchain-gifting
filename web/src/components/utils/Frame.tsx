import { useEffect, useState } from "react";
import sdk, { type FrameContext } from "@farcaster/frame-sdk";

export default function Frame() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [, setContext] = useState<FrameContext>();

  useEffect(() => {
    const load = async () => {
      try {
        const context = await sdk.context;
        setContext(context);
        await sdk.actions.ready({});
      } catch (error) {
        console.error('Failed to load Frame SDK:', error);
      }
    };

    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      void load();
    }
  }, [isSDKLoaded]);

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return null;
}