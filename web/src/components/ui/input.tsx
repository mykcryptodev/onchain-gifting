import * as React from "react";

import { cn } from "~/lib/utils";

// Extend the props type to include 'icon'
type InputProps = React.ComponentProps<"input"> & {
  icon?: React.ElementType;
  startDecorators?: React.ReactNode;
  endDecorators?: React.ReactNode;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, icon: Icon, startDecorators, endDecorators, ...props },
    ref,
  ) => {
    return (
      <div
        className={cn(
          "relative flex items-center rounded-md border border-input p-2",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className,
        )}
      >
        {startDecorators}
        <input
          type={type}
          className={cn(
            "flex max-h-10 w-full bg-background text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          )}
          ref={ref}
          {...props}
        />
        {endDecorators}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
