"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "~/components/ui/button";

import { Form } from "~/components/ui/form";

import { BaseNameSelector } from "./BaseNameSelector";
import { BGBGiftSelector } from "./BGBGiftSelector";
import { InputUSDC } from "./InputUSDC";

export const CreateGiftFormSchema = z.object({
  usdcAmount: z.string({
    required_error: "Please enter an amount.",
  }),
  baseName: z.string({
    required_error: "Please select a base name.",
  }),
  giftCard: z.string({
    required_error: "Please select a gift card.",
  }),
});

export function CreateGiftForm() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const form = useForm<z.infer<typeof CreateGiftFormSchema>>({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    resolver: zodResolver(CreateGiftFormSchema),
  });

  function onSubmit(data: z.infer<typeof CreateGiftFormSchema>) {
    console.log(data);
  }

  return (
    <Form {...form}>
      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <InputUSDC form={form} />
        <BaseNameSelector form={form} />
        <BGBGiftSelector form={form} />
        <Button type="submit">Send GIft</Button>
      </form>
    </Form>
  );
}
