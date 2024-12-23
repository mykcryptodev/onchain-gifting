import { type FC } from "react";
import { getContract } from "thirdweb";
import {
  NFTProvider,
  NFTMedia,
  NFTDescription,
  NFTName,
} from "thirdweb/react";
import { CHAIN, CLIENT } from "~/constants";

type Props = {
  tokenAddress: string;
  tokenId: string;
}

export const ClaimedNft: FC<Props> = ({ tokenAddress, tokenId }) => {
  const contract = getContract({
    client: CLIENT,
    chain: CHAIN,
    address: tokenAddress,
  });


  return (
    <div className="flex flex-col max-w-[300px] justify-center items-center">
      <NFTProvider contract={contract} tokenId={BigInt(tokenId)}>
        <NFTMedia className="h-24 w-24 rounded-lg" />
        <NFTName className="text-center" />
        <NFTDescription className="text-center" />
      </NFTProvider>
    </div>
  );
};