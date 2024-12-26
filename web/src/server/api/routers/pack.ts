import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { env } from "~/env";

export type Pack = {
  id: number;
  opener: string;
  openedAtTimestamp: string;
  creator: string;
  createdAtTimestamp: string;
}
type PackMetadata = {
  data: {
    pack: Pack | null;
  };
};
type PackMetadataResponse = {
  data: {
    packs: {
      items: Pack[];
    };
  };
};

export const packRouter = createTRPCRouter({
  getPackMetadataById: publicProcedure
    .input(z.object({
      tokenId: z.string(),
    }))
    .query(async ({ input }) => {
      const queryUrl = env.GHOST_QUERY_URL;
      const apiKey = env.GHOST_API_KEY;
      const query = `
        query GetPack($id: Number!) {
          pack(id: $id) {
            id
            opener
            openedAtTimestamp
            creator
            createdAtTimestamp
          }
        }
      `;

      try {
        const response = await fetch(queryUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            query,
            variables: {
              id: input.tokenId.toString()
            }
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = (await response.json()) as PackMetadata;
        const pack = data.data.pack;
        
        if (!pack) {
          throw new Error(`Pack with tokenId ${input.tokenId} not found`);
        }

        return pack;
      } catch (error) {
        console.error('Error fetching pack metadata:', error);
        throw error;
      }
    }),

  getPackMetadatasByCreator: publicProcedure
    .input(z.object({
      owner: z.string(),
    }))
    .query(async ({ input }) => {
      const queryUrl = env.GHOST_QUERY_URL;
      const apiKey = env.GHOST_API_KEY;

      const query = `
        query GetPacksByCreator($creator: String!) {
          packs(
            where: { creator: $creator }
            orderBy: "id"
            orderDirection: "desc"
          ) {
            items {
              id
              opener
              openedAtTimestamp
              creator
              createdAtTimestamp
            }
          }
        }
      `;

      try {
        const response = await fetch(queryUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-GHOST-KEY': apiKey,
          },
          body: JSON.stringify({
            query,
            variables: {
              creator: input.owner
            }
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = (await response.json()) as PackMetadataResponse;
        const packs = json.data.packs.items;

        return packs;
      } catch (error) {
        console.error('Error fetching pack metadata:', error);
        throw error;
      }
    }),
});

export default packRouter;
