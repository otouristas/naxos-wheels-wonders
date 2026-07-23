import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Skip API, Next internals, and static files (robots.txt, sitemap.xml, icons, etc.)
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
}
