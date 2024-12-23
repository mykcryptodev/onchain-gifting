import { useMemo, type FC } from "react";
import { useGiftItems } from "~/contexts/GiftItemsContext";
import { type ZapperNFT } from "~/types/zapper";
import { ImageWithFallback } from "../utils/ImageWithFallback";

interface NftOptionProps {
  nft: ZapperNFT;
}

export const NftOption: FC<NftOptionProps> = ({ nft }) => {
  const imageUrl = nft.mediasV2[0]?.url;
  const { addERC721, removeERC721, selectedAssets } = useGiftItems();
  const assetIsSelected = useMemo(() => {
    const asset = selectedAssets.erc721.find((erc721) => 
      erc721.token === nft.collection.address && erc721.tokenId === nft.tokenId
    );
    return !!asset;
  }, [selectedAssets, nft]);

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
        
        {assetIsSelected ? (
          <button 
            className="mt-1 px-3 py-1 text-xs font-medium text-red-600 border border-red-600 rounded-md hover:bg-red-50 w-full text-center"
            onClick={() => {
              removeERC721(
                nft.collection.address,
                nft.tokenId,
              );
            }}
          >
            Remove
          </button>
        ) : (
          <button 
            className="mt-1 px-3 py-1 text-xs font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 w-full text-center"
            onClick={() => {
              addERC721(
                nft.collection.address,
                nft.tokenId,
                nft.estimatedValue?.valueUsd,
              );
            }}
          >
            Add
          </button>
        )}
      </div>
    </div>
  );
};