import { useMemo, type FC } from "react";
import { getContract, encode } from "thirdweb";
import { CHAIN, CLIENT, GIFT_PACK_ADDRESS } from "~/constants";
import { openPack } from "~/thirdweb/84532/0xa9dc74673fb099885e830eb534b89e65dd5a68f6";
import { useAccount } from "wagmi";
import { Transaction, TransactionButton, TransactionStatus, TransactionStatusAction, TransactionStatusLabel } from "@coinbase/onchainkit/transaction";
import { api } from "~/utils/api";
import { WatchClaim } from "./WatchClaim";

type Props = {
  id: string;
}
export const Open: FC<Props> = ({ id }) => {
  const { address } = useAccount();
  const { mutateAsync: open, isPending } = api.engine.openPack.useMutation();

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

  const handleOpenPack = async () => {
    const result = await open({
      secret: id,
      recipient: address!,
    });
    console.log({result});
  }

  return (
    <div className="flex flex-col gap-2 justify-center mx-auto max-w-sm">
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
      <button onClick={() => handleOpenPack()}>
        {isPending && (
          <div className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Opening...
          </div>
        )}
        {!isPending && "Open Pack"}
      </button>
      <WatchClaim onClaim={(id) => {
        console.log({gotClaim:true, id});
      }} />
    </div>
  );
};
