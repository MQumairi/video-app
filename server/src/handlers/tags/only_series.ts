import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Tag } from "../../models/tag";

const Series = async (req: Request, res: Response): Promise<Tag[]> => {
  const tag_repo = getRepository(Tag);
  const series = await tag_repo.find({ where: { is_series: true }, order: { name: "ASC" } });
  res.json(series);
  return series;
};

export default Series;
