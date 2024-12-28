"use client";

import { type UseFormReturn } from "react-hook-form";
import { type z } from "zod";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { type CreateGiftFormSchema } from ".";
import Image from "next/image";
import { Textarea } from "../ui/textarea";

export function InputResolution({
  form,
}: {
  form: UseFormReturn<z.infer<typeof CreateGiftFormSchema>>;
}) {
  return (
    <FormField
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      control={form.control}
      name="resolution"
      render={({ field }) => (
        <FormItem>
          <FormLabel>New Year&apos;s Resolution</FormLabel>
          <FormControl>
            <Textarea
              placeholder="My new year's resolution for 2025 is..."
              className="flex w-full resize-none items-center gap-x-3 rounded-lg bg-white p-3"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
