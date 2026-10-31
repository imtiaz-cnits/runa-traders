import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const JWT_SECRET =
  process.env.JWT_SECRET || "runa_traders_super_secret_jwt_key_2026_codenext_it";
const TOKEN_MAX_AGE_SECONDS = 24 * 60 * 60; // 24 hours

function base64UrlToUint8Array(base64Url: string): Uint8Array {
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function isValidJwtToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;

    const [headerB64, payloadB64, signatureB64] = parts;
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(JWT_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const signatureBytes = base64UrlToUint8Array(signatureB64);
    const dataBytes = encoder.encode(`${headerB64}.${payloadB64}`);

    const validSig = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes as BufferSource,
      dataBytes
    );
    if (!validSig) return false;

    const payloadJson = new TextDecoder().decode(base64UrlToUint8Array(payloadB64));
    const payload = JSON.parse(payloadJson);

    if (!payload || !payload.userId) return false;

    const nowSec = Math.floor(Date.now() / 1000);
    if (typeof payload.exp === "number" && nowSec >= payload.exp) {
      return false;
    }
    if (typeof payload.iat === "number" && nowSec - payload.iat > TOKEN_MAX_AGE_SECONDS) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;
  const isAuthenticated = await isValidJwtToken(token);

  const isLoginPage = pathname === "/login";

  // Unauthenticated users must NEVER reach dashboard or any protected route (0ms server redirect)
  if (!isAuthenticated) {
    if (!isLoginPage) {
      const loginUrl = new URL("/login", request.url);
      const res = NextResponse.redirect(loginUrl);
      if (token) {
        res.cookies.delete("token");
      }
      res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      return res;
    }

    const res = NextResponse.next();
    if (token) {
      res.cookies.delete("token");
    }
    return res;
  }

  // Authenticated users visiting "/" go directly to "/dashboard"
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Prevent browser back-button from caching protected HTML after logout/expiry
  const res = NextResponse.next();
  if (!isLoginPage) {
    res.headers.set("Cache-Control", "private, no-cache, no-store, max-age=0, must-revalidate");
  }
  return res;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2)$).*)",
  ],
};
