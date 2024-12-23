import { api } from "~/utils/api";
import { TokenOption } from "./TokenOption";
import { type FC, useState } from "react";
import { type WalletBalancesProps } from "~/types/zapper";
import { NftOption } from "./NftOption";

export const WalletBalances: FC<WalletBalancesProps> = ({ address }) => {
  const [isTokenOpen, setIsTokenOpen] = useState(false);
  const [isNftOpen, setIsNftOpen] = useState(false);
  const { data, isLoading } = api.wallet.getBalances.useQuery({ address }, {
    enabled: !!address,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  console.log({data, isLoading});

  return (
    <div className="flex flex-col gap-4 w-full mx-auto max-w-lg">
      {/* Tokens */}
      <button 
        onClick={() => setIsTokenOpen(!isTokenOpen)}
        className="flex items-center gap-2 w-full"
      >
        <div className={`transform transition-transform ${isTokenOpen ? 'rotate-90' : ''}`}>
          ▶
        </div>
        <h2 className="text-lg font-bold">Tokens</h2>
      </button>
      <div className={`max-h-96 p-4 rounded-lg overflow-y-auto flex flex-col gap-4 content transition-all duration-200 ${isTokenOpen ? 'max-h-[500px] opacity-100 visible' : 'max-h-0 opacity-0 overflow-hidden hidden'}`}>
        {data?.tokenBalances.filter((tokenBalance) => tokenBalance.token.balanceUSD > 0.01).map((tokenBalance) => {
          return <TokenOption key={`${tokenBalance.address}-${tokenBalance.token.baseToken.symbol}`} option={tokenBalance} />
        })}
      </div>

      {/* NFTs */}
      <button 
        onClick={() => setIsNftOpen(!isNftOpen)}
        className="flex items-center gap-2 w-full"
      >
        <div className={`transform transition-transform ${isNftOpen ? 'rotate-90' : ''}`}>
          ▶
        </div>
        <h2 className="text-lg font-bold">NFTs</h2>
      </button>
      <div className={`max-h-96 p-4 rounded-lg overflow-y-auto grid grid-cols-2 sm:grid-cols-3 place-items-center gap-4 content transition-all duration-200 ${isNftOpen ? 'max-h-[500px] opacity-100 visible' : 'max-h-0 opacity-0 overflow-hidden hidden'}`}>
        {data?.nfts.map((nft) => {
          return (
            <NftOption key={nft.tokenId} nft={nft} />
          )
        })}
      </div>
    </div>
  )
};
