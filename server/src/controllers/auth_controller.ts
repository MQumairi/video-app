import { Router, Request, Response } from "express";
import Login from "../handlers/auth/login";
import Status from "../handlers/auth/status";
import Logout from "../handlers/auth/logout";

const auth_controller = Router();

auth_controller.post("/login", async (req: Request, res: Response) => {
  await Login(req, res);
});

auth_controller.get("/status", async (req: Request, res: Response) => {
  await Status(req, res);
});

auth_controller.post("/logout", async (req: Request, res: Response) => {
  await Logout(req, res);
});

export default auth_controller;
