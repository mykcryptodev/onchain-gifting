import { type FC, useState } from "react";
import { UNKNOWN_TOKEN_IMAGE } from "~/constants";
import { type ZapperTokenBalance } from "~/types/zapper";
import Image from "next/image";

export const TokenOption: FC<{ option: ZapperTokenBalance }> = ({ option }) => {
  const [image, setImage] = useState(option.token.baseToken.imgUrl);

  return (
    <div key={option.address} className="flex justify-between gap-2">
      <div className="flex items-start gap-2">
        <Image 
          src={image} 
          alt={option.token.baseToken.symbol} 
          width={16} 
          height={16}
          onError={() => {
            setImage(UNKNOWN_TOKEN_IMAGE);
          }}
          className="w-4 h-4 rounded-full mt-1"
        />
        <div className="flex flex-col">
          <span>{option.token.baseToken.name}</span>
          <span className="text-sm opacity-50">{option.token.baseToken.symbol}</span>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span>
          {Number(option.token.balance).toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 4,
          })}
        </span>
        <span className="text-sm opacity-50">
          {option.token.balanceUSD.toLocaleString(undefined, {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>
    </div>
  )
}