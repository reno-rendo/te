import { safeJson, encryptedResponse } from "@/lib/api-utils";
import { NextRequest, NextResponse } from "next/server";
import { getProxyHeaders, PROXY_CACHE_CONFIG } from "@/lib/proxy-utils";

const UPSTREAM_API = "https://api.sansekai.my.id/api/netshort";

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
    
    // Search results are in searchCodeSearchResult array
    const results = data.searchCodeSearchResult || [];
    
    const normalizedResults = results.map((item: any) => ({
      shortPlayId: item.shortPlayId,
      shortPlayLibraryId: item.shortPlayLibraryId,
      // Remove <em> tags from title
      title: (item.shortPlayName || "").replace(/<\/?em>/g, ""),
      cover: item.shortPlayCover,
      labels: item.labelNameList || [],
      heatScore: item.formatHeatScore || "",
      description: item.shotIntroduce,
    }));

    return encryptedResponse({
      success: true,
      data: normalizedResults,
    });
  } catch (error) {
    console.error("NetShort Search Error:", error);
    return encryptedResponse({ success: true, data: [] });
  }
}

