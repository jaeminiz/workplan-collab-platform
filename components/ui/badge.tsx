import * as React from "react";

import { cn } from "@/lib/utils/cn";

const variants = {
  default: "border-stone-300 bg-stone-100 text-stone-800",
  secondary: "border-stone-200 bg-stone-50 text-stone-600",
  outline: "border-stone-300 bg-white text-stone-700",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  destructive: "border-red-200 bg-red-50 text-red-700"
};

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: keyof typeof variants;
};

export function Badge({
  className,
  children,
  variant = "default"
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-1.5 py-0.5 text-[11px] font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
