import { http, cookieStorage, createConfig, createStorage } from 'wagmi';
import { coinbaseWallet, metaMask, walletConnect} from 'wagmi/connectors';
import { WAGMI_CHAIN } from '.';
import { env } from '~/env';
import { frameConnector } from '~/lib/connector';

export function getConfig(isInFrame: boolean) {
  const baseConnectors = [
    coinbaseWallet({
      appName: 'Onchain Gifting',
      preference: 'all',
      version: '4',
      appLogoUrl: 'https://onchaingift.com/images/logo.png',
    }),
    metaMask(),
    walletConnect({
      projectId: 'c4d3090a956c5b2d21f433c265a76830'
    }),
  ];

  // Only add Frame connector if available
  if (isInFrame) {
    baseConnectors.push(frameConnector());
  }

  return createConfig({
    chains: [WAGMI_CHAIN],
    connectors: baseConnectors,
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