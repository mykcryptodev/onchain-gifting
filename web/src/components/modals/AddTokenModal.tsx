import { type FC, useState } from "react";
import { useGiftItems } from "~/contexts/GiftItemsContext";
import { type ZapperTokenBalance } from "~/types/zapper";
import { createPortal } from "react-dom";
import { toUnits } from "thirdweb";

interface AddTokenModalProps {
  token: ZapperTokenBalance;
  onClose: () => void;
}

export const AddTokenModal: FC<AddTokenModalProps> = ({ token, onClose }) => {
  const [amount, setAmount] = useState("");
  const { addERC20 } = useGiftItems();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    const valueUsd = token.token.balanceUSD * (parseFloat(amount) / parseFloat(token.token.balance));
    const amountUnits = toUnits(amount.toString(), token.token.baseToken.decimals).toString();
    
    addERC20(
      token.address, 
      amountUnits, 
      valueUsd,
      token.token.baseToken.symbol,
      token.token.baseToken.name,
      token.token.baseToken.imgUrl,
      token.token.baseToken.decimals,
    );
    onClose();
  };

  const maxAmount = token.token.balance;

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">Add {token.token.baseToken.symbol} to Gift Pack</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <div className="relative">
              <input
                type="number"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                max={maxAmount}
                className="block w-full p-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="0.0"
              />
              <button
                type="button"
                onClick={() => setAmount(maxAmount)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-blue-600 hover:text-blue-700"
              >
                MAX
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Balance: {maxAmount}
            </p>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!amount || parseFloat(amount) > parseFloat(maxAmount)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.getElementById("portal")!
  );
}; 