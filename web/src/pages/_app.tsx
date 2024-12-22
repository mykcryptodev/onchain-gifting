import { type AppType } from "next/dist/shared/lib/utils";
import { ThirdwebProvider } from "thirdweb/react";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { env } from "~/env";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { WAGMI_CHAIN } from "~/constants";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ThirdwebProvider>
      <OnchainKitProvider
        apiKey={env.NEXT_PUBLIC_ONCHAIN_API_KEY}
        chain={WAGMI_CHAIN}
      >
        <Component {...pageProps} />
      </OnchainKitProvider>
    </ThirdwebProvider>
  );
};

export default api.withTRPC(MyApp);
