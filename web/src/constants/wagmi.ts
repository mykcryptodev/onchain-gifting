import { http, cookieStorage, createConfig, createStorage } from 'wagmi';
import { coinbaseWallet } from 'wagmi/connectors';
import { WAGMI_CHAIN } from '.';
import { env } from '~/env';
 
export function getConfig() {
  return createConfig({
    chains: [WAGMI_CHAIN], // add baseSepolia for testing
    connectors: [
      coinbaseWallet({
        appName: 'OnchainKit',
        preference: 'smartWalletOnly',
        version: '4',
      }),
    ],
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
      [WAGMI_CHAIN.id]: http(`https://${WAGMI_CHAIN.id}.rpc.thirdweb.com/${env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}`),
    },
  });
}
 
declare module 'wagmi' {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
}