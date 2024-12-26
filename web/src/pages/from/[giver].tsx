import { api } from "~/utils/api";
import { useAccount } from "wagmi";
import dynamic from "next/dynamic";
import Pack from "~/components/My/Pack";
import { useRouter } from "next/router";

const WalletComponents = dynamic(() => import("~/components/utils/WalletComponents"), {
  ssr: false,
});

export default function From() {
  const router = useRouter();
  const { giver } = router.query as { giver: string };
  const { address } = useAccount();
  const { data: packs, refetch, isLoading } = api.pack.getPackMetadatasByCreator.useQuery({
    owner: giver ?? address ?? "",
  }, {
    enabled: !!address,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  console.log({ packs, isLoading });

  if (!isLoading && packs?.length === 0) {
    return <div className="flex flex-col items-center justify-center w-full">
      <WalletComponents />
      <div className="flex flex-col my-4 gap-4 items-center justify-center w-full min-h-96">
        <div className="text-lg font-bold">No packs found</div>
      </div>
    </div>;
  }

  if (isLoading) {
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
        {packs?.map((pack) => (
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
    </div>
  )
}
