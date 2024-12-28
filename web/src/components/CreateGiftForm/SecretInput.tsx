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

export function InputSecret({
  form,
}: {
  form: UseFormReturn<z.infer<typeof CreateGiftFormSchema>>;
}) {
  return (
    <FormField
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      control={form.control}
      name="secret"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Secret Words</FormLabel>
          <FormControl>
            <Input
              type="text"
              className="flex w-full items-center gap-x-3 rounded-lg bg-white p-3"
              placeholder="The secret word use to claim this gift"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
