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
  Wallet,
  WalletDropdown,
  WalletDropdownBasename, 
  WalletDropdownDisconnect,
  WalletDropdownFundLink,
} from '@coinbase/onchainkit/wallet';
import { useAccount } from 'wagmi';
export function WalletComponents() {
  const { isConnected } = useAccount();
  const connectButtonColor = isConnected ? "bg-gray-200" : "bg-blue-600 hover:bg-blue-700";
  const connectButtonTextSize = isConnected ? "text-md" : "text-lg";

  return (
    <div className="flex justify-end">
      <Wallet>
        <ConnectWallet
          className={`px-4 py-2 ${connectButtonTextSize} font-bold text-white ${connectButtonColor} rounded-md flex items-center gap-2`}
        >
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
          <WalletDropdownDisconnect />
        </WalletDropdown>
      </Wallet>
    </div>
  );
}