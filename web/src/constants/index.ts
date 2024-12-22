import { createThirdwebClient, defineChain } from "thirdweb";
import { env } from "~/env";
import { baseSepolia } from "wagmi/chains";

export const APP_NAME = "Onchain Gifting";

export const CHRISTMAS_PACK_ADDRESS = "0xFceDd91B776BeFF7abD417CDeaf83cbcC8cBffA2";

export const WAGMI_CHAIN = baseSepolia;
export const CHAIN = defineChain(WAGMI_CHAIN);

export const CLIENT = createThirdwebClient({
  clientId: env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
});

export const UNKNOWN_TOKEN_IMAGE = 'https://static.coingecko.com/s/missing_thumb_2x-38c6e63b2e37f3b16510adf55368db6d8d8e6385629f6e9d41557762b25a6eeb.png';
