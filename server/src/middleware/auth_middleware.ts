import { NextFunction, Request, Response } from "express";
import { get_cookie_name, is_auth_enabled, password_matches } from "../lib/auth/auth_store";
import { read_cookie } from "../lib/auth/cookie";

// Guards every request that reaches it. Mounted after the /api/auth routes, so
// login/status/logout are already handled before this runs; the explicit /api/auth
// skip below is defensive.
const auth_middleware = (req: Request, res: Response, next: NextFunction) => {
  if (!is_auth_enabled()) return next();
  if (req.method === "OPTIONS") return next();
  if (req.path.startsWith("/api/auth")) return next();

  const candidate = read_cookie(req.headers.cookie, get_cookie_name());
  if (password_matches(candidate)) return next();

  return res.status(401).json({ message: "unauthorized" });
};

export default auth_middleware;
