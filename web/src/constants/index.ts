import { createThirdwebClient } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { env } from "~/env";

export const CHRISTMAS_PACK_ADDRESS = "0xFceDd91B776BeFF7abD417CDeaf83cbcC8cBffA2";
export const CHAIN = baseSepolia;
export const CLIENT = createThirdwebClient({
  clientId: env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
});
