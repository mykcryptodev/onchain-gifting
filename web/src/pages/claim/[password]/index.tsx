import { Avatar, Name } from "@coinbase/onchainkit/identity";
import { useCallback, useEffect } from "react";
import { useState } from "react";
import { getContract } from "thirdweb";
import { CLIENT, GIFT_PACK_ADDRESS } from "~/constants";
import { CHAIN } from "~/constants";
import { getPackByHash } from "~/thirdweb/8453/0x1b6e902360035ac523e27d8fe69140a271ab9e7c";
import { type Pack } from "~/types/giftpack";
import { useRouter } from "next/router";
import { Open } from "~/components/Claim/Open";
import { keccak256 as viemKeccak256, encodeAbiParameters } from "viem";
import { WatchClaim } from "~/components/Claim/WatchClaim";
import {
  AccountProvider,
  AccountAvatar,
  AccountName,
} from "thirdweb/react";
import { ClaimContents } from "~/components/Claim/Contents";

export default function Claim() {
  const router = useRouter();
  const { password } = router.query as { password: string };
  const [pack, setPack] = useState<Pack | null>(null);
  const [claimingIsFinished, setClaimingIsFinished] = useState(false);

  const fetchPack = useCallback(async () => {
    if (pack || !password) return;
    const encodedPassword = encodeAbiParameters(
      [{ type: 'string' }],
      [password]
    );
    const hash = viemKeccak256(encodedPassword);
    const fetchedPack = await getPackByHash({
      contract: getContract({
        address: GIFT_PACK_ADDRESS,
        chain: CHAIN,
        client: CLIENT,
      }),
      hash,
    });
    setPack(fetchedPack);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password]);

  useEffect(() => {
    if (!fetchPack) return;
    void fetchPack();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchPack]);

  console.log({pack});

  if (!pack) return null;

  return (
    <div className="flex flex-col gap-2 justify-center items-center">
      <h1 className="text-2xl font-bold mb-4 text-center">Claim Your Gift Pack</h1>
      <p>You have been sent an onchain gift pack from</p>
      {pack?.creator && (
        <div className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-md">
          <AccountProvider
            client={CLIENT}
            address={pack.creator}
          >
            <AccountAvatar 
              width={40}
              height={40}
              className="rounded-full"
              loadingComponent={
                <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
              }
              fallbackComponent={
                <Avatar
                  address={pack.creator}
                  chain={CHAIN}
                  className="rounded-full h-10 w-10"
                />
              }
            />
            <AccountName
              loadingComponent={
                <div className="h-6 w-24 rounded-lg bg-gray-200 animate-pulse" />
              }
              fallbackComponent={
                <Name
                  address={pack.creator}
                  chain={CHAIN}
                />
              }
            />
          </AccountProvider>
        </div>
      )}
      <p>They said...</p>
      <p className="text-lg font-bold">{password}</p>
      {pack?.opened ? (
        <ClaimContents pack={pack} />
      ) : (
        <>
          <Open 
            password={password} 
            key={claimingIsFinished ? "finished" : "not-finished"}
          />
          <WatchClaim onClaim={(id) => {
            console.log({gotClaim:true, id});
            void fetchPack();
            setClaimingIsFinished(true);
          }} />
        </>
      )}
    </div>
  );
}
