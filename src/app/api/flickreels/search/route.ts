import { encryptedResponse, safeJson } from "@/lib/api-utils";
import { NextRequest, NextResponse } from "next/server";
import { getProxyHeaders, PROXY_CACHE_CONFIG } from "@/lib/proxy-utils";

const BASE_URL = "https://api.sansekai.my.id/api";
const API_URL = BASE_URL.endsWith("/api") ? BASE_URL : `${BASE_URL}/api`;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");

  if (!query) {
    return encryptedResponse({ status_code: 0, msg: "Query param required" }, 400);
  }

  try {
    const res = await fetch(`${API_URL}/flickreels/search?query=${encodeURIComponent(query)}`, {
      ...PROXY_CACHE_CONFIG,
      headers: getProxyHeaders("https://www.flickreels.com/"),
    });

    if (!res.ok) {
      throw new Error(`Upstream API failed with status: ${res.status}`);
    }

    const data = await safeJson(res);
    return encryptedResponse(data);
  } catch (error) {
    console.error("Error fetching FlickReels search:", error);
    return encryptedResponse(
      { status_code: 0, msg: "Internal Server Error" },
      500
    );
  }
}
