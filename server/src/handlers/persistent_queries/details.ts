import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { PersistentQuery } from "../../models/persistent_query";

const Details = async (req: Request, res: Response): Promise<PersistentQuery | undefined> => {
  const id = +req.params.id;
  const persistent_query = await getRepository(PersistentQuery).findOne(id);
  if (!persistent_query) {
    res.status(404).send("PersistentQuery not found");
  } else {
    res.status(200).send(persistent_query);
  }
  return persistent_query;
};

export default Details;
