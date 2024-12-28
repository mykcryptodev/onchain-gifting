"use client";

import { Input } from "~/components/ui/input";
import Image from "next/image";
import { Label } from "../ui/label";

export function InputUSDC() {
  return (
    <div className="flex flex-col gap-4">
      <Label className="text-xl font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Send new year&apos;s resolution gift to a friend
      </Label>
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
        className="flex w-full items-center gap-x-3 rounded-lg bg-white p-3"
        value="5.00"
        readOnly
      />
    </div>
  );
}
