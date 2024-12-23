import { getContract } from "thirdweb";
import { z } from "zod";
import { CHAIN, CLIENT, GIFT_PACK_ADDRESS } from "~/constants";
import { env } from "~/env";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { isHashUsed } from "~/thirdweb/8453/0x1b6e902360035ac523e27d8fe69140a271ab9e7c";

export const engineRouter = createTRPCRouter({
  openPack: publicProcedure
    .input(z.object({ 
      password: z.string(),
      recipient: z.string(),
    }))
    .mutation(async ({ input }) => {
      const resp = await fetch(
        `${env.THIRDWEB_ENGINE_URL}/contract/${CHAIN.id}/${GIFT_PACK_ADDRESS}/write`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${env.THIRDWEB_ENGINE_ACCESS_TOKEN}`,
            "x-backend-wallet-address": "0xb503723beC0E8142aC24aCf55Fc11c7fC809e723",
          },
          body: JSON.stringify({
            functionName: "openPackWithPassword",
            args: [
              input.password,
              input.recipient,
            ],
          }),
        },
      );
       
      return await resp.json() as { queueId: string };
    }),
  getIsHashUsed: publicProcedure
    .input(z.object({ 
      hash: z.string(),
    }))
    .query(async ({ input }) => {
      const contract = getContract({
        address: GIFT_PACK_ADDRESS,
        client: CLIENT,
        chain: CHAIN,
      });
      return await isHashUsed({ 
        contract,
        hash: input.hash as `0x${string}`,
      });
    })
});
