import { api } from "~/utils/api";
import { useAccount } from "wagmi";
import dynamic from "next/dynamic";
import Pack from "~/components/My/Pack";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import type { GetStaticProps, GetStaticPaths } from "next";
import i18nConfig from "../../../next-i18next.config.js";

const WalletComponents = dynamic(() => import("~/components/utils/WalletComponents"), {
  ssr: false,
});

export default function From() {
  const router = useRouter();
  const { giver } = router.query as { giver: string };
  const { address } = useAccount();
  const [currentCursor, setCurrentCursor] = useState<string | null>(null);
  const { t } = useTranslation();
  const ITEMS_PER_PAGE = 25;

  const { data: packsData, refetch, isLoading } = api.pack.getPackMetadatasByCreator.useQuery({
    owner: giver ?? address ?? "",
    limit: ITEMS_PER_PAGE,
    after: currentCursor ?? undefined,
  }, {
    enabled: !!address,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const handleNextPage = useCallback(() => {
    if (packsData?.pageInfo.hasNextPage) {
      setCurrentCursor(packsData.pageInfo.endCursor);
    }
    // scroll to the top
    window.scrollTo(0, 0);
  }, [packsData]);

  const handlePreviousPage = useCallback(() => {
    if (packsData?.pageInfo.hasPreviousPage) {
      setCurrentCursor(packsData.pageInfo.startCursor);
    }
    // scroll to the top
    window.scrollTo(0, 0);
  }, [packsData]);

  if (!isLoading && (!packsData?.items || packsData.items.length === 0)) {
    return <div className="flex flex-col items-center justify-center w-full">
      <WalletComponents />
      <div className="flex flex-col my-4 gap-4 items-center justify-center w-full min-h-96">
        <div className="text-lg font-bold">{t('from_page.no_packs')}</div>
      </div>
    </div>;
  }

  if (isLoading || !packsData) {
    return <div className="flex flex-col items-center justify-center w-full gap-4">
      <WalletComponents />
      {Array.from({ length: 10 }).map((_, index) => (
        <div key={index} className="flex flex-col w-full max-w-sm gap-2 sm:p-8 p-4 border border-gray-200 rounded-lg p-4 relative">
          <div className="flex flex-col w-full justify-center items-center gap-2 animate-pulse">
            <div className="absolute top-6 right-6">
              <div className={`px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 h-6 w-12`} />
            </div>
            <div className="text-lg font-bold h-8 w-32 bg-gray-100 rounded-md" />
            <div className="h-32 w-32 bg-gray-100 rounded-md" />
            <div className="h-8 w-32 bg-gray-100 rounded-md" />
            <div className="h-12 w-56 bg-gray-100 rounded-md" />
            <div className="h-12 w-56 bg-gray-100 rounded-md" />
            <div className="h-12 w-56 bg-gray-100 rounded-md" />
          </div>
        </div>
      ))}
    </div>;
  }

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <WalletComponents />
      <div className="flex flex-col my-4 gap-4 items-center justify-center w-full">
        {packsData.items.map((pack) => (
          <Pack 
            key={pack.id} 
            tokenId={Number(pack.id)} 
            packMetadata={pack} 
            onReclaimed={() => {
              // wait 3 seconds before refetching
              setTimeout(() => {
                void refetch();
              }, 3000);
            }}
          />
        ))}
      </div>
      <div className="flex justify-center items-center gap-4 my-4">
        {packsData.pageInfo.hasPreviousPage && (
          <button
            onClick={handlePreviousPage}
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
          >
            {t('from_page.navigation.previous')}
          </button>
        )}
        {packsData.pageInfo.hasNextPage && (
          <button
            onClick={handleNextPage}
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
          >
            {t('from_page.navigation.next')}
          </button>
        )}
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common'], i18nConfig)),
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};
