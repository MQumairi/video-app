import { Request, Response } from "express";
import { get_cookie_name, password_matches } from "../../lib/auth/auth_store";

const TEN_YEARS_MS = 10 * 365 * 24 * 60 * 60 * 1000;

const Login = async (req: Request, res: Response): Promise<void> => {
  const password: string | undefined = req.body?.password;
  if (!password_matches(password)) {
    res.status(401).json({ authenticated: false });
    return;
  }
  res.cookie(get_cookie_name(), password, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: TEN_YEARS_MS,
    path: "/",
  });
  res.status(200).json({ authenticated: true });
};

export default Login;
