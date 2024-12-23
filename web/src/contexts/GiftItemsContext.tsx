import { createContext, useContext, useState, type ReactNode } from "react";

export type GiftItem = {
  erc20: { token: string; amount: string }[];
  erc721: { token: string; tokenId: string }[];
  erc1155: { token: string; tokenId: string; amount: string }[];
  ethAmount: string;
};

type GiftItemsContextType = {
  selectedAssets: GiftItem;
  setSelectedAssets: (assets: GiftItem) => void;
  addERC20: (token: string, amount: string) => void;
  addERC721: (token: string, tokenId: string) => void;
  addERC1155: (token: string, tokenId: string, amount: string) => void;
  setEthAmount: (amount: string) => void;
  removeERC20: (token: string) => void;
  removeERC721: (token: string, tokenId: string) => void;
  removeERC1155: (token: string, tokenId: string) => void;
  clearAll: () => void;
};

const GiftItemsContext = createContext<GiftItemsContextType | undefined>(undefined);

const initialState: GiftItem = {
  erc20: [],
  erc721: [],
  erc1155: [],
  ethAmount: "0"
};

export function GiftItemsProvider({ children }: { children: ReactNode }) {
  const [selectedAssets, setSelectedAssets] = useState<GiftItem>(initialState);

  const addERC20 = (token: string, amount: string) => {
    setSelectedAssets(prev => ({
      ...prev,
      erc20: [...prev.erc20, { token, amount }]
    }));
  };

  const addERC721 = (token: string, tokenId: string) => {
    setSelectedAssets(prev => ({
      ...prev,
      erc721: [...prev.erc721, { token, tokenId }]
    }));
  };

  const addERC1155 = (token: string, tokenId: string, amount: string) => {
    setSelectedAssets(prev => ({
      ...prev,
      erc1155: [...prev.erc1155, { token, tokenId, amount }]
    }));
  };

  const setEthAmount = (amount: string) => {
    setSelectedAssets(prev => ({
      ...prev,
      ethAmount: amount
    }));
  };

  const removeERC20 = (token: string) => {
    setSelectedAssets(prev => ({
      ...prev,
      erc20: prev.erc20.filter((erc20) => erc20.token !== token)
    }));
  };

  const removeERC721 = (token: string, tokenId: string) => {
    setSelectedAssets(prev => ({
      ...prev,
      erc721: prev.erc721.filter((erc721) => erc721.token !== token && erc721.tokenId !== tokenId)
    }));
  };

  const removeERC1155 = (token: string, tokenId: string) => {
    setSelectedAssets(prev => ({
      ...prev,
      erc1155: prev.erc1155.filter((erc1155) => erc1155.token !== token && erc1155.tokenId !== tokenId)
    }));
  };

  const clearAll = () => {
    setSelectedAssets(initialState);
  };

  return (
    <GiftItemsContext.Provider
      value={{
        selectedAssets,
        setSelectedAssets,
        addERC20,
        addERC721,
        addERC1155,
        setEthAmount,
        removeERC20,
        removeERC721,
        removeERC1155,
        clearAll
      }}
    >
      {children}
    </GiftItemsContext.Provider>
  );
}

export function useGiftItems() {
  const context = useContext(GiftItemsContext);
  if (context === undefined) {
    throw new Error("useGiftItems must be used within a GiftItemsProvider");
  }
  return context;
} 