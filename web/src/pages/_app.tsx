import { type AppType } from "next/dist/shared/lib/utils";
import { ThirdwebProvider } from "thirdweb/react";
import { api } from "~/utils/api";
import '@coinbase/onchainkit/styles.css'; 
import "~/styles/globals.css";
import { GiftItemsProvider } from "~/contexts/GiftItemsContext";
import { OnchainProviders } from "~/providers/OnchainProviders";
import { Layout } from "~/components/utils/Layout";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <GiftItemsProvider>
      <ThirdwebProvider>
        <OnchainProviders>
          <Layout>
            <Component {...pageProps} />
          </Layout>
          <div id="portal" />
        </OnchainProviders>
      </ThirdwebProvider>
    </GiftItemsProvider>
  );
};

export default api.withTRPC(MyApp);
