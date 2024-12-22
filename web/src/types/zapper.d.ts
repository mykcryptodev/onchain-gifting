export interface ZapperPortfolioResponse {
  data: {
    portfolio: {
      tokenBalances: Array<{
        address: string;
        network: string;
        token: {
          balanceUSD: number;
          balance: string;
          baseToken: {
            symbol: string;
            network: string;
            imgUrl: string;
            name: string;
            decimals: number;
          };
        };
      }>;
      nftBalances: Array<{
        network: string;
        balanceUSD: number;
        collection: {
          id: string;
          name: string;
          floorPrice: number;
          floorPriceUSD: number;
          img: string;
          imgBanner: string;
          imgProfile: string;
          imgFeatured: string;
          description: string;
          owners: number;
          items: number;
          volume24h: number;
          volume24hUSD: number;
        };
        assets: Array<{
          balance: number;
          balanceUSD: number;
          assetImg: string;
          assetName: string;
          tokenId: string;
        }>;
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