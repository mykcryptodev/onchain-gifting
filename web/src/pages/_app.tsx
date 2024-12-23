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
const MyApp: AppType = ({ Component, pageProps }) => {
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

export default api.withTRPC(MyApp);
