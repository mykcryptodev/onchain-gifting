"use client";

import { Check, ChevronsUpDown } from "lucide-react";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";
import { type CreateGiftFormSchema } from ".";

const languages = [
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Spanish", value: "es" },
  { label: "Portuguese", value: "pt" },
  { label: "Russian", value: "ru" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
  { label: "Chinese", value: "zh" },
] as const;

export function BGBGiftSelector({
  form,
}: {
  form: UseFormReturn<z.infer<typeof CreateGiftFormSchema>>;
}) {
  return (
    <FormField
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      control={form.control}
      name="giftCard"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Names</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-[200px] justify-between",
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    !field.value && "text-muted-foreground",
                  )}
                >
                  {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
                  {field.value
                    ? languages.find(
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                        (language) => language.value === field.value,
                      )?.label
                    : "Select language"}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput
                  placeholder="Search framework..."
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>No framework found.</CommandEmpty>
                  <CommandGroup>
                    {languages.map((language) => (
                      <CommandItem
                        value={language.label}
                        key={language.value}
                        onSelect={() => {
                          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
                          form.setValue("giftCard", language.value);
                        }}
                      >
                        {language.label}
                        <Check
                          className={cn(
                            "ml-auto",
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                            language.value === field.value
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormDescription>
            This is the language that will be used in the dashboard.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
