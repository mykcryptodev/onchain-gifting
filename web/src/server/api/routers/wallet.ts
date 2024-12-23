import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { env } from "~/env";
import { type ZapperNFTResponse, type ZapperPortfolioResponse, type WalletBalancesResponse } from "~/types/zapper";

export const walletRouter = createTRPCRouter({
  getBalances: publicProcedure
    .input(z.object({ address: z.string() }))
    .query(async ({ input }): Promise<WalletBalancesResponse> => {
      const portfolioQuery = `
        query GetCompletePortfolio($addresses: [Address!]!, $networks: [Network!]) {
          portfolio(addresses: $addresses, networks: $networks) {
            tokenBalances {
              address
              network
              token {
                balanceUSD
                balance
                baseToken {
                  address
                  symbol
                  network
                  imgUrl
                  name
                  decimals
                }
              }
            }
            nftBalances {
              network
              balanceUSD
            }
            totals {
              total
              totalWithNFT
              totalByNetwork {
                network
                total
              }
            }
          }
        }
      `;

      const nftQuery = `
        query GetNFTs($owners: [Address!]!, $network: Network) {
          nftUsersTokens(owners: $owners, network: $network) {
            edges {
              node {
                tokenId
                name
                description
                collection {
                  name
                  address
                  floorPrice {
                    valueUsd
                  }
                }
                estimatedValue {
                  valueUsd
                }
                lastSale {
                  valueUsd
                }
                mediasV2 {
                  ... on Image {
                    url
                  }
                  ... on Animation {
                    url
                  }
                }
              }
            }
          }
        }
      `;

      const variables = {
        addresses: [input.address],
        owners: [input.address],
        networks: ["BASE_MAINNET"],
        network: "BASE_MAINNET"
      };

      const [portfolioResponse, nftResponse] = await Promise.all([
        fetch("https://public.zapper.xyz/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${Buffer.from(env.ZAPPER_API_KEY).toString('base64')}`,
          },
          body: JSON.stringify({
            query: portfolioQuery,
            variables,
          }),
        }),
        fetch("https://public.zapper.xyz/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${Buffer.from(env.ZAPPER_API_KEY).toString('base64')}`,
          },
          body: JSON.stringify({
            query: nftQuery,
            variables,
          }),
        })
      ]);

      const [portfolioData, nftData] = await Promise.all([
        portfolioResponse.json() as Promise<ZapperPortfolioResponse>,
        nftResponse.json() as Promise<ZapperNFTResponse>
      ]);

      if (portfolioData.errors) {
        throw new Error(portfolioData.errors[0]?.message ?? "Failed to fetch portfolio data");
      }

      if (nftData.errors) {
        throw new Error(nftData.errors[0]?.message ?? "Failed to fetch NFT data");
      }

      const { portfolio } = portfolioData.data;
      const nfts = nftData.data.nftUsersTokens.edges.map(edge => edge.node);

      return {
        ...portfolio,
        nfts
      };
    }),
});
