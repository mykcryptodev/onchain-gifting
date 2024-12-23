export interface ZapperPortfolioResponse {
  data: {
    portfolio: {
      tokenBalances: ZapperTokenBalance[];
      nftBalances: Array<{
        network: string;
        balanceUSD: number;
      }>;
      totals: {
        total: number;
        totalWithNFT: number;
        totalByNetwork: Array<{
          network: string;
          total: number;
        }>;
      };
    };
  };
  errors?: Array<{ message: string }>;
}

export interface ZapperTokenBalance {
  address: string;
  network: string;
  token: {
    balanceUSD: number;
    balance: string;
    baseToken: {
      address: string;
      symbol: string;
      network: string;
      imgUrl: string;
      name: string;
      decimals: number;
    };
  };
}

export interface ZapperNFT {
  tokenId: string;
  name: string;
  description: string;
  collection: {
    name: string;
    address: string;
    floorPrice: {
      valueUsd: number;
    };
  };
  estimatedValue: {
    valueUsd: number;
  };
  lastSale: {
    valueUsd: number;
  };
  mediasV2: Array<{
    url: string;
  }>;
}

export interface ZapperNFTResponse {
  data: {
    nftUsersTokens: {
      edges: Array<{
        node: ZapperNFT;
      }>;
    };
  };
  errors?: Array<{ message: string }>;
}

export interface WalletBalancesResponse {
  tokenBalances: ZapperTokenBalance[];
  nftBalances: Array<{
    network: string;
    balanceUSD: number;
  }>;
  totals: {
    total: number;
    totalWithNFT: number;
    totalByNetwork: Array<{
      network: string;
      total: number;
    }>;
  };
  nfts: ZapperNFT[];
}

export interface WalletBalancesProps {
  address: string;
}

export interface TokenOptionProps {
  option: ZapperTokenBalance;
}