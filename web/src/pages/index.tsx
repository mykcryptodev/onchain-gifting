import Image from "next/image";
import { useAccount } from "wagmi";
import { CreateGiftPack } from "~/components/CreateGiftPack";
import { PackContents } from "~/components/PackContents";
import { PackValue } from "~/components/PackValue";
import { WalletBalances } from "~/components/WalletBalances";
import { WalletComponents } from "~/components/utils/WalletComponents";
import { useGiftItems } from "~/contexts/GiftItemsContext";

export default function Home() {
  const { address } = useAccount();
  const { selectedAssets } = useGiftItems();

  return (
    <main className="flex min-h-screen flex-col items-center sm:p-20 p-4 w-full">
      <div className="absolute top-4 left-4">
        <Image src="/images/logo.png" alt="Logo" width={32} height={32} />
      </div>
      <div className="mb-8">
        <WalletComponents />
      </div>
      <h1 className="text-2xl font-bold mb-4 text-center">Create a Gift Pack</h1>
      <PackValue />
      <PackContents />
      <CreateGiftPack 
        erc20s={selectedAssets.erc20} 
        erc721s={selectedAssets.erc721} 
        erc1155s={selectedAssets.erc1155} 
        ethAmount={selectedAssets.ethAmount} 
      />
      {address && <WalletBalances address={address} />}
    </main>
  );
}
