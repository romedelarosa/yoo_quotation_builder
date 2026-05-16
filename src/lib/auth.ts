export const SESSION_COOKIE = "yoo_session";

const encoder = new TextEncoder();
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

function getSecret(): string {
  return process.env.SESSION_SECRET || "local-yoo-quote-builder-session-secret";
}

export function getAdminPassword(): string {
  return process.env.YOO_ADMIN_PASSWORD || "yoo-demo-2026";
}

function toBase64Url(bytes: ArrayBuffer): string {
  const binary = String.fromCharCode(...new Uint8Array(bytes));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function signSessionPayload(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return toBase64Url(signature);
}

export async function createSessionToken(): Promise<string> {
  const payload = `admin.${Date.now()}`;
  const signature = await signSessionPayload(payload);
  return `${payload}.${signature}`;
}

export async function verifySessionToken(token?: string): Promise<boolean> {
  if (!token) {
    return false;
  }

  const parts = token.split(".");
  if (parts.length !== 3) {
    return false;
  }

  const payload = `${parts[0]}.${parts[1]}`;
  const createdAt = Number(parts[1]);
  if (!Number.isFinite(createdAt)) {
    return false;
  }

  const ageSeconds = (Date.now() - createdAt) / 1000;
  if (ageSeconds > SESSION_MAX_AGE_SECONDS || ageSeconds < 0) {
    return false;
  }

  const expectedSignature = await signSessionPayload(payload);
  return expectedSignature === parts[2];
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_MAX_AGE_SECONDS
};
