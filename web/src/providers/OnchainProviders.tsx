import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode, useState } from 'react';
import { type State, WagmiProvider } from 'wagmi';
import { APP_NAME, WAGMI_CHAIN } from '~/constants';
import { getConfig } from '~/constants/wagmi';
import { env } from '~/env';
 
export function OnchainProviders(props: {
  children: ReactNode;
  initialState?: State;
}) {
  const [config] = useState(() => getConfig());
  const [queryClient] = useState(() => new QueryClient());
 
  return (
    <WagmiProvider config={config} initialState={props.initialState}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={env.NEXT_PUBLIC_ONCHAIN_API_KEY}
          chain={WAGMI_CHAIN}
          config={{
            appearance: {
              name: APP_NAME,
              logo: "https://onchaingift.com/images/logo.png",
              mode: 'auto',
              theme: 'light',
            },
            wallet: { 
              display: 'modal',
            },
          }}
        >
          {props.children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}