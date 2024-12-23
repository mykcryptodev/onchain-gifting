import { useMemo, type FC } from "react";
import { getContract, encode } from "thirdweb";
import { CHAIN, CLIENT, GIFT_PACK_ADDRESS } from "~/constants";
import { openPack } from "~/thirdweb/84532/0xa9dc74673fb099885e830eb534b89e65dd5a68f6";
import { useAccount } from "wagmi";
import { Transaction, TransactionButton, TransactionStatus, TransactionStatusAction, TransactionStatusLabel } from "@coinbase/onchainkit/transaction";

type Props = {
  id: string;
}
export const Open: FC<Props> = ({ id }) => {
  const { address } = useAccount();

  const calls = useMemo(async () => {
    if (!address) return [];
    const tx = openPack({
      contract: getContract({
        address: GIFT_PACK_ADDRESS,
        client: CLIENT,
        chain: CHAIN,
      }),
      tokenId: BigInt(id as string),
      recipient: address!,
    });
    return [{
      to: GIFT_PACK_ADDRESS as `0x${string}`,
      data: await encode(tx),
    }]
  }, [id, address]);
  
  return (
    <div className="flex justify-center mx-auto max-w-sm">
      <Transaction
        calls={calls}
        isSponsored
      >
        <TransactionButton 
          text="Open Gift Pack"
          className="px-4 py-2 text-lg font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 w-fit mx-auto disabled:bg-gray-400"
        />
        <TransactionStatus>
          <TransactionStatusLabel />
          <TransactionStatusAction />
        </TransactionStatus>
      </Transaction>
    </div>
  );
};
