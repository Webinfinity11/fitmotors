import { createHash, createHmac, timingSafeEqual } from "node:crypto";

// ეს ფაილი proxy.ts-შიც გამოიყენება, ამიტომ next/headers-ს არ ეყრდნობა.
export const SESSION_COOKIE = "fm_admin";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 14;

// პაროლი გასაღების ნაწილია: მისი შეცვლა ყველა მოქმედ სესიას აუქმებს.
function signingKey(): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET;
  const password = process.env.ADMIN_PASSWORD;
  return secret && password ? `${secret}:${password}` : null;
}

function sign(expires: string, key: string): Buffer {
  return createHmac("sha256", key).update(`admin.${expires}`).digest();
}

export function createSessionToken(): string {
  const key = signingKey();
  if (!key) throw new Error("ADMIN_PASSWORD or ADMIN_SESSION_SECRET is not set");
  const expires = String(Date.now() + SESSION_MAX_AGE * 1000);
  return `${expires}.${sign(expires, key).toString("base64url")}`;
}

export function isValidSessionToken(token: string | undefined): boolean {
  const key = signingKey();
  if (!key || !token) return false;
  const [expires, signature] = token.split(".");
  if (!expires || !signature || !(Number(expires) > Date.now())) return false;
  const expected = sign(expires, key);
  const given = Buffer.from(signature, "base64url");
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export function isCorrectLogin(usernameInput: string, passwordInput: string): boolean {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password) return false;
  const hash = (value: string) => createHash("sha256").update(value).digest();
  // ორივე ყოველთვის მოწმდება, რომ პასუხის დრომ ვერ გასცეს, რომელი ველია სწორი.
  const usernameOk = timingSafeEqual(hash(usernameInput), hash(username));
  const passwordOk = timingSafeEqual(hash(passwordInput), hash(password));
  return usernameOk && passwordOk;
}
