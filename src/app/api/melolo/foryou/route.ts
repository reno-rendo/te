import { safeJson, encryptedResponse } from "@/lib/api-utils";
import { NextRequest, NextResponse } from "next/server";
import { getProxyHeaders, PROXY_CACHE_CONFIG } from "@/lib/proxy-utils";

export const dynamic = 'force-dynamic';

const UPSTREAM_API = "https://api.sansekai.my.id/api/melolo";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const offset = searchParams.get("offset") || "0";
    
    const response = await fetch(`${UPSTREAM_API}/foryou?offset=${offset}`, {
      ...PROXY_CACHE_CONFIG,
      headers: getProxyHeaders(),
    });

    if (!response.ok) {
        return encryptedResponse({ 
            books: [], 
            has_more: false, 
            next_offset: 0 
        });
    }

    const json = await safeJson<any>(response);
    const data = json.data;

    let books: any[] = [];
    
    if (data?.cell?.cell_data && Array.isArray(data.cell.cell_data)) {
        data.cell.cell_data.forEach((section: any) => {
            if (section.books && Array.isArray(section.books)) {
                books = [...books, ...section.books];
            }
        });
    }

    if (data?.books && Array.isArray(data.books)) {
        books = [...books, ...data.books];
    }
    
    const hasMore = data?.has_more ?? data?.cell?.has_more ?? false;
    const nextOffset = data?.next_offset ?? data?.cell?.next_offset ?? 0;

    return encryptedResponse({
      books: books,
      has_more: hasMore,
      next_offset: nextOffset,
    });
  } catch (error) {
    console.error("Melolo ForYou Error:", error);
    return encryptedResponse({ 
        books: [], 
        has_more: false, 
        next_offset: 0 
    });
  }
}
