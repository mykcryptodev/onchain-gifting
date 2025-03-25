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
import { useAccount } from "wagmi";
import Image from 'next/image';

type Props = {
  btnClassName?: string;
  hideText?: boolean;
}

export function WalletComponents({ btnClassName, hideText }: Props) {
  const { isConnected } = useAccount();

  const createButtonColor = isConnected ? "bg-gray-200" : "bg-blue-600 hover:bg-blue-700";
  const connectButtonColor = isConnected ? "bg-gray-200" : "bg-gray-200 hover:bg-gray-300";
  const connectButtonTextSize = isConnected ? "text-md" : "text-md";

  return (
    <div className="flex flex-col gap-2 text-center justify-center items-center">
      <div className="flex items-center gap-2">
        <Wallet>
          <ConnectWallet
            className={`p-2 ${connectButtonTextSize} font-bold text-white ${createButtonColor} rounded-md flex items-center gap-2 ${btnClassName}`}
          >
            <ConnectWalletText>
              <span>Create Wallet</span>
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
              View Funds
            </WalletDropdownLink> 
            <WalletDropdownDisconnect />
          </WalletDropdown>
        </Wallet>
        {!isConnected && (
          <ConnectWallet
            className={`p-2 ${connectButtonTextSize} font-bold text-white ${connectButtonColor} rounded-md flex items-center gap-2`}
          >
            <ConnectWalletText className="text-black whitespace-nowrap">
              <span>Connect Wallet</span>
            </ConnectWalletText>
            <Avatar className="h-6 w-6" />
            <Name />
          </ConnectWallet>
        )}
      </div>
      {!isConnected && !hideText && (
        <p className="text-center text-gray-600 max-w-xs text-sm">
          Create a wallet with 
          <span className="font-bold mx-1">
            <Image 
              src="/images/faceid.svg" 
              className="inline h-4 w-4" 
              alt="Face ID" 
              width={16}
              height={16}
            /> Face ID 
          </span>or 
          <span className="font-bold mx-1">
            <Image 
              src="/images/touchid.svg" 
              className="inline h-4 w-4" 
              alt="Touch ID" 
              width={16}
              height={16}
            /> Touch ID 
          </span>
        </p>
      )}
    </div>
  );
}

export default WalletComponents;
