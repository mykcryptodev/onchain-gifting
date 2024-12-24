import Link from "next/link";
import { WalletComponents } from "./WalletComponents";
import Image from "next/image";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

const Frame = dynamic(() => import("~/components/utils/Frame"), {
  ssr: false,
});

export function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center sm:p-20 p-4 w-full">
    <div className="absolute top-4 left-4">
      <Link href="/">
        <Image src="/images/logo.png" alt="Logo" width={32} height={32} priority />
      </Link>
    </div>
      {router.pathname !== "/" && (
        <div className="mb-8">
          <WalletComponents />
        </div>
      )}
      {children}
      <Frame />
    </main>
  )
}
