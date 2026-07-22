import { cn } from "@/lib/utils";

export function SectionLabel({
  children,
  className,
  tone = "yellow",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "yellow" | "blue" | "sea";
}) {
  const tones = {
    yellow: "bg-accent text-accent-foreground",
    blue: "bg-primary/10 text-primary",
    sea: "bg-sea/15 text-primary",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
