import { http, cookieStorage, createConfig, createStorage } from 'wagmi';
import { coinbaseWallet } from 'wagmi/connectors';
import { WAGMI_CHAIN } from '.';
 
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
      [WAGMI_CHAIN.id]: http(),
    },
  });
}
 
declare module 'wagmi' {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
}