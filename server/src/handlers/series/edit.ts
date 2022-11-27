import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Series } from "../../models/series";

const Edit = async (req: Request, res: Response): Promise<Series | undefined> => {
  const id = +req.params.id;
  const series_repo = getRepository(Series);
  let found_series = await series_repo.findOne({ where: { id: id, is_playlist: true } });
  if (found_series === undefined) {
    res.status(404).send("Series not found");
    return undefined;
  }
  found_series.name = req.body.name;
  await series_repo.save(found_series);
  res.status(201).send(found_series);
  return found_series;
};

export default Edit;