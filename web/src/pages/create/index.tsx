"use client";

import { useAccount } from "wagmi";

import { useGiftItems } from "~/contexts/GiftItemsContext";

import { Card } from "~/components/ui/card";

import Image from "next/image";
import { CreateGiftForm } from "~/components/CreateGiftForm";
import { CreateGiftPackButton } from "~/components/CreateGiftPackButton";
import { useState } from "react";

export default function CreatePage() {
  const { selectedAssets, hash } = useGiftItems();
  const [isCreated, setIsCreated] = useState(false);

  console.log("#########selectedAssets:", selectedAssets);

  return (
    <div className="w-screen py-12">
      <Card className="mx-auto flex w-fit flex-col gap-6 bg-white/60 p-10 backdrop-blur-sm md:flex-row">
        <Image
          src="/images/BASE_GLOBAL_BLUE.gif"
          alt="logo"
          width={512}
          height={512}
        />
        <div className="flex flex-col gap-4">
          {!isCreated && <CreateGiftForm />}
          <CreateGiftPackButton
            erc20s={selectedAssets.erc20}
            erc721s={selectedAssets.erc721}
            erc1155s={selectedAssets.erc1155}
            ethAmount={selectedAssets.ethAmount}
            hash={hash}
            isCreated={isCreated}
            setIsCreated={setIsCreated}
          />
        </div>
      </Card>
    </div>
  );
}
