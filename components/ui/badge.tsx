import * as React from "react";

import { cn } from "@/lib/utils/cn";

const variants = {
  default: "border-blue-200 bg-blue-50 text-blue-700",
  secondary: "border-slate-200 bg-slate-100 text-slate-700",
  outline: "border-slate-300 bg-white text-slate-700",
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
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
