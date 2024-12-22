import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { env } from "~/env";

export const walletRouter = createTRPCRouter({
  getBalances: publicProcedure
    .input(z.object({ address: z.string() }))
    .query(async ({ input }) => {
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
        portfolioResponse.json(),
        nftResponse.json()
      ]);

      console.log('Portfolio Response:', JSON.stringify(portfolioData, null, 2));
      console.log('NFT Response:', JSON.stringify(nftData, null, 2));

      if (portfolioData.errors) {
        throw new Error(portfolioData.errors[0]?.message ?? "Failed to fetch portfolio data");
      }

      if (nftData.errors) {
        throw new Error(nftData.errors[0]?.message ?? "Failed to fetch NFT data");
      }

      return {
        ...portfolioData.data.portfolio,
        nfts: nftData.data.nftUsersTokens
      };
    }),
});
