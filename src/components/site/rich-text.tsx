import { Fragment } from "react";
import { Link } from "@/i18n/navigation";

const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;

/**
 * Renders a paragraph string, converting markdown-style links like
 * `[label](/fleet)` into locale-aware Link components. Internal paths
 * (starting with "/") use next-intl Link; anything else renders as an anchor.
 */
export function RichText({ text, className }: { text: string; className?: string }) {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  LINK_RE.lastIndex = 0;
  while ((match = LINK_RE.exec(text)) !== null) {
    const [full, label, href] = match;
    if (match.index > lastIndex) {
      nodes.push(<Fragment key={key++}>{text.slice(lastIndex, match.index)}</Fragment>);
    }
    if (href.startsWith("/")) {
      nodes.push(
        <Link
          key={key++}
          href={href as "/fleet"}
          className="font-semibold text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary"
        >
          {label}
        </Link>,
      );
    } else {
      nodes.push(
        <a
          key={key++}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary"
        >
          {label}
        </a>,
      );
    }
    lastIndex = match.index + full.length;
  }
  if (lastIndex < text.length) {
    nodes.push(<Fragment key={key++}>{text.slice(lastIndex)}</Fragment>);
  }

  return <p className={className}>{nodes}</p>;
}
