import { useMemo, useState, type FC } from "react";
import { getContract, encode } from "thirdweb";
import { CHAIN, CLIENT, GIFT_PACK_ADDRESS } from "~/constants";
import { openPackWithPassword } from "~/thirdweb/8453/0x1b6e902360035ac523e27d8fe69140a271ab9e7c";
import { useAccount } from "wagmi";
import { Transaction, TransactionButton, TransactionStatus, TransactionStatusAction, TransactionStatusLabel } from "@coinbase/onchainkit/transaction";
import { api } from "~/utils/api";
import { cn } from "@coinbase/onchainkit/theme";
import { useTranslation } from "next-i18next";

type Props = {
  password: string;
  onClaimStarted: () => void;
  btnClassName?: string;
}
export const Open: FC<Props> = ({ password, onClaimStarted, btnClassName }) => {
  const { isConnected, address } = useAccount();
  const { mutateAsync: open, isPending } = api.engine.openPack.useMutation();
  const [isGasFree, setIsGasFree] = useState(true);
  const [isClaiming, setIsClaiming] = useState(false);
  const { t } = useTranslation();

  const calls = useMemo(async () => {
    if (!address) return [];
    const tx = openPackWithPassword({
      contract: getContract({
        address: GIFT_PACK_ADDRESS,
        client: CLIENT,
        chain: CHAIN,
      }),
      password,
      recipient: address,
    });
    return [{
      to: GIFT_PACK_ADDRESS as `0x${string}`,
      data: await encode(tx),
    }]
  }, [password, address]);

  const handleOpenPack = async () => {
    await open({
      password,
      recipient: address!,
    });
    setIsClaiming(true);
    onClaimStarted();
  }

  return (
    <div className="flex flex-col max-w-sm">
      {isGasFree ? (
        <button 
          className={cn(`text-sm px-2 py-1 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 w-fit disabled:bg-gray-400 ${!isConnected ? "opacity-50" : ""}`, btnClassName)}
          onClick={() => handleOpenPack()}
          disabled={isPending || !address}
        >
          {isPending || isClaiming ? (
            <div className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('claim_page.open_step.button.opening')}
            </div>
          ) : (
            t('claim_page.open_step.button.open')
          )}
        </button>
      ) : (
        <Transaction
          calls={calls}
          isSponsored
        >
          <TransactionButton 
            disabled={isPending || !address}
            text={t('claim_page.open_step.button.open')}
            className={cn("text-sm px-2 py-1 -mb-1 font-bold text-white bg-yellow-600 rounded-md hover:bg-yellow-700 w-fit disabled:bg-gray-400", btnClassName)}
          />
          <TransactionStatus>
            <TransactionStatusLabel />
            <TransactionStatusAction />
          </TransactionStatus>
        </Transaction>
      )}
      {!isClaiming && (
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm text-gray-600">{t('claim_page.open_step.button.claim_free')}</span>
          <button
            type="button"
            className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
              isGasFree ? 'bg-blue-600' : 'bg-gray-200'
            }`}
            role="switch"
            aria-checked={isGasFree}
            onClick={() => setIsGasFree(!isGasFree)}
          >
          <span
            aria-hidden="true"
            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              isGasFree ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
          </button>
        </div>
      )}
    </div>
  );
};
