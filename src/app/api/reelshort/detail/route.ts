import { safeJson, encryptedResponse } from "@/lib/api-utils";
import { NextRequest, NextResponse } from "next/server";
import { getProxyHeaders, PROXY_CACHE_CONFIG } from "@/lib/proxy-utils";

const UPSTREAM_API = "https://api.sansekai.my.id/api/reelshort";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const bookId = searchParams.get("bookId");

    if (!bookId) {
      return encryptedResponse(
        { error: "bookId is required" },
        400
      );
    }

    const response = await fetch(
      `${UPSTREAM_API}/detail?bookId=${encodeURIComponent(bookId)}`,
      {
        ...PROXY_CACHE_CONFIG,
        headers: getProxyHeaders(),
      }
    );

    if (!response.ok) {
      return encryptedResponse(
        { error: "Failed to fetch detail" },
        response.status
      );
    }

    const data = await safeJson(response);
    return encryptedResponse(data);
  } catch (error) {
    console.error("ReelShort Detail Error:", error);
    return encryptedResponse(
      { error: "Internal Server Error" },
      500
    );
  }
}

