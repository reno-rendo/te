import { NextResponse } from "next/server";

export async function GET() {
  const targets = [
    "https://api.sansekai.my.id/api/dramabox/foryou",
    "https://api.sansekai.my.id/api/reelshort/foryou",
  ];

  const results = await Promise.all(
    targets.map(async (url) => {
      try {
        const start = Date.now();
        const res = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(5000) });
        const duration = Date.now() - start;
        const contentType = res.headers.get("content-type");
        const bodyPreview = await res.text().then(t => t.substring(0, 100));
        
        return {
          url,
          status: res.status,
          statusText: res.statusText,
          duration: `${duration}ms`,
          contentType,
          bodyPreview,
          ok: res.ok,
        };
      } catch (err: any) {
        return {
          url,
          error: err.message || "Unknown error",
          type: err.name,
        };
      }
    })
  );

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    results,
    env: {
       hasSecret: !!process.env.NEXT_PUBLIC_CRYPTO_SECRET,
       hasApiBase: !!process.env.NEXT_PUBLIC_API_BASE_URL,
    }
  });
}
