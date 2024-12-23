import { useMemo } from "react";
import { TransactionButton } from "thirdweb/react";
import { getContract } from "thirdweb";
import { CHAIN, CHRISTMAS_PACK_ADDRESS, CLIENT } from "~/constants";
import { createPack } from "~/thirdweb/84532/0xa9dc74673fb099885e830eb534b89e65dd5a68f6";

type Props = {
  erc20s: { token: string; amount: string }[];
  erc721s: { token: string; tokenId: string }[];
  erc1155s: { token: string; tokenId: string; amount: string }[];
  ethAmount: string;
};

export function CreateGiftPack({ erc20s, erc721s, erc1155s, ethAmount }: Props) {
  const transaction = useMemo(() => {
    return createPack({
      contract: getContract({
        chain: CHAIN,
        address: CHRISTMAS_PACK_ADDRESS,
        client: CLIENT,
      }),
      erc20Tokens: erc20s.map(({ token, amount }) => ({
        tokenAddress: token,
        amount: BigInt(amount),
      })),
      erc721Tokens: erc721s.map(({ token, tokenId }) => ({
        tokenAddress: token,
        tokenId: BigInt(tokenId),
      })),
      erc1155Tokens: erc1155s.map(({ token, tokenId, amount }) => ({
        tokenAddress: token,
        tokenId: BigInt(tokenId),
        amount: BigInt(amount),
      }))
    })
  }, [erc20s, erc721s, erc1155s]);

  return (
    <div className="p-4 flex flex-col items-center justify-center">
      <TransactionButton
        transaction={() => {
          const tx = {...transaction};
          tx.value = BigInt(ethAmount);
          return tx;
        }}
      >
        Create Gift Pack
      </TransactionButton>
    </div>
  );
} 