export type Pack = {
  creator: string;
  erc20Tokens: readonly {
    tokenAddress: string;
    amount: bigint;
  }[];
  erc721Tokens: readonly {
    tokenAddress: string;
    tokenId: bigint;
  }[];
  erc1155Tokens: readonly {
    tokenAddress: string;
    tokenId: bigint;
    amount: bigint;
  }[];
  opened: boolean;
  ethAmount: bigint;
};
