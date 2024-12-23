import { IdentityCard } from "@coinbase/onchainkit/identity";
import { useEffect } from "react";
import { useState } from "react";
import { getContract } from "thirdweb";
import { ClaimContents } from "~/components/Claim/Contents";
import { CLIENT, GIFT_PACK_ADDRESS } from "~/constants";
import { CHAIN } from "~/constants";
import { getPack } from "~/thirdweb/84532/0xa9dc74673fb099885e830eb534b89e65dd5a68f6";
import { type Pack } from "~/types/giftpack";
import { useRouter } from "next/router";
import { Open } from "~/components/Claim/Open";

export default function Claim() {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const [pack, setPack] = useState<Pack | null>(null);

  useEffect(() => {
    const fetchPack = async () => {
      if (pack || !id) return;
      const fetchedPack = await getPack({
        contract: getContract({
          address: GIFT_PACK_ADDRESS,
          chain: CHAIN,
          client: CLIENT,
        }),
        tokenId: BigInt(id as string),
      });
      setPack(fetchedPack);
    };
    void fetchPack();
  }, [pack, id]);

  return (
    <>
      <h1 className="text-2xl font-bold mb-4 text-center">Claim a Gift Pack</h1>
      <p>You have been sent an onchain gift pack from</p>
      <IdentityCard address={pack?.creator} />
      <ClaimContents />
      The id is {id}
      <Open id={id} />
    </>
  );
}
