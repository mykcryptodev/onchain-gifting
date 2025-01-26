import { api } from "~/utils/api";
import { TokenOption } from "./Option/Token";
import { type FC, useState } from "react";
import { type WalletBalancesProps, type WalletBalancesResponse } from "~/types/zapper";
import { NftOption } from "./Option/Nft";
import useDebounce from "~/hooks/useDebounce";
import { isAddress } from "viem";
import { useGiftItems } from "~/contexts/GiftItemsContext";
import { toast } from "react-toastify";

export const WalletBalances: FC<WalletBalancesProps> = ({ address }) => {
  const [isTokenOpen, setIsTokenOpen] = useState(false);
  const [isNftOpen, setIsNftOpen] = useState(false);
  const [nftSearch, setNftSearch] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [nftContractAddress, setNftContractAddress] = useState("");
  const [nftTokenId, setNftTokenId] = useState("");
  const debouncedNftSearch = useDebounce(nftSearch, 500);
  const debouncedTokenAddress = useDebounce(tokenAddress, 500);

  const { data: customTokenData } = api.token.getCustomToken.useQuery(
    { tokenAddress: debouncedTokenAddress, userAddress: address },
    { 
      enabled: !!debouncedTokenAddress && isAddress(debouncedTokenAddress) && !!address,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

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

  const { addERC721 } = useGiftItems();

  const handleAddNft = () => {
    if (!isAddress(nftContractAddress) || !nftTokenId) return;
    
    addERC721(nftContractAddress, nftTokenId);
    toast.success('NFT added to gift pack');
    setNftContractAddress("");
    setNftTokenId("");
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
        <input
          type="text"
          placeholder="Enter token address..."
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
          className="w-full p-2 border rounded-lg mb-4"
        />
        {customTokenData && (
          <TokenOption key={customTokenData.address} option={customTokenData} />
        )}
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
        <div className="flex flex-col gap-4">
          <div className="border-b pb-4">
            <h3 className="text-sm font-medium mb-2">Add NFT Manually</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Contract Address"
                value={nftContractAddress}
                onChange={(e) => setNftContractAddress(e.target.value)}
                className="flex-1 p-2 text-sm border rounded-lg"
              />
              <input
                type="text"
                placeholder="Token ID"
                value={nftTokenId}
                onChange={(e) => setNftTokenId(e.target.value)}
                className="w-32 p-2 text-sm border rounded-lg"
              />
              <button
                onClick={handleAddNft}
                disabled={!isAddress(nftContractAddress) || !nftTokenId}
                className="px-3 py-1 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          </div>
        </div>
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
