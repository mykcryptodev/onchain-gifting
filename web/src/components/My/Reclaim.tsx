import {
  Transaction,
  TransactionButton,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
  type LifecycleStatus 
} from "@coinbase/onchainkit/transaction"
import { useCallback, useMemo, type FC } from "react";
import { CLIENT } from "~/constants";
import { GIFT_PACK_ADDRESS } from "~/constants";
import { CHAIN } from "~/constants";
import { encode, getContract, ZERO_ADDRESS } from "thirdweb";
import { openPackAsOwner } from "~/thirdweb/8453/0x1b6e902360035ac523e27d8fe69140a271ab9e7c";
import { useAccount } from "wagmi";
import { toast } from "react-toastify";

type Props = {
  tokenId: number;
  onReclaimed: () => void;
}

export const Reclaim: FC<Props> = ({ tokenId, onReclaimed }) => {
  const { address } = useAccount();

  const handleOnStatus = useCallback((status: LifecycleStatus) => { 
    if (status.statusName === 'success') {
      toast.success('Gift pack items reclaimed!');
      onReclaimed();
    }
    if (status.statusName === 'error') {
      toast.error('Error reclaiming gift pack items');
    }
  }, [onReclaimed]); 

  const calls = useMemo(async () => {
    const tx = openPackAsOwner({
      contract: getContract({
        chain: CHAIN,
        address: GIFT_PACK_ADDRESS,
        client: CLIENT,
      }),
      tokenId: BigInt(tokenId),
      recipient: address ?? ZERO_ADDRESS,
    });
    return [
      {
        to: tx.to as `0x${string}`,
        value: BigInt(0),
        data: await encode(tx),
      }
    ]
  }, [tokenId, address]);

  return (
    <Transaction
      calls={calls}
      isSponsored
      onStatus={handleOnStatus}
    >
      <TransactionButton 
        text="Reclaim Gift Pack"
        className="px-2 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
      />
      <TransactionStatus>
        <TransactionStatusLabel />
        <TransactionStatusAction />
      </TransactionStatus>
    </Transaction>
  )
}