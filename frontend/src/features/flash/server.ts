import "server-only";

import { cookies } from "next/headers";

import { FLASH_COOKIE, type FlashKey, flashCookieOptions } from "./messages";

/** Queue a toast for the next page (call before `redirect()` in a Server Action). */
export async function setFlash(key: FlashKey) {
  (await cookies()).set(FLASH_COOKIE, key, flashCookieOptions);
}
