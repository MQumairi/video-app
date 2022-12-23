import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Series } from "../../models/series";

const Delete = async (req: Request, res: Response): Promise<void> => {
  const id = +req.params.id;
  const seriesRepo = getRepository(Series);
  const series = await seriesRepo.findOne(id);
  if (series === undefined) res.status(404).send("Not found");
  await seriesRepo.remove(series!);
  res.status(200).send("Removed " + series);
};

export default Delete;