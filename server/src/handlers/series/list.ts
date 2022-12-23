import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Series } from "../../models/series";

const List = async (req: Request, res: Response): Promise<Series[]> => {
  const seriesRepo = getRepository(Series);
  const seriesList = await seriesRepo.find({ order: { name: "ASC" } });
  res.json(seriesList);
  return seriesList;
};

export default List;
