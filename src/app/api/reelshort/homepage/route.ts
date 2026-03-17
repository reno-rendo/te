import { safeJson, encryptedResponse } from "@/lib/api-utils";
import { NextResponse } from "next/server";
import { getProxyHeaders, PROXY_CACHE_CONFIG } from "@/lib/proxy-utils";

const UPSTREAM_API = "https://api.sansekai.my.id/api/reelshort";

export async function GET() {
  try {
    const response = await fetch(`${UPSTREAM_API}/homepage`, {
      ...PROXY_CACHE_CONFIG,
      headers: getProxyHeaders(),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch data" },
        { status: response.status }
      );
    }

    const data = await safeJson(response);
    return encryptedResponse(data);
  } catch (error) {
    console.error("ReelShort API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
