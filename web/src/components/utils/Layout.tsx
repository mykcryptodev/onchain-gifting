import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useAccount } from "wagmi";

const Frame = dynamic(() => import("~/components/utils/Frame"), {
  ssr: false,
});

export function Layout({ children }: { children: React.ReactNode }) {
  const { address } = useAccount();
  return (
    <main className="flex min-h-screen flex-col items-center sm:px-20 sm:pb-20 sm:pt-10 p-4 w-full">
      <div className="flex justify-between items-center w-full">
        <Link href="/">
          <Image src="/images/logo.png" alt="Logo" width={32} height={32} priority />
        </Link>
        {address && (
          <Link href={`/from/${address}`}>
            Gifts From Me
          </Link>
        )}
      </div>
      {children}
      <Frame />
    </main>
  )
}
