import { useState, type FC } from "react";
import { type ZapperNFT } from "~/types/zapper";

interface NftOptionProps {
  nft: ZapperNFT;
}

const ImageWithFallback: FC<{ url: string; alt: string }> = ({ url, alt }) => {
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

export const NftOption: FC<NftOptionProps> = ({ nft }) => {
  const imageUrl = nft.mediasV2[0]?.url;

  return (
    <div className="flex flex-col gap-2 w-full max-w-[200px]">
      {imageUrl ? (
        <ImageWithFallback url={imageUrl} alt={nft.name} />
      ) : (
        <div className="bg-gray-100 h-full w-full relative aspect-square rounded-lg overflow-hidden" />
      )}
      <div className="w-full">
        <p className="text-sm font-medium truncate" title={nft.name}>
          {nft.name}
        </p>
        <p className="text-xs text-gray-500 truncate" title={nft.collection.name}>
          {nft.collection.name}
        </p>
        {nft.estimatedValue?.valueUsd && (
          <p className="text-xs text-gray-500">
            {nft.estimatedValue.valueUsd.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            })}
          </p>
        )}
      </div>
    </div>
  );
};