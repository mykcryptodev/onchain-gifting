import { type FC, useState } from "react";

export const ImageWithFallback: FC<{ url: string; alt: string }> = ({ url, alt }) => {
  const [imgSrc, setImgSrc] = useState(url);
  const [error, setError] = useState(false);

  const handleError = () => {
    if (!error) {
      // Try using an IPFS gateway if it's an IPFS URL
      if (imgSrc.startsWith('ipfs://')) {
        setImgSrc(imgSrc.replace('ipfs://', 'https://ipfs.io/ipfs/'));
      } else {
        // For other URLs, try using a proxy service
        setImgSrc(`https://images.weserv.nl/?url=${encodeURIComponent(url)}`);
      }
      setError(true);
    }
  };

  return (
    <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-gray-100">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imgSrc}
        alt={alt}
        onError={handleError}
        className="w-full h-full object-cover"
      />
    </div>
  );
};
