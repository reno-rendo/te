import { safeJson, encryptedResponse } from "@/lib/api-utils";
import { NextResponse } from "next/server";
import { getProxyHeaders, PROXY_CACHE_CONFIG } from "@/lib/proxy-utils";

const UPSTREAM_API = "https://api.sansekai.my.id/api/netshort";

export async function GET() {
  try {
    const response = await fetch(`${UPSTREAM_API}/theaters`, {
      ...PROXY_CACHE_CONFIG,
      headers: getProxyHeaders(),
    });

    if (!response.ok) {
      return encryptedResponse({ success: false, data: [] });
    }

    const data = await safeJson<any>(response);
    
    // Normalize the response to match our format
    // Each group has contentName (section title) and contentInfos (dramas)
    const normalizedGroups = (data || []).map((group: any) => ({
      groupId: group.groupId,
      groupName: group.contentName,
      contentRemark: group.contentRemark,
      dramas: (group.contentInfos || []).map((item: any) => ({
        shortPlayId: item.shortPlayId,
        shortPlayLibraryId: item.shortPlayLibraryId,
        title: item.shortPlayName,
        cover: item.shortPlayCover || item.groupShortPlayCover,
        labels: item.labelArray || [],
        heatScore: item.heatScoreShow || "",
        scriptName: item.scriptName,
        totalEpisodes: item.totalEpisode || 0,
      })),
    }));

    return encryptedResponse({
      success: true,
      data: normalizedGroups,
    });
  } catch (error) {
    console.error("NetShort Theaters Error:", error);
    return encryptedResponse({ success: false, data: [] });
  }
}
