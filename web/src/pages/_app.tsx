import { type AppType } from "next/dist/shared/lib/utils";
import { ThirdwebProvider } from "thirdweb/react";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { env } from "~/env";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { WAGMI_CHAIN } from "~/constants";
import { GiftItemsProvider } from "~/contexts/GiftItemsContext";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <GiftItemsProvider>
      <ThirdwebProvider>
        <OnchainKitProvider
          apiKey={env.NEXT_PUBLIC_ONCHAIN_API_KEY}
          chain={WAGMI_CHAIN}
        >
          <Component {...pageProps} />
        </OnchainKitProvider>
      </ThirdwebProvider>
    </GiftItemsProvider>
  );
};

export default api.withTRPC(MyApp);
