import { safeJson, encryptedResponse } from "@/lib/api-utils";
import { NextRequest, NextResponse } from "next/server";
import { getProxyHeaders, PROXY_CACHE_CONFIG } from "@/lib/proxy-utils";

export const dynamic = 'force-dynamic';

const UPSTREAM_API = "https://api.sansekai.my.id/api/reelshort";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get("page") || "1";
    
    const response = await fetch(`${UPSTREAM_API}/foryou?page=${page}`, {
      ...PROXY_CACHE_CONFIG,
      headers: getProxyHeaders(),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch data" },
        { status: response.status }
      );
    }

    const json = await safeJson<any>(response);
    const rawList = json?.data?.lists || [];

    const mappedData = Array.isArray(rawList) 
      ? rawList.map((item: any) => ({
          bookId: item.book_id,
          bookName: item.book_title,
          coverWap: item.book_pic,
          cover: item.book_pic,
          chapterCount: item.chapter_count,
          introduction: item.special_desc,
        }))
      : [];
      
    const filteredData = mappedData.filter((item: any) => item && item.bookId);

    return encryptedResponse(filteredData);
  } catch (error) {
    console.error("ReelShort API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
