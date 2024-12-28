"use client";

import { type UseFormReturn } from "react-hook-form";
import { type z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { type CreateGiftFormSchema } from ".";
import Image from "next/image";

export function InputUSDC({
  form,
}: {
  form: UseFormReturn<z.infer<typeof CreateGiftFormSchema>>;
}) {
  return (
    <FormField
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      control={form.control}
      name="usdcAmount"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Send gift to a friend</FormLabel>
          <FormControl>
            <Input
              startDecorators={
                <Image
                  src="/images/usdc-logo.png"
                  alt="usdc"
                  width={18}
                  height={18}
                />
              }
              endDecorators={<p className="text-[14px] font-medium">USDC</p>}
              type="number"
              className="flex w-full bg-white items-center gap-x-3 rounded-lg p-3"
              placeholder="$0.00"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
