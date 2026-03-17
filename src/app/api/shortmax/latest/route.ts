import { safeJson, encryptedResponse } from "@/lib/api-utils";
import { optimizeCover } from "@/lib/image-utils";
import { getProxyHeaders, PROXY_CACHE_CONFIG } from "@/lib/proxy-utils";

const UPSTREAM_API = "https://api.sansekai.my.id/api/shortmax";

export async function GET() {
  try {
    const response = await fetch(`${UPSTREAM_API}/latest`, {
      ...PROXY_CACHE_CONFIG,
      headers: getProxyHeaders(),
    });

    if (!response.ok) {
      return encryptedResponse({ success: false, data: [] });
    }

    const data = await safeJson<any>(response);

    const dramas = (data.results || []).map((item: any) => ({
      shortPlayId: item.shortPlayId,
      title: item.name,
      cover: optimizeCover(item.cover),
      totalEpisodes: item.totalEpisodes || 0,
      label: item.label || "",
      collectNum: item.collectNum || 0,
    }));

    return encryptedResponse({
      success: true,
      data: dramas,
      total: data.total || dramas.length,
    });
  } catch (error) {
    console.error("ShortMax Latest Error:", error);
    return encryptedResponse({ success: false, data: [] });
  }
}
