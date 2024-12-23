import { type FC } from "react";
import { GIFT_PACK_ADDRESS } from "~/constants";
import { watchContractEvent } from '@wagmi/core'
import { getConfig } from "~/constants/wagmi";
import { isAddress } from "thirdweb";
import { useAccount } from "wagmi";
import { isAddressEqual, zeroAddress } from "viem";

type Prop = {
  onClaim: (tokenId: string) => void;
}
export const WatchClaim: FC<Prop> = ({ onClaim }) => {
  const { address } = useAccount();
  const wagmiConfig = getConfig();
  const unwatch = watchContractEvent(wagmiConfig, {
    address: GIFT_PACK_ADDRESS,
    abi: [
      {
        name: 'PackOpened',
        inputs: [
          {
            name: 'tokenId',
            type: 'uint256',
            indexed: true,
          },
          {
            name: 'opener',
            type: 'address',
            indexed: true,
          }
        ],
        type: 'event',
      },
    ],
    eventName: 'PackOpened',
    // if the pack is opened by the user, unwatch and call onClaim
    onLogs(logs) {
      console.log({ logs });
      if (
        logs[0]?.args.opener && 
        isAddress(logs[0].args.opener) && 
        isAddress(address ?? '') &&
        isAddressEqual(logs[0].args.opener, address ?? zeroAddress)
      ) {
        unwatch?.();
        const tokenId = logs[0].args.tokenId?.toString();
        if (tokenId) {
          onClaim(tokenId);
        }
      }
    },
    pollingInterval: 1_000, 
  });
  return null;
}
