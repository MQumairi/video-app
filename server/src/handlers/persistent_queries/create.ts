import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { PersistentQuery } from "../../models/persistent_query";

const Create = async (req: Request, res: Response): Promise<PersistentQuery | undefined> => {
  try {
    let persistent_query: PersistentQuery = req.body;
    const persistent_query_repo = getRepository(PersistentQuery);
    await persistent_query_repo.save(persistent_query);
    res.status(200).send(persistent_query);
    return persistent_query;
  } catch (error) {
    //Upon failure, do the following
    res.status(409).send("Failed to create PersistentQuery, error:\n" + error);
    return undefined;
  }
};

export default Create;
