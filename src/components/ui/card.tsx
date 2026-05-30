import { cn } from "@/lib/utils/cn";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = true }: CardProps) {
  return (
    <div
      className={cn(
        "bg-surface border border-border rounded-lg overflow-hidden",
        hover && "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("p-4 sm:p-6", className)}>{children}</div>;
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("p-4 sm:p-6 pt-0", className)}>{children}</div>;
}
