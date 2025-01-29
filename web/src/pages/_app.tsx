import { type AppType } from "next/dist/shared/lib/utils";
import { ThirdwebProvider } from "thirdweb/react";
import { api } from "~/utils/api";
import '@coinbase/onchainkit/styles.css'; 
import "react-toastify/dist/ReactToastify.css";
import "~/styles/globals.css";
import { GiftItemsProvider } from "~/contexts/GiftItemsContext";
import { OnchainProviders } from "~/providers/OnchainProviders";
import { Layout } from "~/components/utils/Layout";
import { ToastContainer } from "react-toastify";
import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';

const MyApp: AppType = ({ Component, pageProps }: AppProps) => {
  return (
    <GiftItemsProvider>
      <ThirdwebProvider>
        <OnchainProviders>
          <Layout>
            <Component {...pageProps} />
          </Layout>
          <ToastContainer />
          <div id="portal" />
        </OnchainProviders>
      </ThirdwebProvider>
    </GiftItemsProvider>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
export default api.withTRPC(appWithTranslation(MyApp));
