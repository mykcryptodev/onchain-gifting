import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useAccount } from "wagmi";
import { WalletComponents } from "./WalletComponents";

const Frame = dynamic(() => import("~/components/utils/Frame"), {
  ssr: false,
});

export function Layout({ children }: { children: React.ReactNode }) {
  const { address } = useAccount();
  return (
    <main className="flex min-h-screen bg-gradient-to-br from-white to-blue-500 flex-col items-center sm:px-20 sm:pb-20 sm:pt-10 p-4 w-full">
      <div className="flex justify-between items-center w-full">
        <Link href="/">
          <Image src="/images/base-logo.png" alt="Logo" width={32} height={32} priority />
        </Link>
        <WalletComponents />
      </div>
      {children}
      <Frame />
    </main>
  )
}
