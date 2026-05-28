import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

type MetricCardProps = {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
};

export function MetricCard({ title, value, description, icon: Icon }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between p-4">
        <div>
          <p className="text-xs font-medium text-stone-500">{title}</p>
          <p className="mt-2 text-2xl font-semibold text-stone-900">{value}</p>
          <p className="mt-1 text-xs text-stone-500">{description}</p>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-stone-100 text-stone-500">
          <Icon className="h-4 w-4" />
        </div>
      </CardContent>
    </Card>
  );
}
