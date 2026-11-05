import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { SESSION_COOKIE, isValidSessionToken } from "./session-token";

export async function isAdmin(): Promise<boolean> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  // ვადის შემოწმება Date.now()-ს იყენებს, ამიტომ prerender-ში არ უნდა გაეშვას.
  await connection();
  return isValidSessionToken(token);
}

// proxy.ts მხოლოდ გადამისამართებს. თითოეული გვერდი და action სესიას თავად ამოწმებს.
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
}
