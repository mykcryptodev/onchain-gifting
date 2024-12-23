import { type FC, useState } from "react";
import { useGiftItems } from "~/contexts/GiftItemsContext";
import { type ZapperTokenBalance } from "~/types/zapper";
import { createPortal } from "react-dom";
import { toUnits, ZERO_ADDRESS } from "thirdweb";
import { isAddressEqual } from "viem";

interface AddTokenModalProps {
  token: ZapperTokenBalance;
  onClose: () => void;
}

export const AddTokenModal: FC<AddTokenModalProps> = ({ token, onClose }) => {
  const [amount, setAmount] = useState("");
  const { addERC20, setEthAmount } = useGiftItems();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    const valueUsd = token.token.balanceUSD * (parseFloat(amount) / parseFloat(token.token.balance));
    const amountUnits = toUnits(amount.toString(), token.token.baseToken.decimals).toString();
    
    if (isAddressEqual(token.token.baseToken.address, ZERO_ADDRESS)) {
      setEthAmount(amountUnits, valueUsd);
    }
    addERC20(
      token.token.baseToken.address, 
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

  const setPercentage = (percentage: number) => {
    setAmount((parseFloat(maxAmount) * percentage).toString());
  };

  const setUsdAmount = (usdValue: number) => {
    const tokenAmount = usdValue / token.token.balanceUSD * parseFloat(token.token.balance);
    setAmount(tokenAmount.toString());
  };

  const percentageButtons = [
    { value: 0.1, label: "10%" },
    { value: 0.25, label: "25%" },
    { value: 0.5, label: "50%" },
    { value: 1, label: "100%" }
  ];

  const usdButtons = [
    { value: 1, label: "$1" },
    { value: 5, label: "$5" },
    { value: 10, label: "$10" },
    { value: 100, label: "$100" }
  ];

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
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Balance: {maxAmount}
            </p>
            <div className="flex gap-2 mt-2">
              {percentageButtons.map(({ value, label }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setPercentage(value)}
                  className="flex-1 px-2 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              {usdButtons.map(({ value, label }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setUsdAmount(value)}
                  className="flex-1 px-2 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                >
                  {label}
                </button>
              ))}
            </div>
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