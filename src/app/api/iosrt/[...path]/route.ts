import { NextRequest, NextResponse } from "next/server";

const IOSRT_ORIGIN =
  "https://naxosautorent.com/wp-content/plugins/iosrt-api-client/client";

export const dynamic = "force-dynamic";

async function proxy(req: NextRequest, path: string[]) {
  const targetPath = path.join("/");
  const url = new URL(`${IOSRT_ORIGIN}/${targetPath}`);
  req.nextUrl.searchParams.forEach((v, k) => url.searchParams.set(k, v));

  const headers = new Headers();
  const contentType = req.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  headers.set("accept", req.headers.get("accept") || "*/*");
  headers.set("referer", "https://naxosautorent.com/book/");
  headers.set("user-agent", req.headers.get("user-agent") || "NaxosAutoRent/1.0");

  const init: RequestInit = {
    method: req.method,
    headers,
    cache: "no-store",
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = await req.arrayBuffer();
  }

  const upstream = await fetch(url, init);
  const body = await upstream.arrayBuffer();

  const out = new Headers();
  const upstreamType = upstream.headers.get("content-type");
  if (upstreamType) out.set("content-type", upstreamType);
  out.set("cache-control", "no-store");

  let payload: ArrayBuffer | string = body;

  // Keep booking completion on this site when the engine returns a success URL.
  if (upstreamType?.includes("json") || upstreamType?.includes("text/plain")) {
    try {
      const text = new TextDecoder().decode(body);
      const rewritten = text
        .replaceAll("https:\\/\\/naxosautorent.com\\/book", "\\/book")
        .replaceAll("https://naxosautorent.com/book", "/book");
      payload = rewritten;
      if (!upstreamType.includes("json")) out.set("content-type", "text/plain; charset=utf-8");
    } catch {
      // keep binary body
    }
  }

  return new NextResponse(payload, { status: upstream.status, headers: out });
}

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  const { path } = await ctx.params;
  return proxy(req, path);
}

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  const { path } = await ctx.params;
  return proxy(req, path);
}
