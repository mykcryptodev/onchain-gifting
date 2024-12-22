import { ConnectButton } from "thirdweb/react";
import { CreateGiftPack } from "~/components/CreateGiftPack";
import { CLIENT } from "~/constants";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="mb-8">
        <ConnectButton client={CLIENT} />
      </div>
      <CreateGiftPack />
    </main>
  );
}
