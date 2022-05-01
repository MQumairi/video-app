import { Router, Request, Response } from "express";
import Details from "../handlers/directories/details";

const directory_controller = Router();

directory_controller.get("/:filepath", async (req: Request, res: Response) => {
  // Note: forward slashes need to be convered to %2F by the client
  // Such that data/dir_1 => data%2Fdir_1, see directory_controller tests
  await Details(req, res);
});

export default directory_controller;
