import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const cookieName = "azrak_admin_session";
const sessionDurationSeconds = 60 * 60 * 8;

function sessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is not configured.");
  }

  return secret;
}

function signature(expiresAt: string) {
  return createHmac("sha256", sessionSecret()).update(expiresAt).digest("base64url");
}

function isMatchingSignature(expected: string, received: string) {
  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(received);

  return (
    expectedBuffer.length === receivedBuffer.length &&
    timingSafeEqual(expectedBuffer, receivedBuffer)
  );
}

export function isValidAdminPassword(password: string) {
  const configuredPassword = process.env.ADMIN_PASSWORD;

  if (!configuredPassword) {
    throw new Error("ADMIN_PASSWORD is not configured.");
  }

  const configuredBuffer = Buffer.from(configuredPassword);
  const passwordBuffer = Buffer.from(password);

  return (
    configuredBuffer.length === passwordBuffer.length &&
    timingSafeEqual(configuredBuffer, passwordBuffer)
  );
}

export async function createAdminSession() {
  const expiresAt = Math.floor(Date.now() / 1000 + sessionDurationSeconds).toString();
  const token = `${expiresAt}.${signature(expiresAt)}`;
  const cookieStore = await cookies();

  cookieStore.set(cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: sessionDurationSeconds,
    path: "/",
  });
}

export async function hasAdminSession() {
  const token = (await cookies()).get(cookieName)?.value;

  if (!token) {
    return false;
  }

  const [expiresAt, receivedSignature] = token.split(".");

  if (
    !expiresAt ||
    !receivedSignature ||
    !/^\d+$/.test(expiresAt) ||
    Number(expiresAt) < Date.now() / 1000
  ) {
    return false;
  }

  return isMatchingSignature(signature(expiresAt), receivedSignature);
}

export async function clearAdminSession() {
  (await cookies()).delete(cookieName);
}
