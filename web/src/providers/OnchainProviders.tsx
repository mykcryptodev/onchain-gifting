'use client';

import { OnchainKitProvider } from '@coinbase/onchainkit';
import { type ReactNode } from 'react';
import { type State } from 'wagmi';
import { APP_NAME, WAGMI_CHAIN } from '~/constants';
import { env } from '~/env';
 
export default function OnchainProviders(props: {
  children: ReactNode;
  initialState?: State;
}) {
  return (
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
      }}
    >
      {props.children}
    </OnchainKitProvider>
  );
}