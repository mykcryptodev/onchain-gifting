import { IdentityCard } from "@coinbase/onchainkit/identity";
import { useEffect } from "react";
import { useState } from "react";
import { getContract } from "thirdweb";
import { ClaimContents } from "~/components/Claim/Contents";
import { CLIENT, GIFT_PACK_ADDRESS } from "~/constants";
import { CHAIN } from "~/constants";
import { getPackByHash } from "~/thirdweb/8453/0x445bf2d8c89472a2289360e4e15be0c1951ab536";
import { type Pack } from "~/types/giftpack";
import { useRouter } from "next/router";
import { Open } from "~/components/Claim/Open";
import { keccak256 as viemKeccak256, encodeAbiParameters } from "viem";
import { WatchClaim } from "~/components/Claim/WatchClaim";

export default function Claim() {
  const router = useRouter();
  const { password } = router.query as { password: string };
  const [pack, setPack] = useState<Pack | null>(null);

  useEffect(() => {
    const fetchPack = async () => {
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
    };
    void fetchPack();
  }, [pack, password]);

  return (
    <>
      <h1 className="text-2xl font-bold mb-4 text-center">Claim a Gift Pack</h1>
      <p>You have been sent an onchain gift pack from</p>
      <IdentityCard address={pack?.creator} />
      <ClaimContents />
      The password is {password}
      <Open password={password} />
      {!pack?.opened && (
        <WatchClaim onClaim={(id) => {
          console.log({gotClaim:true, id});
        }} />
      )}
    </>
  );
}
