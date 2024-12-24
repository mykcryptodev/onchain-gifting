
import { useEffect, useState } from "react";
import sdk, { type FrameContext } from "@farcaster/frame-sdk";

export default function Frame() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [, setContext] = useState<FrameContext>();
  useEffect(() => {
    const load = async () => {
      setContext(await sdk.context);
      void sdk.actions.ready({});
    };
    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
    }
  }, [isSDKLoaded]);

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return null;
}