import { type FC } from "react";
import { getContract } from "thirdweb";
import { NFTMedia, NFTProvider } from "thirdweb/react";
import { CHAIN, CLIENT, GIFT_PACK_ADDRESS } from "~/constants";

export const UnwrappingAnimation: FC = () => {
  const contract = getContract({
    chain: CHAIN,
    address: GIFT_PACK_ADDRESS,
    client: CLIENT,
  });

  return (
    <div className="rounded-lg overflow-hidden">
      <NFTProvider contract={contract} tokenId={BigInt(0)}>
        <NFTMedia
          className="hide-media"
          mediaResolver={{
            src: "ipfs://QmcivSSPBRiRarvdnDy6giB8imCUZg1kXoosrhDE8kJoi3/gift2.mp4",
            // Poster is applicable to medias that are videos and audios
            poster: "/images/logo.png",
          }}
        />
      </NFTProvider>
    </div>
  );
};