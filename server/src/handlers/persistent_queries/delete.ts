import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { PersistentQuery } from "../../models/persistent_query";

const Delete = async (req: Request, res: Response): Promise<void> => {
  const id = +req.params.id;
  const persistent_query_repo = getRepository(PersistentQuery);
  const persistent_query = await persistent_query_repo.findOne(id);
  if (!persistent_query) {
    res.status(404).send(`Persistent query of id ${id} not found`);
    return;
  }
  await persistent_query_repo.remove(persistent_query!);
  res.status(200).send(`Persistent query of id ${id} removed`);
};

export default Delete;
