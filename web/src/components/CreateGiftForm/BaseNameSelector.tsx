"use client";

import { ChevronsUpDown } from "lucide-react";
import { type UseFormReturn } from "react-hook-form";
import { type z } from "zod";

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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";
import { type CreateGiftFormSchema } from ".";
import { BaseNameOption } from "./BaseNameOption";
import { type ZapperNFT } from "~/types/zapper";
import Link from "next/link";

const mockNames = [
  {
    value: "ayvee.base.eth",
    img: "https://raw.seadn.io/files/b79f096162e1f7d0750cb0f491c8689d.svg",
  },
] as const;

export function BaseNameSelector({
  form,
  baseNameNfts,
}: {
  form: UseFormReturn<z.infer<typeof CreateGiftFormSchema>>;

  baseNameNfts: ZapperNFT[];
}) {
  return (
    <FormField
      control={form.control}
      name="baseName"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Basename</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "h-[60px] w-[512px] justify-between",
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    !field.value && "text-muted-foreground",
                  )}
                >
                  {field.value ? (
                    <div className="flex items-center gap-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          // mockNames.find((name) => name.value === field.value)
                          //   ?.img
                          baseNameNfts.find(
                            (nft) => nft.tokenId === field.value,
                          )?.mediasV2[0]?.url ?? ""
                        }
                        alt={field.value}
                        className="h-11 w-11 rounded-sm"
                      />
                      <span className="text-[16px]">{field.value}</span>
                    </div>
                  ) : (
                    "Select basename"
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[512px] p-0">
              <Command>
                <CommandInput
                  placeholder="Search basename..."
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty className="py-2 text-sm">
                    <div className="flex flex-col items-start justify-center h-auto gap-y-1 px-4">
                      <p className="text-sm">Basename</p>
                      <div className="flex items-center w-full justify-start p-3 h-full border border-text-muted-foreground rounded-md">
                        <p className="text-muted-foreground">You don&apos;t have a basename. <span className="text-blue-600 underline"><Link target="_blank" href="https://www.base.org/names">Buy now</Link></span></p>
                      </div>
                    </div>
                  </CommandEmpty>
                  <CommandGroup>
                    {baseNameNfts.map((nft) => {
                      const imageUrl = nft.mediasV2[0]?.url;
                      return (
                        <CommandItem
                          value={nft.name}
                          key={nft.tokenId}
                          onSelect={() => {
                            form.setValue("baseName", nft.tokenId);
                          }}
                          className="flex items-center justify-between hover:bg-red-500"
                        >
                          <BaseNameOption
                            value={nft.name}
                            img={imageUrl ?? ""}
                            isSelected={nft.name === field.value}
                          />
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </FormItem>
      )}
    />
  );
}
