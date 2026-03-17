
import { type NextRequest } from "next/server";
import { encryptedResponse } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const baseUrl = "https://api.sansekai.my.id/api";
    const response = await fetch(`${baseUrl}/melolo/latest`);
    const data = await response.json();
    return encryptedResponse(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return encryptedResponse({ error: message }, 500);
  }
}
