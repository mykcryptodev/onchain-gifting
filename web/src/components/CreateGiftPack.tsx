import { useMemo, useState } from "react";
import { TransactionButton } from "thirdweb/react";
import { getContract } from "thirdweb";
import { CHAIN, CHRISTMAS_PACK_ADDRESS, CLIENT } from "~/constants";
import { createPack } from "~/thirdweb/84532/0xfcedd91b776beff7abd417cdeaf83cbcc8cbffa2";

export function CreateGiftPack() {
  const [selectedAssets, setSelectedAssets] = useState({
    erc20: [] as { token: string; amount: string }[],
    erc721: [] as { token: string; tokenId: string }[],
    erc1155: [] as { token: string; tokenId: string; amount: string }[]
  });

  const transaction = useMemo(() => {
    return createPack({
      contract: getContract({
        chain: CHAIN,
        address: CHRISTMAS_PACK_ADDRESS,
        client: CLIENT,
      }),
      erc20Assets: selectedAssets.erc20.map(({ token, amount }) => ({
        token,
        amount: BigInt(amount),
      })),
      erc721Assets: selectedAssets.erc721.map(({ token, tokenId }) => ({
        token,
        tokenId: BigInt(tokenId),
      })),
      erc1155Assets: selectedAssets.erc1155.map(({ token, tokenId, amount }) => ({
        token,
        tokenId: BigInt(tokenId),
        amount: BigInt(amount),
      })),
    })
  }, [selectedAssets]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Create a Gift Pack</h1>
      
      {/* Asset Selection UI will go here */}
      
      <TransactionButton
        transaction={() => transaction}
      >
        Create Gift Pack
      </TransactionButton>
    </div>
  );
} 