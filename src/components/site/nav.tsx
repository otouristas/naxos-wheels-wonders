import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { to: "/fleet", label: "Fleet" },
  { to: "/guide", label: "Naxos Guide" },
  { to: "/about", label: "About" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="container-editorial flex h-16 items-center justify-between">
        <Link to="/" className="flex items-baseline gap-2 font-serif">
          <span className="text-2xl leading-none">Naxos</span>
          <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
            Auto Rent
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeProps={{ className: "text-foreground" }}
              inactiveProps={{ className: "text-muted-foreground hover:text-foreground" }}
              className="text-sm uppercase tracking-[0.18em] transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link
            to="/fleet"
            className="inline-flex items-center gap-2 border border-foreground px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-foreground transition-colors hover:bg-foreground hover:text-background"
          >
            Book a car
          </Link>
        </div>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
          className="md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-border/60 bg-background md:hidden">
          <div className="container-editorial flex flex-col py-4">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="py-3 text-sm uppercase tracking-[0.18em] text-foreground"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/fleet"
              onClick={() => setOpen(false)}
              className="mt-3 inline-flex items-center justify-center border border-foreground px-5 py-3 text-xs uppercase tracking-[0.2em] text-foreground"
            >
              Book a car
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}