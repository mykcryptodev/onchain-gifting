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

interface ComputeBalancesResponse {
  data: {
    computeTokenBalances: {
      jobId: string;
    };
  };
  errors?: Array<{ message: string }>;
}

interface JobStatusResponse {
  data: {
    balanceJobStatus: {
      status: "pending" | "completed" | "failed";
    };
  };
  errors?: Array<{ message: string }>;
}

// In-memory store for rate limiting
const lastComputeRequestByAddress = new Map<string, number>();
const COMPUTE_COOLDOWN_MS = 30000; // 30 seconds between compute requests per address

// Feature flag to disable balance computation
const ENABLE_BALANCE_COMPUTATION = true

export const walletRouter = createTRPCRouter({
  computeBalances: publicProcedure
    .input(z.object({
      address: z.string(),
    }))
    .mutation(async ({ input }) => {
      if (!ENABLE_BALANCE_COMPUTATION) {
        throw new Error("Balance computation is currently disabled");
      }

      // Check if we're within the cooldown period
      const lastRequest = lastComputeRequestByAddress.get(input.address);
      const now = Date.now();
      if (lastRequest && now - lastRequest < COMPUTE_COOLDOWN_MS) {
        const remainingCooldown = Math.ceil((COMPUTE_COOLDOWN_MS - (now - lastRequest)) / 1000);
        throw new Error(`Please wait ${remainingCooldown} seconds before requesting another balance computation`);
      }

      const computeQuery = `
        mutation ComputeTokenBalances($input: PortfolioInput!) {
          computeTokenBalances(input: $input) {
            jobId
          }
        }
      `;

      const computeResponse = await fetch("https://public.zapper.xyz/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${Buffer.from(env.ZAPPER_API_KEY).toString('base64')}`,
        },
        body: JSON.stringify({
          query: computeQuery,
          variables: {
            input: {
              addresses: [input.address],
              networks: ["BASE_MAINNET"],
            },
          },
        }),
      });

      if (computeResponse.status === 429) {
        throw new Error("Rate limit exceeded. Please try again later.");
      }

      const computeData = await computeResponse.json() as ComputeBalancesResponse;

      if (computeData.errors) {
        const errorMessage = computeData.errors[0]?.message;
        if (errorMessage?.toLowerCase().includes("rate limit")) {
          throw new Error("Rate limit exceeded. Please try again later.");
        }
        throw new Error(errorMessage ?? "Failed to compute balances");
      }

      // Update the last request timestamp
      lastComputeRequestByAddress.set(input.address, now);

      return { jobId: computeData.data.computeTokenBalances.jobId };
    }),

  checkBalanceStatus: publicProcedure
    .input(z.object({
      jobId: z.string(),
    }))
    .query(async ({ input }) => {
      if (!ENABLE_BALANCE_COMPUTATION) {
        throw new Error("Balance computation is currently disabled");
      }

      const statusQuery = `
        query BalanceJobStatus($jobId: String!) {
          balanceJobStatus(jobId: $jobId) {
            status
          }
        }
      `;

      const statusResponse = await fetch("https://public.zapper.xyz/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${Buffer.from(env.ZAPPER_API_KEY).toString('base64')}`,
        },
        body: JSON.stringify({
          query: statusQuery,
          variables: { jobId: input.jobId },
        }),
      });

      if (statusResponse.status === 429) {
        throw new Error("Rate limit exceeded. Please try again later.");
      }

      const statusData = await statusResponse.json() as JobStatusResponse;

      if (statusData.errors) {
        const errorMessage = statusData.errors[0]?.message;
        if (errorMessage?.toLowerCase().includes("rate limit")) {
          throw new Error("Rate limit exceeded. Please try again later.");
        }
        throw new Error(errorMessage ?? "Failed to check job status");
      }

      return {
        status: statusData.data.balanceJobStatus.status,
      };
    }),

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
