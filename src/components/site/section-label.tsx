export function SectionLabel({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 text-xs uppercase tracking-[0.28em] text-muted-foreground">
      <span className="text-accent">{index}</span>
      <span className="h-px flex-1 bg-border md:flex-none md:w-16" />
      <span>{children}</span>
    </div>
  );
}