import { Router, Request, Response } from "express";
import Browse from "../handlers/directories/browse";

const directory_controller = Router();

directory_controller.get("/:filepath", async (req: Request, res: Response) => {
  // Note: forward slashes need to be convered to %2F by the client
  // Such that data/dir_1 => data%2Fdir_1, see directory_controller tests
  await Browse(req, res);
});

export default directory_controller;
