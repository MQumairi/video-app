import { readFileSync } from "fs";
import path from "path";
import { timingSafeEqual } from "crypto";

const COOKIE_NAME = "video_app_auth";

// Read the password once at startup. The file is optional: when it is absent,
// auth is disabled and the server behaves exactly as before (fully open).
const password = load_password();

function load_password(): string | null {
  const password_path = process.env.PASSWORD_FILE ?? path.resolve(process.cwd(), "PASSWORD");
  try {
    const contents = readFileSync(password_path, "utf-8").trim();
    if (contents.length === 0) {
      console.log(`auth: PASSWORD file at ${password_path} is empty — auth disabled`);
      return null;
    }
    console.log(`auth: enabled (password loaded from ${password_path})`);
    return contents;
  } catch (err) {
    console.log(`auth: no PASSWORD file at ${password_path} — auth disabled`);
    return null;
  }
}

export const is_auth_enabled = (): boolean => password !== null;

export const get_cookie_name = (): string => COOKIE_NAME;

export const password_matches = (candidate: string | undefined | null): boolean => {
  if (password === null || candidate == null) return false;
  const a = Buffer.from(candidate);
  const b = Buffer.from(password);
  // timingSafeEqual throws on length mismatch; guard first to keep it constant-time per length.
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
};
