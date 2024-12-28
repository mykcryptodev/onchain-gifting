"use  client";
import { api } from "~/utils/api";
import { TokenOption } from "./Option/Token";
import { useAccount } from "wagmi";
import { type FC, useState } from "react";
import {
  type WalletBalancesProps,
  type WalletBalancesResponse,
} from "~/types/zapper";
import { NftOption } from "./Option/Nft";

export const WalletBalances: FC<WalletBalancesProps> = ({ address }) => {
  const [isTokenOpen, setIsTokenOpen] = useState(false);
  const [isNftOpen, setIsNftOpen] = useState(false);

  const { data, fetchNextPage } = api.wallet.getBalances.useInfiniteQuery(
    {
      address,
      nftsFirst: 12,
    },
    {
      enabled: !!address,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      getNextPageParam: (lastPage: WalletBalancesResponse) => {
        if (!lastPage.nftPageInfo?.hasNextPage) {
          return undefined;
        }
        return {
          nftsAfter: lastPage.nftPageInfo.endCursor,
        };
      },
    },
  );

  const allTokens = data?.pages[0]?.tokenBalances ?? [];
  const baseNameNfts = data?.pages.flatMap((page) => page.baseNameNfts) ?? [];
  const lastPage = data?.pages[data.pages.length - 1];

  const loadMoreNfts = () => {
    if (lastPage?.nftPageInfo?.hasNextPage) {
      void fetchNextPage();
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
      {/* Tokens */}
      <button
        onClick={() => setIsTokenOpen(!isTokenOpen)}
        className="flex w-full items-center gap-2"
      >
        <div
          className={`transform transition-transform ${isTokenOpen ? "rotate-90" : ""}`}
        >
          ▶
        </div>
        <h2 className="text-lg font-bold">Tokens</h2>
      </button>
      <div
        className={`content flex max-h-96 flex-col gap-4 overflow-y-auto rounded-lg p-4 transition-all duration-200 ${isTokenOpen ? "visible max-h-[500px] opacity-100" : "hidden max-h-0 overflow-hidden opacity-0"}`}
      >
        {allTokens.map((tokenBalance) => (
          <TokenOption
            key={`${tokenBalance.address}-${tokenBalance.token.baseToken.symbol}`}
            option={tokenBalance}
          />
        ))}
      </div>

      {/* NFTs */}
      <button
        onClick={() => setIsNftOpen(!isNftOpen)}
        className="flex w-full items-center gap-2"
      >
        <div
          className={`transform transition-transform ${isNftOpen ? "rotate-90" : ""}`}
        >
          ▶
        </div>
        <h2 className="text-lg font-bold">NFTs</h2>
      </button>
      <div
        className={`content grid max-h-96 grid-cols-2 place-items-center gap-4 overflow-y-auto rounded-lg p-4 transition-all duration-200 sm:grid-cols-3 ${isNftOpen ? "visible max-h-[500px] opacity-100" : "hidden max-h-0 overflow-hidden opacity-0"}`}
      >
        {baseNameNfts.map((nft) => (
          <NftOption key={nft.tokenId} nft={nft} />
        ))}
        {lastPage?.nftPageInfo?.hasNextPage && (
          <button
            onClick={loadMoreNfts}
            className="col-span-full mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Load More NFTs
          </button>
        )}
      </div>
    </div>
  );
};
