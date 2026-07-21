import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-border/60 bg-secondary/40">
      <div className="container-editorial grid gap-12 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-serif text-3xl">Naxos Auto Rent</div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            A family-run rental fleet on Naxos. Personal delivery to the port,
            airport, or your villa. No hidden fees. Real island advice.
          </p>
          <p className="mt-6 text-xs uppercase tracking-[0.22em] text-muted-foreground">
            Chora Naxos · Cyclades · Greece
          </p>
        </div>

        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Explore
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/fleet" className="hover:text-accent">Fleet</Link></li>
            <li><Link to="/guide" className="hover:text-accent">Naxos Guide</Link></li>
            <li><Link to="/about" className="hover:text-accent">About</Link></li>
            <li><Link to="/faq" className="hover:text-accent">FAQ</Link></li>
            <li><Link to="/contact" className="hover:text-accent">Contact</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Contact
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            <li>+30 22850 00000</li>
            <li>hello@naxosautorent.com</li>
            <li>Open 08:00 — 22:00</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="container-editorial flex flex-col justify-between gap-2 py-6 text-xs uppercase tracking-[0.18em] text-muted-foreground md:flex-row">
          <div>© {new Date().getFullYear()} Naxos Auto Rent</div>
          <div>Terms · Privacy</div>
        </div>
      </div>
    </footer>
  );
}