import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-sm px-1.5 py-0.5 text-xs font-medium leading-none tabular-nums",
  {
    variants: {
      tone: {
        pyro: "bg-pyro/15 text-pyro",
        resto: "bg-resto/15 text-resto",
        necro: "bg-necro/20 text-necro",
        cryo: "bg-cryo/15 text-cryo",
        vigil: "bg-resto/15 text-resto",
        warn: "bg-warn/15 text-warn",
        grant: "bg-accent/12 text-accent",
        overdue: "bg-pyro/15 text-pyro",
        limit: "bg-cryo/15 text-cryo",
        perk: "bg-resto/15 text-resto",
        antagonist: "bg-necro/20 text-necro",
        neutral: "bg-elevated text-muted-foreground",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export function Badge({
  className,
  tone,
  ...props
}: HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
