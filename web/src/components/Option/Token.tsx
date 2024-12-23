import { type FC, useState } from "react";
import { type ZapperTokenBalance } from "~/types/zapper";
import { AddTokenModal } from "../modals/AddTokenModal";
import { useGiftItems } from "~/contexts/GiftItemsContext";
import Image from "next/image";
import { UNKNOWN_TOKEN_IMAGE } from "~/constants";

interface TokenOptionProps {
  option: ZapperTokenBalance;
}

export const TokenOption: FC<TokenOptionProps> = ({ option }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { selectedAssets, removeERC20 } = useGiftItems();
  const isSelected = selectedAssets.erc20.some(token => 
    token.token === option.token.baseToken.address
  );

  const formatBalance = (value: string) => {
    const num = parseFloat(value);
    if (num < 0.01) {
      const str = num.toString();
      const pattern = /^0\.0*[1-9]/;
      const match = pattern.exec(str);
      if (match) {
        return num.toFixed(match[0].length - 2);
      }
    }
    return num.toLocaleString();
  };

  return (
    <>
      <div className="flex items-center justify-between w-full rounded-lg">
        <div className="flex items-center gap-2">
          {option.token.baseToken.imgUrl && (
            <Image
              src={option.token.baseToken.imgUrl}
              alt={option.token.baseToken.symbol}
              className="w-8 h-8 rounded-full"
              width={32}
              height={32}
              onError={() => {
                option.token.baseToken.imgUrl = UNKNOWN_TOKEN_IMAGE;
              }}
            />
          )}
          <div>
            <p className="font-medium">{option.token.baseToken.symbol}</p>
            <p className="text-sm text-gray-500">{option.token.baseToken.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-medium">
              {formatBalance(option.token.balance)}
            </p>
            <p className="text-sm text-gray-500">
              {option.token.balanceUSD.toLocaleString(undefined, { 
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
          {isSelected ? (
            <button
              onClick={() => removeERC20(option.token.baseToken.address)}
              className="px-3 py-1 text-sm font-medium text-red-600 border border-red-600 rounded-md hover:bg-red-50"
            >
              Remove
            </button>
          ) : (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-3 py-1 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
            >
              Add
            </button>
          )}
        </div>
      </div>
      {isModalOpen && (
        <AddTokenModal
          key={option.token.baseToken.address}
          token={option}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};