import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { env } from "~/env";
import {
  type ZapperNFTResponse,
  type ZapperPortfolioResponse,
  type WalletBalancesResponse,
  type ZapperTokenBalance,
} from "~/types/zapper";

export const walletRouter = createTRPCRouter({
  getBalances: publicProcedure
    .input(
      z.object({
        address: z.string(),
        cursor: z
          .object({
            nftsAfter: z.string().optional(),
          })
          .optional(),
        nftsFirst: z.number().default(12),
      }),
    )
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

      const baseNameNftQuery = `
        query GetNFTs($owners: [Address!]!, $network: Network, $first: Int, $after: String, $baseNameCollectionId: [ID!]) {
          nftUsersTokens(owners: $owners, network: $network, first: $first, after: $after, collectionIds: $baseNameCollectionId) {
            pageInfo {
              hasNextPage
              endCursor
            }
            edges {
              node {
                tokenId
                name
                description
                collection {
                  id
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

      const giftCardQuery = `
        query GetNFTs($owners: [Address!]!, $network: Network, $first: Int, $after: String, $giftCardQueryCollectionId: [ID!]) {
          nftUsersTokens(owners: $owners, network: $network, first: $first, after: $after, collectionIds: $giftCardQueryCollectionId) {
            pageInfo {
              hasNextPage
              endCursor
            }
            edges {
              node {
                tokenId
                name
                description
                collection {
                  id
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
        network: "BASE_MAINNET",
        first: input.nftsFirst,
        after: input.cursor?.nftsAfter,
        baseNameCollectionId: ["TmZ0Q29sbGVjdGlvbi0yMTM1OTU1NA=="],
        giftCardQueryCollectionId: ["TmZ0Q29sbGVjdGlvbi0yMTM1OTU1NA=="],
      };
      console.log({ variables });

      const [portfolioResponse, nftResponse, giftCardRespone] =
        await Promise.all([
          fetch("https://public.zapper.xyz/graphql", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Basic ${Buffer.from(env.ZAPPER_API_KEY).toString("base64")}`,
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
              Authorization: `Basic ${Buffer.from(env.ZAPPER_API_KEY).toString("base64")}`,
            },
            body: JSON.stringify({
              query: baseNameNftQuery,
              variables,
            }),
          }),
          fetch("https://public.zapper.xyz/graphql", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Basic ${Buffer.from(env.ZAPPER_API_KEY).toString("base64")}`,
            },
            body: JSON.stringify({
              query: giftCardQuery,
              variables,
            }),
          }),
        ]);

      const [portfolioData, nftData, giftCardData] = await Promise.all([
        portfolioResponse.json() as Promise<ZapperPortfolioResponse>,
        nftResponse.json() as Promise<ZapperNFTResponse>,
        giftCardRespone.json() as Promise<ZapperNFTResponse>,
      ]);

      if (portfolioData.errors) {
        throw new Error(
          portfolioData.errors[0]?.message ?? "Failed to fetch portfolio data",
        );
      }

      if (nftData.errors) {
        throw new Error(
          nftData.errors[0]?.message ?? "Failed to fetch NFT data",
        );
      }

      if (giftCardData.errors) {
        throw new Error(
          giftCardData.errors[0]?.message ?? "Failed to fetch NFT data",
        );
      }

      const { portfolio } = portfolioData.data;
      const tokenBalances =
        portfolio.tokenBalances as unknown as ZapperTokenBalance[];
      const baseNameNfts = nftData.data.nftUsersTokens.edges.map(
        (edge) => edge.node,
      );
      const giftCardNfts = giftCardData.data.nftUsersTokens.edges.map(
        (edge) => edge.node,
      );
      const nftPageInfo = nftData.data.nftUsersTokens.pageInfo;

      // console.log({ nfts });
      // print nfts collection
      // nfts.forEach((nft) => {
      //   console.log(nft.collection);
      // });
      // console.log({ tokenBalances });
      ///priny token balances
      tokenBalances.forEach((token) => {
        console.log(token.token.baseToken);
      });
      return {
        ...portfolio,
        tokenBalances,
        baseNameNfts,
        nftPageInfo,
        giftCardNfts,
      };
    }),
});
