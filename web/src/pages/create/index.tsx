import { useAccount } from "wagmi";

import { useGiftItems } from "~/contexts/GiftItemsContext";

import { Card } from "~/components/ui/card";

import Image from "next/image";
import { CreateGiftForm } from "~/components/CreateGiftForm";

export default function CreatePage() {
  const { address } = useAccount();
  const { selectedAssets, hash } = useGiftItems();

  return (
    <div className="w-screen py-12">
      <Card className="mx-auto w-fit space-y-6 bg-white/60 p-10 backdrop-blur-sm">
        <Image
          src="/images/bgb-giftcard.png"
          alt="logo"
          width={512}
          height={512}
        />
        <CreateGiftForm />
      </Card>
    </div>
  );
}
