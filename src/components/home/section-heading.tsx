interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

export function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <div className="text-center mb-12">
      <h2 className="text-2xl sm:text-3xl font-bold mb-3 tracking-tight">
        {title}
      </h2>
      {subtitle && <p className="text-muted">{subtitle}</p>}
      <div className="mt-4 mx-auto w-12 h-0.5 bg-foreground/20 rounded-full" />
    </div>
  );
}
