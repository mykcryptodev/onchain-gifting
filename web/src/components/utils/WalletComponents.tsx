import {
  Address,
  Avatar,
  Name,
  Identity,
  EthBalance,
} from '@coinbase/onchainkit/identity';
import { color } from '@coinbase/onchainkit/theme';
import {
  ConnectWallet,
  ConnectWalletText,
  Wallet,
  WalletDropdown,
  WalletDropdownBasename, 
  WalletDropdownDisconnect,
  WalletDropdownFundLink,
  WalletDropdownLink,
} from '@coinbase/onchainkit/wallet';
import { createWallet, createWalletAdapter, type Wallet as ThirdwebWallet } from "thirdweb/wallets";
import { 
  ConnectButton, 
  LocaleId, 
  useSetActiveWallet 
} from "thirdweb/react";
import { useAccount, useDisconnect, useWalletClient, useSwitchChain } from "wagmi";
import { viemAdapter } from "thirdweb/adapters/viem";
import { useEffect } from 'react';
import { defineChain } from 'thirdweb/chains';
import { CHAIN, CLIENT } from '~/constants';
import Image from 'next/image';
import { useConnect } from "wagmi";
import { viemClientWalletConnector } from './ViemClientWalletConnector';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
const SHOW_THIRDWEB_WALLET = true;

type Props = {
  btnClassName?: string;
  hideText?: boolean;
}

export function WalletComponents({ btnClassName, hideText }: Props) {
  const { isConnected } = useAccount();
  const { disconnectAsync } = useDisconnect();
  const { switchChainAsync } = useSwitchChain();
  const { data: walletClient } = useWalletClient();
  const { connectAsync } = useConnect();
  const setActiveWallet = useSetActiveWallet();
  const { t } = useTranslation();
  const router = useRouter();
  console.log({
    locale: router.locale
  })
  const connectButtonColor = isConnected ? "bg-gray-200" : "bg-blue-600 hover:bg-blue-700";
  const connectButtonTextSize = isConnected ? "text-md" : "text-lg";

  useEffect(() => {
    const setActive = async () => {
      if (walletClient) {
        // adapt the walletClient to a thirdweb account
        const adaptedAccount = viemAdapter.walletClient.fromViem({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
          walletClient: walletClient as any, // accounts for wagmi/viem version mismatches
        });
        // create the thirdweb wallet with the adapted account
        const thirdwebWallet = createWalletAdapter({
          client: CLIENT,
          adaptedAccount,
          chain: defineChain(await walletClient.getChainId()),
          onDisconnect: async () => {
            await disconnectAsync();
          },
          switchChain: async (chain) => {
            await switchChainAsync({ chainId: chain.id as 8453 });
          },
        });
        void setActiveWallet(thirdwebWallet);
      }
    };
    void setActive();
  }, [disconnectAsync, setActiveWallet, switchChainAsync, walletClient]);

  const handleThirdwebConnect = async (wallet: ThirdwebWallet) => {
    const viemClientWallet = viemAdapter.walletClient.toViem({
      client: CLIENT,
      chain: CHAIN,
      account: wallet.getAccount()!,
    });
    
    await connectAsync({ 
      connector: viemClientWalletConnector({
        walletClient: viemClientWallet
      })
    });
  };

  if (isConnected && SHOW_THIRDWEB_WALLET) {
    return (
      <ConnectButton 
        client={CLIENT} 
        theme="light"
        chain={CHAIN}
      />
    )
  }

  return (
    <div className="flex flex-col gap-2 text-center justify-center items-center">
      <div className="flex items-center gap-2">
        <Wallet>
          <ConnectWallet
            className={`px-4 py-2 ${connectButtonTextSize} font-bold text-white ${connectButtonColor} rounded-md flex items-center gap-2 ${btnClassName}`}
          >
            <ConnectWalletText>
              <span>{t('wallet_components.create_wallet')}</span>
            </ConnectWalletText>
            <Avatar className="h-6 w-6" />
            <Name />
          </ConnectWallet>
          <WalletDropdown className="z-20">
            <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
              <Avatar />
              <Name />
              <Address className={color.foregroundMuted} />
              <EthBalance />
            </Identity>
            <WalletDropdownBasename />
            <WalletDropdownFundLink />
            <WalletDropdownLink
              icon={"wallet"}
              href="https://wallet.coinbase.com"
              rel="noopener noreferrer"
            >
              {t('wallet_components.view_funds')}
            </WalletDropdownLink> 
            <WalletDropdownDisconnect />
          </WalletDropdown>
        </Wallet>
        <ConnectButton
          client={CLIENT}
          recommendedWallets={[
            createWallet("com.coinbase.wallet"),
          ]}
          onConnect={handleThirdwebConnect}
          wallets={[
            createWallet("io.metamask"),
            createWallet("com.coinbase.wallet"),
            createWallet("me.rainbow"),
            createWallet("walletConnect")
          ]}
          chain={CHAIN}
          connectButton={{
            label: t('wallet_components.connect_wallet'),
            className: `!px-4 !py-2 !h-auto !text-lg !rounded-md ${connectButtonTextSize} !min-w-0 hover:bg-gray-300 !font-bold rounded-md flex items-center gap-2 ${btnClassName}`,
          }}
          connectModal={{
            title: t('wallet_components.connect_modal.title'),
            titleIcon: "/images/logo.png",
            showThirdwebBranding: false,
          }}
          locale={router.locale as LocaleId}
        />
      </div>
      {!isConnected && !hideText && (
        <p className="text-center text-gray-600 max-w-xs text-sm">
          {t('wallet_components.biometric_text', { biometric: '' })}
          <span className="font-bold mx-1">
            <Image 
              src="/images/faceid.svg" 
              className="inline h-4 w-4" 
              alt={t('alt_text.face_id')}
              width={16}
              height={16}
            /> {t('wallet_components.face_id')}
          </span>
          {t('wallet_components.or')}
          <span className="font-bold mx-1">
            <Image 
              src="/images/touchid.svg" 
              className="inline h-4 w-4" 
              alt={t('alt_text.touch_id')}
              width={16}
              height={16}
            /> {t('wallet_components.touch_id')}
          </span>
        </p>
      )}
    </div>
  );
}

export default WalletComponents;
