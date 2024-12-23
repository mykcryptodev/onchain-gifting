import { type FC } from "react";
import { useReadContract } from "thirdweb/react";
import { CHAIN, CLIENT, UNKNOWN_TOKEN_IMAGE } from "~/constants";
import { api } from "~/utils/api";
import { getContract, toTokens, ZERO_ADDRESS } from "thirdweb";
import { type Token, TokenRow } from '@coinbase/onchainkit/token';
import { isAddressEqual } from "viem";
type Props = {
  tokenAddress: string;
  amount: string;
}

export const ClaimedToken: FC<Props> = ({ tokenAddress, amount }) => {
  const { data: tokenImage } = api.token.getImage.useQuery({
    tokenAddress,
  });
  const contract = getContract({
    client: CLIENT,
    chain: CHAIN,
    address: tokenAddress,
  });
  const { data: tokenDecimals } = useReadContract({
    contract,
    method: "function decimals() external view returns (uint8)",
  });
  const {data: tokenName} = useReadContract({
    contract,
    method: "function name() external view returns (string)",
  });
  const {data: tokenSymbol} = useReadContract({
    contract,
    method: "function symbol() external view returns (string)",
  });

  const erc20Token: Token = {
    address: tokenAddress,
    chainId: CHAIN.id,
    decimals: tokenDecimals ?? 18,
    name: tokenName ?? "Unknown",
    symbol: tokenSymbol ?? "Unknown",
    image: tokenImage ?? UNKNOWN_TOKEN_IMAGE,
  };

  const ethToken: Token = {
    address: ZERO_ADDRESS,
    chainId: CHAIN.id,
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
    image: "https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png",
  };

  const token = isAddressEqual(tokenAddress, ZERO_ADDRESS) ? ethToken : erc20Token;

  return (
    <TokenRow 
      className="w-full rounded-lg min-w-[300px]"
      token={token} 
      amount={toTokens(BigInt(amount), tokenDecimals ?? 18)} 
    />
  );
};
