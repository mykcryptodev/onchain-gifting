import { useGiftItems } from "~/contexts/GiftItemsContext";
import { Nft } from "./Selected/Nft";
import { SelectedToken } from "./Selected/Token";
import { ZERO_ADDRESS } from "thirdweb";

export const PackContents = () => {
  const { selectedAssets } = useGiftItems();
  console.log({selectedAssets});
  return (
    <div className="flex flex-wrap justify-center items-center gap-2 max-w-xs">
      {selectedAssets.erc20.map((erc20) => (
        <SelectedToken 
          key={erc20.token}
          token={erc20.token}
        />
      ))}
      {selectedAssets.erc721.map((erc721) => (
        <Nft 
          key={`${erc721.token}-${erc721.tokenId}`}
          token={erc721.token} 
          tokenId={erc721.tokenId} 
        />
      ))}
      {selectedAssets.erc1155.map((erc1155) => (
        <div key={erc1155.token}>
          <span>{erc1155.token}</span>
          <span>{erc1155.tokenId}</span>
          <span>{erc1155.amount}</span>
        </div>
      ))}
    </div>
  );
};