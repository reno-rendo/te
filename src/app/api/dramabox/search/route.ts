import { safeJson, encryptedResponse } from "@/lib/api-utils";
import { NextRequest, NextResponse } from "next/server";
import { getProxyHeaders, PROXY_CACHE_CONFIG } from "@/lib/proxy-utils";

const UPSTREAM_API = "https://api.sansekai.my.id/api/dramabox";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");

  if (!query) {
    return encryptedResponse([]);
  }

  try {
    const response = await fetch(
      `${UPSTREAM_API}/search?query=${encodeURIComponent(query)}`,
      { 
        ...PROXY_CACHE_CONFIG,
        headers: getProxyHeaders(),
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch data" },
        { status: response.status }
      );
    }

    const data = await safeJson(response);

    // Filter out non-drama results (e.g. type:"actor") that have no bookId
    const filtered = Array.isArray(data)
      ? data.filter((item: any) => item.bookId)
      : data;

    return encryptedResponse(filtered);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
