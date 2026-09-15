import { cookies } from "next/headers";
import { adminAuth, isAllowedAdmin } from "./firebaseAdmin";

export const sessionCookieName = "__session";

export async function getSessionUser() {
  const token = (await cookies()).get(sessionCookieName)?.value;
  if (!token) return null;

  try {
    const decoded = await adminAuth().verifySessionCookie(token, true);
    if (!isAllowedAdmin(decoded.email)) return null;
    return decoded;
  } catch {
    return null;
  }
}
