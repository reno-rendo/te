import { type NextRequest } from "next/server";
import { encryptedResponse } from "@/lib/api-utils";
import { getProxyHeaders, PROXY_CACHE_CONFIG } from "@/lib/proxy-utils";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const videoId = searchParams.get("videoId");

  if (!videoId) {
    return Response.json({ error: "Missing videoId" }, { status: 400 });
  }

  try {
    const baseUrl = "https://api.sansekai.my.id/api";
    const response = await fetch(`${baseUrl}/melolo/stream?videoId=${videoId}`, {
      ...PROXY_CACHE_CONFIG,
      headers: getProxyHeaders(),
    });
    const data = await response.json();
    return encryptedResponse(data);
  } catch (error) {
    console.error("Error fetching Melolo stream:", error);
    return Response.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
