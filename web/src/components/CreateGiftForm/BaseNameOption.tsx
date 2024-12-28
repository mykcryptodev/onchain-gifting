import { Check } from "lucide-react";
import { type FC } from "react";
import { cn } from "~/lib/utils";

interface BaseNameOptionProps {
  value: string;
  img: string;
  isSelected: boolean;
}

export const BaseNameOption: FC<BaseNameOptionProps> = ({
  value,
  img,
  isSelected,
}) => {
  return (
    <>
      <div className="flex items-center gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} alt={value} className="h-11 w-11" />
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
