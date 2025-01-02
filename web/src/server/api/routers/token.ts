import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { CHAIN, UNKNOWN_TOKEN_IMAGE, CLIENT } from "~/constants";
import { base } from "thirdweb/chains";
import { getChainMetadata } from "thirdweb/chains";
import { NATIVE_TOKEN_ADDRESS, getContract, readContract, toTokens } from "thirdweb";
import { customTokenList } from "~/constants/token_lists/custon";
import { type ZapperTokenBalance } from "~/types/zapper";

export const tokenRouter = createTRPCRouter({
  getImage: publicProcedure
    .input(z.object({ tokenAddress: z.string() }))
    .query(async ({ input }) => {
      const tokenIsNative = input.tokenAddress.toLowerCase() === NATIVE_TOKEN_ADDRESS;
      const chainMetadata = await getChainMetadata(CHAIN);
      if (tokenIsNative && chainMetadata?.icon?.url) {
        return chainMetadata.icon.url;
      }
      // before making any external calls, lets check the hardcoded json for a fast lookup
      const tokenInCustomList = customTokenList.tokens.find((t) => t.address.toLowerCase() === input.tokenAddress.toLowerCase());
      if (tokenInCustomList?.logoURI) {
        return tokenInCustomList.logoURI;
      }
      const tokenInList = customTokenList.tokens.find((t) => t.address.toLowerCase() === input.tokenAddress.toLowerCase());
      if (tokenInList?.logoURI) {
        return tokenInList.logoURI;
      }

      type ChainNames = Record<string, string>;
      const coingeckoChainNames = { [base.id]: "base" } as ChainNames;
      const chainName = coingeckoChainNames[CHAIN.id];
      if (!chainName) throw new Error(`Chain ${CHAIN.id} not supported by coingecko`);
      const res = await fetch(`https://api.coingecko.com/api/v3/coins/${chainName}/contract/${input.tokenAddress}`);
      const json = (await res.json()) as { image: { large: string } };
      return json.image?.large ?? UNKNOWN_TOKEN_IMAGE;
    }),

  getCustomToken: publicProcedure
    .input(z.object({ 
      tokenAddress: z.string(),
      userAddress: z.string(),
    }))
    .query(async ({ input }) => {
      const contract = getContract({
        client: CLIENT,
        chain: CHAIN,
        address: input.tokenAddress,
      });

      const [name, symbol, decimals, balance] = await Promise.all([
        readContract({
          contract,
          method: [
            "0x06fdde03",
            [],
            [{ internalType: "string", name: "", type: "string" }]
          ],
          params: []
        }),
        readContract({
          contract,
          method: [
            "0x95d89b41",
            [],
            [{ internalType: "string", name: "", type: "string" }]
          ],
          params: []
        }),
        readContract({
          contract,
          method: [
            "0x313ce567",
            [],
            [{ internalType: "uint8", name: "", type: "uint8" }]
          ],
          params: []
        }),
        readContract({
          contract,
          method: [
            "0x70a08231",
            [{ internalType: "address", name: "account", type: "address" }],
            [{ internalType: "uint256", name: "", type: "uint256" }]
          ],
          params: [input.userAddress]
        })
      ]);

      const imageUrl = await tokenRouter.createCaller({}).getImage({ tokenAddress: input.tokenAddress });
      const chainName = CHAIN.name ?? "Base";

      const customToken: ZapperTokenBalance = {
        address: input.tokenAddress,
        network: chainName,
        token: {
          balance: toTokens(balance, Number(decimals)),
          balanceUSD: 0,
          baseToken: {
            address: input.tokenAddress,
            decimals: Number(decimals),
            imgUrl: imageUrl,
            name,
            symbol,
            network: chainName,
          },
        },
      };

      return customToken;
    }),
});
