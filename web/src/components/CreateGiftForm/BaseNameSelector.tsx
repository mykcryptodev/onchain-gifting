"use client";

import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";
import { BaseNameOption } from "./BaseNameOption";
import { type ZapperNFT } from "~/types/zapper";
import Link from "next/link";

const mockNames = [
  {
    value: "ayvee.base.eth",
    img: "https://raw.seadn.io/files/b79f096162e1f7d0750cb0f491c8689d.svg",
  },
] as const;
import { useGiftItems } from "~/contexts/GiftItemsContext";

export function BaseNameSelector({
  baseNameNfts,
}: {
  baseNameNfts: ZapperNFT[];
}) {
  const { addERC721, selectedAssets, removeERC721 } = useGiftItems();
  const [selectedBaseName, setSelectedBaseName] = useState<ZapperNFT | null>(
    null,
  );

  const handleAddBaseName = (nft: ZapperNFT) => {
    if (!nft) return;

    // Remove any existing basename token
    selectedAssets.erc721.forEach((asset) => {
      if (
        asset.token.toLowerCase() ===
        "0x03c4738ee98ae44591e1a4a4f3cab6641d95dd9a".toLowerCase()
      ) {
        removeERC721(asset.token, asset.tokenId);
      }
    });

    // Add the new basename token
    addERC721(
      "0x03c4738ee98ae44591e1a4a4f3cab6641d95dd9a",
      nft.tokenId,
      nft.estimatedValue?.valueUsd ?? 0,
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">Basename</label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "h-[60px] md:w-[512px] justify-between",
              !selectedBaseName && "text-muted-foreground",
            )}
          >
            {selectedBaseName ? (
              <div className="flex items-center gap-2">
                <Image
                  src="/images/basenames-logo.png"
                  alt="basenames-logo"
                  width={24}
                  height={24}
                />
                <span className="text-[16px]">{selectedBaseName.name}</span>
              </div>
            ) : (
              "Select basename"
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] sm:w-full md:w-[512px] p-0">
          <Command>
            <CommandInput placeholder="Search basename..." className="h-9" />
            <CommandList>
              <CommandEmpty className="py-2 text-sm">
                <div className="flex h-auto flex-col items-start justify-center gap-y-1 px-4">
                  <p className="text-sm">Basename</p>
                  <div className="border-text-muted-foreground flex h-full w-full items-center justify-start rounded-md border p-3">
                    <p className="text-muted-foreground">
                      You don&apos;t have a basename.{" "}
                      <span className="text-blue-600 underline">
                        <Link target="_blank" href="https://www.base.org/names">
                          Buy now
                        </Link>
                      </span>
                    </p>
                  </div>
                </div>
              </CommandEmpty>
              <CommandGroup>
                {baseNameNfts.map((nft) => (
                  <CommandItem
                    value={nft.name}
                    key={nft.tokenId}
                    onSelect={() => {
                      setSelectedBaseName(nft);
                      handleAddBaseName(nft);
                    }}
                    className="flex items-center justify-between"
                  >
                    <BaseNameOption
                      value={nft.name}
                      isSelected={nft.tokenId === selectedBaseName?.tokenId}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
