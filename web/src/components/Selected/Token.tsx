import { type FC } from "react";
import { useGiftItems } from "~/contexts/GiftItemsContext";
import Image from "next/image";
import { UNKNOWN_TOKEN_IMAGE } from "~/constants";
import { toTokens } from "thirdweb";
import { round } from "~/helpers/round";

type Props = {
  token: string;
};
export const SelectedToken: FC<Props> = ({ token }) => {
  const { selectedAssets, removeERC20 } = useGiftItems();
  const tokenData = selectedAssets.erc20.find(t => t.token === token);
  return (
    <div className="relative flex items-center justify-between rounded-lg mx-4"> 
      <div className="flex items-start gap-2">
        <Image 
          src={tokenData?.imageUrl ?? UNKNOWN_TOKEN_IMAGE} 
          alt={tokenData?.name ?? "Unknown Token"} 
          width={24} 
          height={24} 
          className="rounded-full mt-1"
        />
        <div className="flex flex-col">
          <span className="text-sm font-medium">{tokenData?.symbol}</span>
          <span className="text-xs text-gray-500">
            {round(
              parseFloat(
                toTokens(
                  BigInt(tokenData?.amount ?? "0"), 
                  tokenData?.decimals ?? 18
                ).toString()
              )
            )}
          </span>
        </div>
      </div>
      <button
        onClick={() => removeERC20(token)}
        className="absolute -top-2 -right-5 w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
      >
        <span className="text-xs leading-none">&times;</span>
      </button>
    </div>
  );
};
