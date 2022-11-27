import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Series } from "../../models/series";

const Details = async (req: Request, res: Response): Promise<Series | undefined> => {
  const id = +req.params.id;
  const series_repo = getRepository(Series);
  const series = await series_repo
    .createQueryBuilder("series")
    .where("series.id = :id", { id: id })
    .innerJoinAndSelect("series.videos", "videos")
    .orderBy("videos.name", "ASC")
    .getOne();

  if (!series) {
    res.status(404).send("Series not found");
    return undefined;
  }
  res.status(200).send(series);
  return series;
};

export default Details;
