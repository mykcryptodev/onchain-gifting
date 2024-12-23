import { createContext, useContext, useState, type ReactNode } from "react";
import { ZERO_ADDRESS } from "thirdweb";
import { isAddressEqual, type Hex, encodeAbiParameters, keccak256 as viemKeccak256 } from "viem";

export type GiftItem = {
  erc20: { 
    token: string; 
    decimals: number;
    amount: string; 
    valueUsd?: number;
    symbol: string;
    name: string;
    imageUrl: string;
  }[];
  erc721: { token: string; tokenId: string; valueUsd?: number }[];
  erc1155: { token: string; tokenId: string; amount: string; valueUsd?: number }[];
  ethAmount: string;
  ethValueUsd?: number;
  password: string;
  hash: Hex | undefined;
};

type GiftItemsContextType = {
  selectedAssets: GiftItem;
  setSelectedAssets: (assets: GiftItem) => void;
  addERC20: (token: string, amount: string, valueUsd?: number, symbol?: string, name?: string, imageUrl?: string, decimals?: number) => void;
  addERC721: (token: string, tokenId: string, valueUsd?: number) => void;
  addERC1155: (token: string, tokenId: string, amount: string, valueUsd?: number) => void;
  setEthAmount: (amount: string, valueUsd?: number) => void;
  removeERC20: (token: string) => void;
  removeERC721: (token: string, tokenId: string) => void;
  removeERC1155: (token: string, tokenId: string) => void;
  clearAll: () => void;
  getTotalValueUsd: () => number;
  updatePassword: (password: string) => void;
  hash: Hex | undefined;
  password: string;
};

const GiftItemsContext = createContext<GiftItemsContextType | undefined>(undefined);

const initialState: GiftItem = {
  erc20: [],
  erc721: [],
  erc1155: [],
  ethAmount: "0",
  ethValueUsd: 0,
  password: "",
  hash: undefined
};

export function GiftItemsProvider({ children }: { children: ReactNode }) {
  const [selectedAssets, setSelectedAssets] = useState<GiftItem>(initialState);
  const [password, setPassword] = useState<string>("");
  const [hash, setHash] = useState<Hex | undefined>(undefined);
  console.log({ hash });

  const addERC20 = (
    token: string, 
    amount: string, 
    valueUsd?: number, 
    symbol?: string, 
    name?: string, 
    imageUrl?: string,
    decimals?: number
  ) => {
    setSelectedAssets(prev => ({
      ...prev,
      erc20: [...prev.erc20, { 
        token, 
        amount, 
        valueUsd,
        symbol: symbol ?? "",
        name: name ?? "",
        imageUrl: imageUrl ?? "",
        decimals: decimals ?? 18,
      }]
    }));
  };

  const addERC721 = (token: string, tokenId: string, valueUsd?: number) => {
    setSelectedAssets(prev => ({
      ...prev,
      erc721: [...prev.erc721, { token, tokenId, valueUsd }]
    }));
  };

  const addERC1155 = (token: string, tokenId: string, amount: string, valueUsd?: number) => {
    setSelectedAssets(prev => ({
      ...prev,
      erc1155: [...prev.erc1155, { token, tokenId, amount, valueUsd }]
    }));
  };

  const setEthAmount = (amount: string, valueUsd?: number) => {
    setSelectedAssets(prev => ({
      ...prev,
      ethAmount: amount,
      ethValueUsd: valueUsd
    }));
  };

  const removeERC20 = (token: string) => {
    setSelectedAssets(prev => ({
      ...prev,
      erc20: prev.erc20.filter((erc20) => erc20.token !== token)
    }));
    // if this is the zero address, remove the ethAmount
    if (isAddressEqual(token, ZERO_ADDRESS)) {
      setSelectedAssets(prev => ({
        ...prev,
        ethAmount: "0",
        ethValueUsd: 0
      }));
    }
  };

  const removeERC721 = (token: string, tokenId: string) => {
    setSelectedAssets(prev => ({
      ...prev,
      erc721: prev.erc721.filter((erc721) => 
        !(erc721.token === token && erc721.tokenId === tokenId)
      )
    }));
  };

  const removeERC1155 = (token: string, tokenId: string) => {
    setSelectedAssets(prev => ({
      ...prev,
      erc1155: prev.erc1155.filter((erc1155) => 
        !(erc1155.token === token && erc1155.tokenId === tokenId)
      )
    }));
  };

  const updatePassword = (password: string) => {
    setPassword(password);
    const encodedPassword = encodeAbiParameters(
      [{ type: 'string' }],
      [password]
    );
    setHash(viemKeccak256(encodedPassword));
  };

  const getTotalValueUsd = () => {
    const erc20Value = selectedAssets.erc20
      .filter(token => !isAddressEqual(token.token, ZERO_ADDRESS))
      .reduce((sum, token) => sum + (token.valueUsd ?? 0), 0);
    const erc721Value = selectedAssets.erc721.reduce((sum, token) => sum + (token.valueUsd ?? 0), 0);
    const erc1155Value = selectedAssets.erc1155.reduce((sum, token) => sum + (token.valueUsd ?? 0), 0);
    const ethValue = selectedAssets.ethValueUsd ?? 0;

    return erc20Value + erc721Value + erc1155Value + ethValue;
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
        clearAll,
        getTotalValueUsd,
        updatePassword,
        hash,
        password,
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