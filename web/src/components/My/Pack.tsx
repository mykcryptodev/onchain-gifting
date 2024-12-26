import { type FC, useEffect, useMemo, useState } from "react";
import { getContract } from "thirdweb";
import { CHAIN, CLIENT, GIFT_PACK_ADDRESS } from "~/constants";
import { type Pack } from "~/server/api/routers/pack";
import { getPack } from "~/thirdweb/8453/0x1b6e902360035ac523e27d8fe69140a271ab9e7c";
import { type Pack as GiftPack } from "~/types/giftpack";
import { ClaimContents } from "../Claim/Contents";
import { isAddressEqual, zeroAddress } from "viem";
import { Profile } from "../utils/Profile";
import { Reclaim } from "./Reclaim";

type Props = {
  tokenId: number;
  packMetadata: Pack;
  onReclaimed: () => void;
}

const Pack: FC<Props> = ({ tokenId, packMetadata, onReclaimed }) => {
  const contract = getContract({
    client: CLIENT,
    address: GIFT_PACK_ADDRESS,
    chain: CHAIN,
  });
  const [pack, setPack] = useState<GiftPack | null>(null);
  useEffect(() => {
    const fetchPack = async () => {
      const pack = await getPack({
        contract,
        tokenId: BigInt(tokenId),
      });
      setPack(pack);
    };
    void fetchPack();
  }, [tokenId, contract]);
  
  const isOpened = useMemo(() => {
    return !isAddressEqual(packMetadata?.opener, zeroAddress);
  }, [packMetadata.opener]);
  
  if (!pack) return null;

  return (
    <div className="flex flex-col w-full max-w-sm gap-2 sm:p-8 p-4 border border-gray-200 rounded-lg p-4 relative">
      <div className="flex flex-col w-full justify-center items-center gap-2">
        <div className="absolute top-6 right-6">
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${isOpened ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isOpened ? 'Opened' : 'Unopened'}
          </div>
        </div>
        <span className="text-lg font-bold">Pack ID #{packMetadata.id}</span>
        <ClaimContents pack={pack} hideHeader hideNftDetails />
      </div>
      {isOpened ? (
        <div className="flex flex-col w-full justify-center items-center gap-2">
          <div className="flex flex-row gap-2 items-start mt-4">
            <span className="text-sm text-gray-500">Opened by:</span>
            <Profile address={packMetadata.opener} />
          </div>
          <div className="flex flex-row gap-2 items-start">
            <span className="text-sm text-gray-500">Opened at:</span>
            <span className="text-sm">{new Date(Number(packMetadata.openedAtTimestamp) * 1000).toLocaleString(undefined, {
              dateStyle: 'short',
              timeStyle: 'short',
            })}</span>
          </div>
        </div>
      ) : (
        <div className="mt-4">
          <Reclaim tokenId={tokenId} onReclaimed={onReclaimed} />
        </div>
      )}
    </div>
  )
};

export default Pack;