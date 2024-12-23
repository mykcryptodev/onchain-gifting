import { type FC } from "react";
import { type Pack } from "~/types/giftpack";
import { ClaimedNft } from "./Nft";
import { ClaimedToken } from "./Token";
import { ZERO_ADDRESS } from "thirdweb";
import Image from "next/image";

type Props = {
  pack: Pack;
}
export const ClaimContents: FC<Props> = ({ pack }) => {
  return (
    <div>
      <Image
        src="/images/logo.png"
        alt="Logo"
        width={64}
        height={64}
        className="mx-auto mt-6"
      />
      <h2 className="text-2xl font-bold text-center mb-2">Your Pack Contents</h2>
      <div className="flex flex-col gap-4">
        {pack?.erc721Tokens.map((token) => (
          <ClaimedNft 
            key={`${token.tokenAddress}-${token.tokenId}`} 
            tokenAddress={token.tokenAddress}
            tokenId={token.tokenId.toString()} 
          />
        ))}
      </div>
      <div className={`flex-col gap-4 mt-4 ${pack?.erc20Tokens.length > 0 ? "flex" : "hidden"}`}>
        {pack?.erc20Tokens.map((token) => (
          <ClaimedToken key={token.tokenAddress} tokenAddress={token.tokenAddress} amount={token.amount.toString()} />
        ))}
      </div>
      <div className={`flex-col gap-4 mt-4 ${pack?.erc1155Tokens.length > 0 ? "flex" : "hidden"}`}>
        {pack?.erc1155Tokens.map((token) => (
          <ClaimedToken key={token.tokenAddress} tokenAddress={token.tokenAddress} amount={token.amount.toString()} />
        ))}
      </div>
      {pack?.ethAmount && (
        <div className="flex flex-col gap-4 mt-4">
          <ClaimedToken 
            tokenAddress={ZERO_ADDRESS} 
            amount={pack.ethAmount.toString()} 
          />
        </div>
        )}

    </div>
  );
};
