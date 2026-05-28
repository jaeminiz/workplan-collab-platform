import * as React from "react";

import { cn } from "@/lib/utils/cn";

export function Input({
  className,
  type = "text",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm text-stone-950 outline-none placeholder:text-stone-400 focus:border-stone-400 focus:ring-2 focus:ring-stone-100",
        className
      )}
      {...props}
    />
  );
}
