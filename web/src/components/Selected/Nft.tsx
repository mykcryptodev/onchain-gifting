import { useMemo } from "react";
import { getContract } from "thirdweb";
import {
  NFTProvider,
  NFTMedia,
} from "thirdweb/react";
import { CHAIN, CLIENT } from "~/constants";
import { useGiftItems } from "~/contexts/GiftItemsContext";

export const Nft = ({ token, tokenId }: { token: string, tokenId: string }) => {
  const { removeERC721 } = useGiftItems();
  
  const contract = useMemo(() => getContract({
    address: token,
    chain: CHAIN,
    client: CLIENT,
  }), [token]);
  
  return (
    <NFTProvider contract={contract} tokenId={BigInt(tokenId)}>
      <div className="relative w-12 h-12">
        <div className="rounded-lg overflow-hidden">
          <NFTMedia
            className="w-12 h-12 hide-media"
            loadingComponent={<div className="w-12 h-12 bg-gray-100" />}
          />
        </div>
        <button
          onClick={() => removeERC721(token, tokenId)}
          className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
        >
          <span className="text-xs leading-none">&times;</span>
        </button>
      </div>
    </NFTProvider>
  )
};
