import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Series } from "../../models/series";

const Create = async (req: Request, res: Response): Promise<Series | undefined> => {
  //Try to create the object
  try {
    let series: Series = req.body;
    const seriesRepo = getRepository(Series);
    await seriesRepo.save(series);
    res.status(201).send(series);
    return series;
  } catch (error) {
    //Upon failure, do the following
    res.status(409).send("Failed to create Series, error:\n" + error);
    return undefined;
  }
};

export default Create;