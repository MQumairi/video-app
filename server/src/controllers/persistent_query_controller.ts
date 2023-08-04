import { Router, Request, Response } from "express";
import Create from "../handlers/persistent_queries/create";
import List from "../handlers/persistent_queries/list";
import Details from "../handlers/persistent_queries/details";
import Delete from "../handlers/persistent_queries/delete";

const persistent_query_controller = Router();

persistent_query_controller.get("/", async (req: Request, res: Response) => {
  await List(req, res);
});

persistent_query_controller.get("/:id", async (req: Request, res: Response) => {
  await Details(req, res);
});

persistent_query_controller.post("/", async (req: Request, res: Response) => {
  await Create(req, res);
});

persistent_query_controller.delete("/:id", async (req: Request, res: Response) => {
  await Delete(req, res);
});

export default persistent_query_controller;
