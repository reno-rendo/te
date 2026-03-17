import { safeJson, encryptedResponse } from "@/lib/api-utils";
import { optimizeCover } from "@/lib/image-utils";
import { NextRequest } from "next/server";
import { getProxyHeaders, PROXY_CACHE_CONFIG } from "@/lib/proxy-utils";

const UPSTREAM_API = "https://api.sansekai.my.id/api/shortmax";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query");

    if (!query) {
      return encryptedResponse({ success: true, data: [] });
    }

    const response = await fetch(
      `${UPSTREAM_API}/search?query=${encodeURIComponent(query)}`,
      {
        ...PROXY_CACHE_CONFIG,
        headers: getProxyHeaders(),
      }
    );

    if (!response.ok) {
      return encryptedResponse({ success: true, data: [] });
    }

    const data = await safeJson<any>(response);

    const results = (data.results || []).map((item: any) => ({
      shortPlayId: item.shortPlayId,
      shortPlayCode: item.shortPlayCode,
      title: (item.name || "").replace(/<\/?em>/g, ""),
      cover: optimizeCover(item.cover),
      genre: (item.genre || []).map((g: string) => g.replace(/<\/?em>/g, "")),
    }));

    return encryptedResponse({
      success: true,
      data: results,
      total: data.total || results.length,
    });
  } catch (error) {
    console.error("ShortMax Search Error:", error);
    return encryptedResponse({ success: true, data: [] });
  }
}
