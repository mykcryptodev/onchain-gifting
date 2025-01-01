import { api } from "~/utils/api";
import { TokenOption } from "./Option/Token";
import { type FC, useState } from "react";
import { type WalletBalancesProps, type WalletBalancesResponse } from "~/types/zapper";
import { NftOption } from "./Option/Nft";
import useDebounce from "~/hooks/useDebounce";

export const WalletBalances: FC<WalletBalancesProps> = ({ address }) => {
  const [isTokenOpen, setIsTokenOpen] = useState(false);
  const [isNftOpen, setIsNftOpen] = useState(false);
  const [nftSearch, setNftSearch] = useState("");
  const debouncedNftSearch = useDebounce(nftSearch, 500);

  const { data, isLoading, fetchNextPage } = api.wallet.getBalances.useInfiniteQuery(
    { 
      address,
      nftsFirst: 12,
      search: debouncedNftSearch ?? undefined,
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
    }
  );

  const allTokens = data?.pages[0]?.tokenBalances ?? [];
  const allNfts = data?.pages.flatMap(page => page.nfts) ?? [];
  const lastPage = data?.pages[data.pages.length - 1];

  const loadMoreNfts = () => {
    if (lastPage?.nftPageInfo?.hasNextPage) {
      void fetchNextPage();
    }
  };

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
        {allTokens.map((tokenBalance) => (
          <TokenOption key={`${tokenBalance.address}-${tokenBalance.token.baseToken.symbol}`} option={tokenBalance} />
        ))}
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
      <div className={`max-h-96 p-4 rounded-lg overflow-y-auto flex flex-col gap-4 content transition-all duration-200 ${isNftOpen ? 'max-h-[500px] opacity-100 visible' : 'max-h-0 opacity-0 overflow-hidden hidden'}`}>
        <input
          type="text"
          placeholder="Search NFTs..."
          value={nftSearch}
          onChange={(e) => setNftSearch(e.target.value)}
          className="w-full p-2 border rounded-lg mb-4"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 place-items-center gap-4">
          {allNfts.map((nft) => (
            <NftOption key={nft.tokenId} nft={nft} />
          ))}
          {isLoading && (
            Array.from({ length: 6 }).map((_, index: number) => (
              <div key={index} className="aspect-square w-full animate-pulse bg-gray-300 rounded-lg"></div>
            ))
          )}
          {lastPage?.nftPageInfo?.hasNextPage && (
            <button
              onClick={loadMoreNfts}
              className="col-span-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Load More NFTs
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
