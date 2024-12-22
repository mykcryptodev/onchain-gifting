import { api } from "~/utils/api";
import { TokenOption } from "./TokenOption";
import { type FC } from "react";

export const WalletBalances: FC<{ address: string }> = ({ address }) => {
  const { data, isLoading } = api.wallet.getBalances.useQuery({ address }, {
    enabled: !!address,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  console.log({data, isLoading});

  return (
    <div className="flex flex-col gap-4">
      {data?.tokenBalances.filter((tokenBalance) => tokenBalance.token.balanceUSD > 0.01).map((tokenBalance) => {
        return <TokenOption key={tokenBalance.address} option={tokenBalance} />
      })}
    </div>
  )
};
