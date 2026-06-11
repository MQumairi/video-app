import { Request, Response } from "express";
import { get_cookie_name, is_auth_enabled, password_matches } from "../../lib/auth/auth_store";
import { read_cookie } from "../../lib/auth/cookie";

const Status = async (req: Request, res: Response): Promise<void> => {
  const auth_enabled = is_auth_enabled();
  const candidate = read_cookie(req.headers.cookie, get_cookie_name());
  // When auth is disabled, everyone is effectively authenticated.
  const authenticated = !auth_enabled || password_matches(candidate);
  res.status(200).json({ auth_enabled, authenticated });
};

export default Status;
