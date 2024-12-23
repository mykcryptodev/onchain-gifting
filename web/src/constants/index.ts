import { createThirdwebClient, defineChain } from "thirdweb";
import { env } from "~/env";
import { base } from "wagmi/chains";

export const APP_NAME = "Onchain Gifting";

export const GIFT_PACK_ADDRESS = "0x1de1cedec09bb1a3dd5bfacc0540d9c1f836e6f2";// "0xA9Dc74673fb099885e830eb534b89e65Dd5a68f6";

export const WAGMI_CHAIN = base;
export const CHAIN = defineChain(WAGMI_CHAIN);

export const CLIENT = createThirdwebClient({
  clientId: env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
});

export const UNKNOWN_TOKEN_IMAGE = 'https://static.coingecko.com/s/missing_thumb_2x-38c6e63b2e37f3b16510adf55368db6d8d8e6385629f6e9d41557762b25a6eeb.png';
