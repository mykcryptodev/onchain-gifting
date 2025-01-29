import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useAccount } from "wagmi";
import { LanguageSwitcher } from "~/components/LanguageSwitcher";
import { useTranslation } from "next-i18next";

const Frame = dynamic(() => import("~/components/utils/Frame"), {
  ssr: false,
});

const SOCIAL_LINKS = [
  {
    name: "X",
    href: "https://www.twitter.com/mykcryptodev",
    icon: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: "Farcaster",
    href: "https://warpcast.com/myk",
    icon: () => (
      <svg 
        xmlns="http://www.w3.org/2000/svg"
        width="20" 
        height="20" 
        viewBox="0 0 1000 1000" 
        fill="none" 
      >
        <path d="M257.778 155.556H742.222V844.444H671.111V528.889H670.414C662.554 441.677 589.258 373.333 500 373.333C410.742 373.333 337.446 441.677 329.586 528.889H328.889V844.444H257.778V155.556Z" fill="#855DCD"/>
        <path d="M128.889 253.333L157.778 351.111H182.222V746.667C169.949 746.667 160 756.616 160 768.889V795.556H155.556C143.283 795.556 133.333 805.505 133.333 817.778V844.444H382.222V817.778C382.222 805.505 372.273 795.556 360 795.556H355.556V768.889C355.556 756.616 345.606 746.667 333.333 746.667H306.667V253.333H128.889Z" fill="#855DCD"/>
        <path d="M675.556 746.667C663.283 746.667 653.333 756.616 653.333 768.889V795.556H648.889C636.616 795.556 626.667 805.505 626.667 817.778V844.444H875.556V817.778C875.556 805.505 865.606 795.556 853.333 795.556H848.889V768.889C848.889 756.616 838.94 746.667 826.667 746.667V351.111H851.111L880 253.333H702.222V746.667H675.556Z" fill="#855DCD"/>
      </svg>
    ),
  },
  {
    name: "Github",
    href: "https://github.com/mykcryptodev/onchain-gifting",
    icon: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const { address } = useAccount();
  const { t } = useTranslation();

  return (
    <>
    <main className="flex min-h-screen flex-col items-center sm:px-20 sm:pb-20 mb-20 sm:pt-10 p-4 w-full">
      <div className="flex justify-between items-center w-full">
        <Link href="/">
          <Image src="/images/logo.png" alt={t('alt_text.logo')} width={32} height={32} priority />
        </Link>
        <div className="flex items-center gap-4">
          {address && (
            <Link href={`/from/${address}`}>
              {t('gifts_from_me')}
            </Link>
          )}
          <LanguageSwitcher />
        </div>
      </div>
      {children}
    </main>
    <footer className="fixed bottom-0 w-full bg-blue-50 p-4">
      <div className="flex justify-between items-center w-full max-w-5xl mx-auto">
        <div className="flex items-center gap-1">
          <span>{t('built_by')}</span>
          <Link href="https://www.twitter.com/mykcryptodev" className="underline flex items-center gap-1">
            <Image src="/images/myk.jpg" alt={t('alt_text.profile')} width={16} height={16} className="rounded-full" />
            myk.eth
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {SOCIAL_LINKS.map((link) => (
            <Link 
              href={link.href} 
              key={link.name} 
              className="underline flex items-center gap-1"
              target="_blank"
              rel="noopener noreferrer"
              title={t(`social_links.${link.name.toLowerCase()}`)}
            >
              {link.icon()}
            </Link>
          ))}
        </div>
      </div>
    </footer>
    <Frame />
    </>
  );
}
