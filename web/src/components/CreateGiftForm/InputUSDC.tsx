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

export function InputUSDC({
  form,
}: {
  form: UseFormReturn<z.infer<typeof CreateGiftFormSchema>>;
}) {
  return (
    <FormField
      control={form.control}
      name="usdcAmount"
      render={({ field }) => (
        <FormItem>
          <FormLabel>USDC Amount</FormLabel>
          <FormControl>
            <Input placeholder="$0" {...field} />
          </FormControl>
          <FormDescription>This is your public display name.</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
