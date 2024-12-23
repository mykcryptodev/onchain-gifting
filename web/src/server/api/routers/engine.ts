import { Hex } from "thirdweb";
import { z } from "zod";
import { CHAIN, GIFT_PACK_ADDRESS } from "~/constants";
import { env } from "~/env";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const engineRouter = createTRPCRouter({
  openPack: publicProcedure
    .input(z.object({ 
      secret: z.string(),
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
            functionName: "openPack",
            args: [
              input.secret,
              input.recipient,
            ],
          }),
        },
      );
       
      const { result } = await resp.json() as { result: Hex };
      console.log({ result });
      return result;
    })
});
