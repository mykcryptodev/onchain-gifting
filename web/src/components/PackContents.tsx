import { useGiftItems } from "~/contexts/GiftItemsContext";
import { Nft } from "./Selected/Nft";

export const PackContents = () => {
  const { selectedAssets } = useGiftItems();
  return (
    <div className="flex gap-2">
      {selectedAssets.erc20.map((erc20) => (
        <div key={erc20.token}>
          <span>{erc20.token}</span>
          <span>{erc20.amount}</span>
        </div>
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