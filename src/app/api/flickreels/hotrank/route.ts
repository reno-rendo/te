import { encryptedResponse, safeJson } from "@/lib/api-utils";
import { NextResponse } from "next/server";
import { getProxyHeaders, PROXY_CACHE_CONFIG } from "@/lib/proxy-utils";

export async function GET() {
  try {
    const res = await fetch(`https://api.sansekai.my.id/api/flickreels/hotrank`, {
      method: "GET",
      ...PROXY_CACHE_CONFIG,
      headers: {
        ...getProxyHeaders("https://www.flickreels.com/"),
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }

    const data = await safeJson(res);
    return encryptedResponse(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
