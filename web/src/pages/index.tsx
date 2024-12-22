import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { CreateGiftPack } from "~/components/CreateGiftPack";
import { WalletBalances } from "~/components/WalletBalances";
import { CLIENT } from "~/constants";

export default function Home() {
  const account = useActiveAccount();
  return (
    <main className="flex min-h-screen flex-col items-center p-24 w-full">
      <div className="mb-8">
        <ConnectButton client={CLIENT} />
      </div>
      <CreateGiftPack />
      {account?.address && <WalletBalances address={account.address} />}
    </main>
  );
}
