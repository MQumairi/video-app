import { Request, Response } from "express";
import { get_cookie_name } from "../../lib/auth/auth_store";

const Logout = async (_req: Request, res: Response): Promise<void> => {
  res.clearCookie(get_cookie_name(), { path: "/" });
  res.status(200).json({ authenticated: false });
};

export default Logout;
