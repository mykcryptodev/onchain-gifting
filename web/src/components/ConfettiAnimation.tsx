"use client"

import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { usePathname } from 'next/navigation';

export default function ConfettiAnimation() {
const pathName = usePathname();
  return (
    <>
      {pathName === "/create" || pathName?.startsWith("/claim/") ? (
        <DotLottieReact
          src="https://lottie.host/731087cc-c82e-4420-8017-a9128ec0f44b/s7kpprOqyx.lottie"
          loop
          autoplay
          className="w-full h-full"
        />
      ) : null}
    </>
  );
}
