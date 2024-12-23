import { useGiftItems } from "~/contexts/GiftItemsContext";
import NumberFlow from '@number-flow/react';
import { useMemo } from "react";

export function PackValue() {
  const { getTotalValueUsd } = useGiftItems();
  const totalValue = useMemo(() => getTotalValueUsd(), [getTotalValueUsd]);

  return (
    <div className="text-center mb-4">
      <p className="text-lg font-medium">Total Pack Value</p>
      <div className="font-bold text-2xl">
        <NumberFlow 
          value={totalValue} 
          format={{ style: 'currency', currency: 'USD' }}
        />
      </div>
    </div>
  );
} 