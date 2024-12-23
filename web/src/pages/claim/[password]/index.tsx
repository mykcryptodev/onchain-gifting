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
import Image from "next/image";
import {
  AccountProvider,
  AccountAvatar,
  AccountName,
} from "thirdweb/react";
import { ClaimContents } from "~/components/Claim/Contents";
import Confetti from "~/components/Claim/Confetti";
import { UnwrappingAnimation } from "~/components/Claim/UnwrappingAnimation";
import Link from "next/link";

export default function Claim() {
  const router = useRouter();
  const { password } = router.query as { password: string };
  const [pack, setPack] = useState<Pack | null>(null);
  const [claimingIsFinished, setClaimingIsFinished] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

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
      <h1 className="text-2xl font-bold text-center">Claim Your Gift Pack</h1>
      <p className="text-center text-gray-600">You have been sent an onchain gift pack from</p>
      {pack?.creator && (
        <div className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-md">
          <AccountProvider
            client={CLIENT}
            address={pack.creator}
          >
            <AccountAvatar 
              width={24}
              height={24}
              className="rounded-full"
              loadingComponent={
                <div className="h-6 w-6 rounded-full bg-gray-200 animate-pulse" />
              }
              fallbackComponent={
                <Avatar
                  address={pack.creator}
                  chain={CHAIN}
                  className="rounded-full h-6 w-6"
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
      <p className="text-center text-gray-600">they said...</p>
      <p className="text-lg font-bold">{password}</p>
      {pack?.opened ? (
        <ClaimContents pack={pack} />
      ) : (
        <>
          <Open 
            password={password} 
            key={claimingIsFinished ? "finished" : "not-finished"}
            onClaimStarted={() => setIsClaiming(true)}
          />
          <WatchClaim onClaim={(id) => {
            console.log({gotClaim:true, id});
            void fetchPack();
            setClaimingIsFinished(true);
            setShowConfetti(true);
            setIsClaiming(false);
          }} />
        </>
      )}
      {showConfetti && <Confetti />}
      {isClaiming && <UnwrappingAnimation />}
      {claimingIsFinished && (
        <div className="mt-8">
          <Image
            src="https://images.ctfassets.net/o10es7wu5gm1/TWlW6aoAXPX7yUg5ShsZ0/c02522911b90b766eb8eef709e42b8eb/WalletLogo.png"
            alt="Coinbase Wallet Logo"
            width={64}
            height={64}
            className="mx-auto"
          />
          <h2 className="text-2xl text-center font-bold my-2 max-w-[200px] mx-auto">Get started with Coinbase Wallet!</h2>
          <p className="text-center text-gray-600 mb-2 max-w-[300px] mx-auto">Bring your passkey to the mobile app and do more with your crypto!</p>
          <div className="grid grid-cols-2 gap-2">
            <Link 
              href="https://go.cb-w.com/wallet-download?source=wallet_coinbase_com"
              className="flex flex-col items-center gap-2 border border-gray-200 px-4 py-2 rounded-lg"
            >
              <Image 
                src="https://images.ctfassets.net/o10es7wu5gm1/23ZZPYwd97q6mypmrs33VT/426c6e72f4e0892bd2801984700838c8/image_10.png" 
                alt="Download on iOS" 
                width={40} 
                height={40} 
                className="rounded-lg"
              />
              Download on iOS
            </Link>
            <Link 
              href="https://go.cb-w.com/wallet-mobile-download?source=wallet_coinbase_com"
              className="flex flex-col items-center gap-2 border border-gray-200 px-4 py-2 rounded-lg"
            >
              <Image 
                src="https://images.ctfassets.net/o10es7wu5gm1/3HcmawNrvNUzoKNyMBtetL/e568428b7810a0133933a0321248579a/image_6.svg" 
                alt="Download on Android" 
                width={40} 
                height={40} 
                className="rounded-lg"
              />
              Download on Android
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
