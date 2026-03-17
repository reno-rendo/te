import { type NextRequest } from "next/server";
import { encryptedResponse } from "@/lib/api-utils";
import { getProxyHeaders, PROXY_CACHE_CONFIG } from "@/lib/proxy-utils";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");

  if (!query) {
    return encryptedResponse({ error: "Query parameter is required" }, 400);
  }

  try {
    const baseUrl = "https://api.sansekai.my.id/api";
    const response = await fetch(`${baseUrl}/melolo/search?query=${encodeURIComponent(query)}`, {
      ...PROXY_CACHE_CONFIG,
      headers: getProxyHeaders(),
    });
    const data = await response.json();
    return encryptedResponse(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return encryptedResponse({ error: message }, 500);
  }
}
