import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { PersistentQuery } from "../../models/persistent_query";

const List = async (req: Request, res: Response): Promise<PersistentQuery[]> => {
  try {
    console.log("entered list");
    const persistent_query_repo = getRepository(PersistentQuery);
    const persistent_queries = await persistent_query_repo.find();
    res.json(persistent_queries);
    return persistent_queries;
  } catch (err) {
    console.log(err);
    return [];
  }
};

export default List;
