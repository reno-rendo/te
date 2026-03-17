/**
 * Utilitas untuk menghasilkan header yang meniru browser asli (Spoofing)
 * Digunakan untuk menghindari pemblokiran IP oleh upstream API.
 */
export function getProxyHeaders(referer?: string) {
  const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
  ];

  // Acak user agent untuk sedikit variasi
  const randomUA = userAgents[Math.floor(Math.random() * userAgents.length)];

  const headers: Record<string, string> = {
    "User-Agent": randomUA,
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
    "Referer": referer || "https://www.google.com/",
    "Cache-Control": "no-cache",
    "Pragma": "no-cache",
    "Sec-Ch-Ua": '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Platform": '"Windows"',
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "cross-site"
  };

  if (referer) {
    try {
      headers["Origin"] = new URL(referer).origin;
    } catch (e) {
      // Ignore invalid referer URL
    }
  }

  return headers;
}

/**
 * Konfigurasi caching default untuk fetch NEXT.js
 */
export const PROXY_CACHE_CONFIG = {
  next: { revalidate: 900 } // Cache selama 15 menit
};
