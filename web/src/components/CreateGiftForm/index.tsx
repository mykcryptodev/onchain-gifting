"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAccount } from "wagmi";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "~/components/ui/button";

import { Form } from "~/components/ui/form";

import { BaseNameSelector } from "./BaseNameSelector";
import { InputUSDC } from "./InputUSDC";
import { GiftCardSelector } from "./GiftCardSelector";
import { api } from "~/utils/api";
import { type WalletBalancesResponse } from "~/types/zapper";
import { useGiftItems } from "~/contexts/GiftItemsContext";

import {
  Transaction,
  TransactionButton,
  TransactionStatusLabel,
  TransactionStatus,
  TransactionStatusAction,
  type LifecycleStatus,
} from "@coinbase/onchainkit/transaction";
import { useMemo, useEffect, useState, useCallback } from "react";
import { encode, getContract, keccak256, ZERO_ADDRESS } from "thirdweb";
import { isAddressEqual, type Hex } from "viem";
import { toast } from "react-toastify";
import { createPack } from "~/thirdweb/8453/0x1b6e902360035ac523e27d8fe69140a271ab9e7c";
import { allowance, approve as approveERC20 } from "thirdweb/extensions/erc20";
import { approve as approveERC721 } from "thirdweb/extensions/erc721";
import { setApprovalForAll as setApprovalForAllERC1155 } from "thirdweb/extensions/erc1155";
import { CHAIN, GIFT_PACK_ADDRESS, CLIENT } from "~/constants";
import { InputSecret } from "./SecretInput";
import { InputResolution } from "./ResolutionInput";

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

export const CreateGiftFormSchema = z.object({
  usdcAmount: z.string({
    required_error: "Please enter an amount.",
  }),
  baseName: z.string({
    required_error: "Please select a base name.",
  }),
  giftCard: z.string({
    required_error: "Please select a gift card.",
  }),
  secret: z.string({
    required_error: "Please enter secret words.",
  }),
  resolution: z.string({
    required_error: "Please enter a new year's resolution.",
  }),
});

export function CreateGiftForm() {
  const { address } = useAccount();
  const { selectedAssets, hash } = useGiftItems();
  const { data, fetchNextPage } = api.wallet.getBalances.useInfiniteQuery(
    {
      address: address ?? "",
      nftsFirst: 12,
    },
    {
      enabled: !!address,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      getNextPageParam: (lastPage: WalletBalancesResponse) => {
        if (!lastPage.nftPageInfo?.hasNextPage) {
          return undefined;
        }
        return {
          nftsAfter: lastPage.nftPageInfo.endCursor,
        };
      },
    },
  );
  const form = useForm<z.infer<typeof CreateGiftFormSchema>>({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    resolver: zodResolver(CreateGiftFormSchema),
  });

  const erc20s = selectedAssets.erc20;
  const erc721s = selectedAssets.erc721;
  const erc1155s = selectedAssets.erc1155;
  const ethAmount = selectedAssets.ethAmount;

  const allTokens = data?.pages[0]?.tokenBalances ?? [];
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const baseNameNfts = data?.pages.flatMap((page) => page.baseNameNfts) ?? [];
  const lastPage = data?.pages[data.pages.length - 1];

  const loadMoreNfts = () => {
    if (lastPage?.nftPageInfo?.hasNextPage) {
      void fetchNextPage();
    }
  };
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
      // erc20Tokens: erc20s
      //   .filter(({ token }) => !isAddressEqual(token, ZERO_ADDRESS))
      //   .map(({ token, amount }) => ({
      //     tokenAddress: token,
      //     amount: BigInt(amount),
      //   })),
      erc20Tokens: [
        {
          tokenAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
          amount: BigInt(5000000),
        },
      ],
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
  ]);

  function onSubmit(data: z.infer<typeof CreateGiftFormSchema>) {
    console.log(data);
  }

  const { mutateAsync: open, isPending } = api.engine.openPack.useMutation();
  return (
    <Form {...form}>
      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <InputUSDC form={form} allTokens={allTokens} />
        <InputSecret form={form} />
        <InputResolution form={form} />
        <BaseNameSelector form={form} baseNameNfts={baseNameNfts} />
        <Transaction calls={calls} isSponsored>
          <TransactionButton
            disabled={isPending || !address}
            text="Create Gift"
            className="-mb-1 h-[46px] w-full rounded-full bg-[#2455FF] px-6 text-sm font-bold text-white hover:opacity-80 disabled:bg-gray-400"
          />
          <TransactionStatus>
            <TransactionStatusLabel />
            <TransactionStatusAction />
          </TransactionStatus>
        </Transaction>
      </form>
    </Form>
  );
}
