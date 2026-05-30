import { cn } from "@/lib/utils/cn";
import type { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "primary" | "accent";
}

export function Badge({ children, className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-surface text-muted border-border",
    primary: "bg-primary/10 text-primary border-primary/30",
    accent: "bg-accent/10 text-accent border-accent/30",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
