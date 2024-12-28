import { Check } from "lucide-react";
import Image from "next/image";
import { type FC } from "react";
import { cn } from "~/lib/utils";

interface BaseNameOptionProps {
  value: string;
  isSelected: boolean;
}

export const BaseNameOption: FC<BaseNameOptionProps> = ({
  value,
  isSelected,
}) => {
  return (
    <>
      <div className="flex items-center gap-2">
        <Image
          src="/images/basenames-logo.png"
          alt="basenames-logo"
          width={24}
          height={24}
        />
        <span>{value}</span>
      </div>
      <Check
        className={cn(
          "ml-auto h-4 w-4",
          isSelected ? "opacity-100" : "opacity-0",
        )}
      />
    </>
  );
};
