import { useGiftItems } from "~/contexts/GiftItemsContext";
import NumberFlow from '@number-flow/react';
import { useMemo, useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useTranslation } from "next-i18next";

export function PackValue() {
  const { isConnected } = useAccount();
  const { getTotalValueUsd } = useGiftItems();
  const totalValue = useMemo(() => getTotalValueUsd(), [getTotalValueUsd]);
  const [hasScrolled, setHasScrolled] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isConnected) return null;

  return (
    <div className={`text-center mb-4 sticky top-0 right-4 z-10 bg-white w-full rounded-lg p-2 ${hasScrolled ? 'shadow-lg' : ''}`}>
      <p className="text-lg font-medium">{t('create_page.total_pack_value')}</p>
      <div className="font-bold text-2xl">
        <NumberFlow 
          value={totalValue} 
          format={{ style: 'currency', currency: 'USD' }}
        />
      </div>
    </div>
  );
} 