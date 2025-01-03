import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { env } from "~/env";
import { type ZapperNFTResponse, type ZapperPortfolioResponse, type WalletBalancesResponse, type ZapperTokenBalance } from "~/types/zapper";

interface CollectionsResponse {
  data: {
    nftUsersCollections: {
      edges: Array<{
        node: {
          id: string;
        };
      }>;
    };
  };
  errors?: Array<{ message: string }>;
}

export const walletRouter = createTRPCRouter({
  getBalances: publicProcedure
    .input(z.object({ 
      address: z.string(),
      cursor: z.object({
        nftsAfter: z.string().optional(),
      }).optional(),
      nftsFirst: z.number().default(12),
      search: z.string().optional()
    }))
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

      const collectionsQuery = `
        query GetCollections($owners: [Address!]!, $network: Network, $search: String) {
          nftUsersCollections(owners: $owners, network: $network, search: $search) {
            edges {
              node {
                id
              }
            }
          }
        }
      `;

      const nftQuery = `
        query GetNFTs($owners: [Address!]!, $network: Network, $first: Int, $after: String, $collectionIds: [ID!]) {
          nftUsersTokens(owners: $owners, network: $network, first: $first, after: $after, collectionIds: $collectionIds) {
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
                mediasV3 {
                  images {
                    edges {
                      node {
                        original
                        thumbnail
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `;

      const baseVariables = {
        addresses: [input.address],
        owners: [input.address],
        networks: ["BASE_MAINNET"],
        network: "BASE_MAINNET",
      };

      const [portfolioResponse, collectionsResponse] = await Promise.all([
        fetch("https://public.zapper.xyz/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${Buffer.from(env.ZAPPER_API_KEY).toString('base64')}`,
          },
          body: JSON.stringify({
            query: portfolioQuery,
            variables: baseVariables,
          }),
        }),
        input.search ? fetch("https://public.zapper.xyz/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${Buffer.from(env.ZAPPER_API_KEY).toString('base64')}`,
          },
          body: JSON.stringify({
            query: collectionsQuery,
            variables: {
              ...baseVariables,
              search: input.search,
            },
          }),
        }) : Promise.resolve(null)
      ]);

      const [portfolioData, collectionsData] = await Promise.all([
        portfolioResponse.json() as Promise<ZapperPortfolioResponse>,
        collectionsResponse ? (collectionsResponse.json() as Promise<CollectionsResponse>) : null,
      ]);

      if (portfolioData.errors) {
        throw new Error(portfolioData.errors[0]?.message ?? "Failed to fetch portfolio data");
      }

      if (collectionsData?.errors) {
        throw new Error(collectionsData.errors[0]?.message ?? "Failed to fetch collections data");
      }

      // Get collection IDs if we performed a search
      const collectionIds = collectionsData?.data.nftUsersCollections.edges.map(edge => edge.node.id);

      // Only fetch NFTs if we either have no search term or have found matching collections
      const nftResponse = (!input.search || (collectionIds && collectionIds.length > 0)) ? 
        await fetch("https://public.zapper.xyz/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${Buffer.from(env.ZAPPER_API_KEY).toString('base64')}`,
          },
          body: JSON.stringify({
            query: nftQuery,
            variables: {
              ...baseVariables,
              first: input.nftsFirst,
              after: input.cursor?.nftsAfter,
              ...(collectionIds ? { collectionIds } : {}),
            },
          }),
        }) : null;

      const nftData = nftResponse ? (await nftResponse.json() as ZapperNFTResponse) : null;

      if (nftData?.errors) {
        throw new Error(nftData.errors[0]?.message ?? "Failed to fetch NFT data");
      }

      const { portfolio } = portfolioData.data;
      const tokenBalances = portfolio.tokenBalances as unknown as ZapperTokenBalance[];
      const nfts = nftData?.data.nftUsersTokens.edges.map(edge => edge.node) ?? [];
      const nftPageInfo = nftData?.data.nftUsersTokens.pageInfo ?? { hasNextPage: false, endCursor: "" };

      return {
        ...portfolio,
        tokenBalances,
        nfts,
        nftPageInfo,
      };
    }),
});
