"use client";

import { Textarea } from "../ui/textarea";

export function InputResolution() {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        New Year&apos;s Resolution
      </label>
      <Textarea
        placeholder="My new year's resolution for 2025 is..."
        className="flex w-full resize-none items-center gap-x-3 rounded-lg bg-white p-3"
      />
    </div>
  );
}
