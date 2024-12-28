import { useMemo, useEffect, useState, useCallback } from "react";
import {
  Transaction,
  TransactionButton,
  TransactionStatusLabel,
  TransactionStatus,
  TransactionStatusAction,
  type LifecycleStatus,
} from "@coinbase/onchainkit/transaction";
import { encode, getContract, keccak256, ZERO_ADDRESS } from "thirdweb";
import { CHAIN, GIFT_PACK_ADDRESS, CLIENT } from "~/constants";
import { createPack } from "~/thirdweb/8453/0x1b6e902360035ac523e27d8fe69140a271ab9e7c";
import { allowance, approve as approveERC20 } from "thirdweb/extensions/erc20";
import { approve as approveERC721 } from "thirdweb/extensions/erc721";
import { setApprovalForAll as setApprovalForAllERC1155 } from "thirdweb/extensions/erc1155";
import { isAddressEqual, type Hex } from "viem";
import { useAccount } from "wagmi";
import { useGiftItems } from "~/contexts/GiftItemsContext";
import { api } from "~/utils/api";
import { toast } from "react-toastify";

type Props = {
  erc20s: { token: string; amount: string }[];
  erc721s: { token: string; tokenId: string }[];
  erc1155s: { token: string; tokenId: string; amount: string }[];
  ethAmount: string;
  hash: Hex | undefined;
};

type Call = {
  to: `0x${string}`;
  data: `0x${string}`;
  value: bigint;
};

export function CreateGiftPack({
  erc20s,
  erc721s,
  erc1155s,
  ethAmount,
  hash,
}: Props) {
  const { address } = useAccount();
  const [erc20sWithSufficientAllowance, setErc20sWithSufficientAllowance] =
    useState<string[]>([]);
  const { hash: giftHash, password } = useGiftItems();
  const { data: isHashUsed } = api.engine.getIsHashUsed.useQuery(
    {
      hash: giftHash ?? "",
    },
    {
      enabled: !!giftHash,
    },
  );
  const [isCreated, setIsCreated] = useState(false);

  const handleOnStatus = useCallback((status: LifecycleStatus) => {
    if (status.statusName === "success") {
      toast.success("Gift pack created!");
      setIsCreated(true);
    }
  }, []);

  useEffect(() => {
    const checkAllowances = async () => {
      if (!address) return [];
      const erc20sWithSufficientAllowance = await Promise.all(
        erc20s.map(async ({ token, amount }) => {
          if (isAddressEqual(token, ZERO_ADDRESS))
            return {
              token,
              sufficient: true,
            };
          const approvals = await allowance({
            contract: getContract({
              chain: CHAIN,
              address: token,
              client: CLIENT,
            }),
            owner: address,
            spender: GIFT_PACK_ADDRESS as `0x${string}`,
          });
          if (approvals >= BigInt(amount)) {
            return {
              token,
              sufficient: true,
            };
          } else {
            return {
              token,
              sufficient: false,
            };
          }
        }),
      );
      setErc20sWithSufficientAllowance(
        erc20sWithSufficientAllowance
          .filter((erc20) => erc20.sufficient)
          .map((erc20) => erc20.token),
      );
    };
    void checkAllowances();
  }, [erc20s, address]);

  const createPackTransaction = useMemo(async () => {
    const tx = createPack({
      contract: getContract({
        chain: CHAIN,
        address: GIFT_PACK_ADDRESS,
        client: CLIENT,
      }),
      erc20Tokens: erc20s
        .filter(({ token }) => !isAddressEqual(token, ZERO_ADDRESS))
        .map(({ token, amount }) => ({
          tokenAddress: token,
          amount: BigInt(amount),
        })),
      erc721Tokens: erc721s.map(({ token, tokenId }) => ({
        tokenAddress: token,
        tokenId: BigInt(tokenId),
      })),
      erc1155Tokens: erc1155s.map(({ token, tokenId, amount }) => ({
        tokenAddress: token,
        tokenId: BigInt(tokenId),
        amount: BigInt(amount),
      })),
      hash: hash ?? keccak256(`0x0`),
    });

    const value = ethAmount !== "0" ? BigInt(ethAmount) : BigInt(0);

    return {
      to: tx.to as `0x${string}`,
      value,
      data: await encode(tx),
    };
  }, [erc20s, erc721s, erc1155s, ethAmount, hash]);

  const erc20ApprovalTransactions = useMemo(() => {
    return erc20s
      .filter(
        ({ token }) =>
          !isAddressEqual(token, ZERO_ADDRESS) &&
          !erc20sWithSufficientAllowance.includes(token),
      )
      .map(({ token, amount }) => {
        return approveERC20({
          contract: getContract({
            chain: CHAIN,
            address: token,
            client: CLIENT,
          }),
          spender: GIFT_PACK_ADDRESS as `0x${string}`,
          amountWei: BigInt(amount),
        });
      });
  }, [erc20s, erc20sWithSufficientAllowance]);

  const erc721ApprovalTransactions = useMemo(() => {
    return erc721s.map(({ token, tokenId }) => {
      return approveERC721({
        contract: getContract({
          chain: CHAIN,
          address: token,
          client: CLIENT,
        }),
        to: GIFT_PACK_ADDRESS as `0x${string}`,
        tokenId: BigInt(tokenId),
      });
    });
  }, [erc721s]);

  const erc1155ApprovalTransactions = useMemo(() => {
    return erc1155s.map(({ token }) => {
      return setApprovalForAllERC1155({
        contract: getContract({
          chain: CHAIN,
          address: token,
          client: CLIENT,
        }),
        operator: GIFT_PACK_ADDRESS as `0x${string}`,
        approved: true,
      });
    });
  }, [erc1155s]);

  const [calls, setCalls] = useState<Call[]>([]);

  useEffect(() => {
    const prepareCalls = async () => {
      const preparedCalls = await Promise.all([
        ...erc20ApprovalTransactions.map(async (tx) => ({
          to: tx.to as `0x${string}`,
          data: await encode(tx),
          value: BigInt(0),
        })),
        ...erc721ApprovalTransactions.map(async (tx) => ({
          to: tx.to as `0x${string}`,
          data: await encode(tx),
          value: BigInt(0),
        })),
        ...erc1155ApprovalTransactions.map(async (tx) => ({
          to: tx.to as `0x${string}`,
          data: await encode(tx),
          value: BigInt(0),
        })),
        {
          to: (await createPackTransaction).to,
          data: (await createPackTransaction).data,
          value: (await createPackTransaction).value,
        },
      ]);
      setCalls(preparedCalls);
    };

    void prepareCalls();
  }, [
    erc20ApprovalTransactions,
    erc721ApprovalTransactions,
    erc1155ApprovalTransactions,
    createPackTransaction,
    erc20sWithSufficientAllowance,
  ]);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Transaction calls={calls} isSponsored onStatus={handleOnStatus}>
        <TransactionButton
          text="Create Gift Pack"
          disabled={!calls.length || !hash || isHashUsed}
          className="rounded-md bg-blue-600 px-4 py-2 text-lg font-medium text-white hover:bg-blue-700 disabled:bg-gray-400"
        />
        <TransactionStatus>
          <TransactionStatusLabel />
          <TransactionStatusAction />
        </TransactionStatus>
      </Transaction>
      {isCreated && (
        <div className="mt-4 flex flex-col items-center gap-2">
          <p className="text-sm text-gray-600">
            Share this link with the recipient:
          </p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={`${window.location.origin}/claim/${encodeURIComponent(password ?? "")}`}
              className="w-64 rounded-md border border-gray-200 px-3 py-2 text-sm"
            />
            <button
              onClick={() => {
                void navigator.clipboard.writeText(
                  `${window.location.origin}/claim/${encodeURIComponent(password ?? "")}`,
                );
                toast.success("Copied to clipboard!");
              }}
              className="p-2 text-gray-600 hover:text-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
            <button
              onClick={() => {
                if (navigator.share) {
                  void navigator.share({
                    title: "Gift Pack",
                    text: "I sent you a gift pack!",
                    url: `${window.location.origin}/claim/${encodeURIComponent(password ?? "")}`,
                  });
                }
              }}
              className="p-2 text-gray-600 hover:text-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
            </button>
          </div>
        </div>
      )}
      {isHashUsed && password.length > 0 && (
        <p className="text-sm text-red-500 text-opacity-90">
          Please use a different message.
        </p>
      )}
    </div>
  );
}
