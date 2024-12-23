import Link from "next/link";
import { WalletComponents } from "./WalletComponents";
import Image from "next/image";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col items-center sm:p-20 p-4 w-full">
    <div className="absolute top-4 left-4">
      <Link href="/">
        <Image src="/images/logo.png" alt="Logo" width={32} height={32} priority />
      </Link>
    </div>
      <div className="mb-8">
        <WalletComponents />
      </div>
      {children}
    </main>
  )
}
