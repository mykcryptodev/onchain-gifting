import { Name } from "@coinbase/onchainkit/identity";
import { useCallback, useEffect, useMemo } from "react";
import { useState } from "react";
import { getContract } from "thirdweb";
import { CLIENT, GIFT_PACK_ADDRESS, SALT_SEPARATOR } from "~/constants";
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
  AccountName,
} from "thirdweb/react";
import { ClaimContents } from "~/components/Claim/Contents";
import Confetti from "~/components/Claim/Confetti";
import { UnwrappingAnimation } from "~/components/Claim/UnwrappingAnimation";
import Link from "next/link";
import { useAccount } from "wagmi";
import dynamic from "next/dynamic";
import { Profile } from "~/components/utils/Profile";

const WalletComponents = dynamic(() => import("~/components/utils/WalletComponents"), {
  ssr: false,
});

export default function Claim() {
  const router = useRouter();
  const { password } = router.query as { password: string };
  const [pack, setPack] = useState<Pack | null>(null);
  const [claimingIsFinished, setClaimingIsFinished] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const { isConnected, address } = useAccount();
  const passwordWithoutSalt = useMemo(() => password?.split(SALT_SEPARATOR)[0], [password]);

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

  const handleClaim = (id: string) => {
    console.log({gotClaim:true, id});
    void fetchPack();
    setClaimingIsFinished(true);
    setShowConfetti(true);
    setIsClaiming(false);
    // vibrate the device if it supports it
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100, 50, 200]); // Short-short-long celebratory pattern
    }
  }

  if (!pack) return null;

  return (
    <div className="flex flex-col gap-2 justify-center items-center">
      <div className="mb-8">
        {isConnected && (
          <WalletComponents />
        )}
      </div>
      <h1 className="text-2xl font-bold text-center">Claim Your Gift Pack</h1>
      <p className="text-center text-gray-600">You have been sent an onchain gift pack from</p>
      {pack?.creator && (
        <div className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-md">
          <Profile address={pack.creator} />
        </div>
      )}
      <p className="text-center text-gray-600">they said...</p>
      <p className="text-lg font-bold text-center max-w-xl">{passwordWithoutSalt}</p>
      {pack?.opened ? (
        <ClaimContents pack={pack} />
      ) : (
        <>
          <div className="flex flex-col gap-4 w-full max-w-sm">
            <h2 className="text-2xl font-bold text-center mt-4">How to Claim</h2>
            {address ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 font-bold">
                  ✓
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Create or Connect Your Wallet</h3>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <span>You have connected with</span>
                    {address && (
                      <AccountProvider address={address} client={CLIENT}>
                        <AccountName
                          loadingComponent={
                            <div className="h-6 w-24 rounded-lg bg-gray-200 animate-pulse" />
                          }
                          fallbackComponent={
                            <Name
                              address={address}
                              chain={CHAIN}
                              className="text-sm text-gray-600"
                            />
                          }
                        />
                      </AccountProvider>
                    )}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Create or Connect Your Wallet</h3>
                  <p className="text-sm text-gray-600">Create a wallet in seconds via Face ID or Touch ID</p>
                  <div className="flex">
                    <WalletComponents btnClassName="my-2 backdrop-blur-sm animate-[pulse-shadow_3s_ease-in-out_infinite]" hideText={true} />
                  </div>
                </div>
              </div>
            )}
            <div className="flex items-start gap-4">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${pack?.opened ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"} font-bold`}>
                {pack?.opened ? "✓" : "2"}
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Open Your Gift</h3>
                <p className="text-sm text-gray-600">Unwrap your gift to see what&apos;s inside</p>
                <div className="flex flex-col gap-2">
                  <Open 
                    password={password} 
                    key={claimingIsFinished ? "finished" : "not-finished"}
                    onClaimStarted={() => setIsClaiming(true)}
                    btnClassName={`backdrop-blur-sm ${address && !isClaiming && !claimingIsFinished ? "animate-[pulse-shadow_3s_ease-in-out_infinite] text-lg px-4 py-2 mt-2" : "text-sm px-2 py-1 mt-2 "}`}
                  />
                  <WatchClaim onClaim={handleClaim} />
                </div>
              </div>
            </div>
          </div>
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
      <style jsx>{`
        @keyframes pulse-shadow {
          0% {
            box-shadow: 0 0 2px rgba(37,99,235,0.5);
          }
          25% {
            box-shadow: 0 0 20px rgba(37,99,235,0.5);
          }
          50% {
            box-shadow: 0 0 40px rgba(37,99,235,0.99); 
          }
          75% {
            box-shadow: 0 0 20px rgba(37,99,235,0.5);
          }
          100% {
            box-shadow: 0 0 2px rgba(37,99,235,0.5);
          }
        }
      `}</style>
    </div>
  );
}
