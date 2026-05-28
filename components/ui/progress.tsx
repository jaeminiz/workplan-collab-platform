import { cn } from "@/lib/utils/cn";

export function Progress({
  value,
  className
}: {
  value: number;
  className?: string;
}) {
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-stone-100", className)}>
      <div
        className="h-full rounded-full bg-stone-800 transition-all"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}
