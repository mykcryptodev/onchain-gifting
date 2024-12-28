import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useAccount } from "wagmi";
import { WalletComponents } from "./WalletComponents";
import { Toaster } from "../ui/toaster";

const Frame = dynamic(() => import("~/components/utils/Frame"), {
  ssr: false,
});

export function Layout({ children }: { children: React.ReactNode }) {
  const { address } = useAccount();
  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-gradient-to-br from-white to-blue-500 p-4 sm:px-20 sm:pb-20 sm:pt-10">
      <div className="flex w-full items-center justify-between">
        <Link href="/">
          <Image
            src="/images/base-logo.png"
            alt="Logo"
            width={32}
            height={32}
            priority
          />
        </Link>
        <WalletComponents />
      </div>
      {children}
      <Toaster />
      <Frame />
    </main>
  );
}
