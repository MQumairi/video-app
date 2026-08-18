import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { PersistentQuery } from "../../models/persistent_query";
import { DUPLICATE_SUFFIX } from "../../lib/duplicate_name";

const Duplicate = async (req: Request, res: Response): Promise<PersistentQuery | undefined> => {
  const id = +req.params.id;
  const query_repo = getRepository(PersistentQuery);
  const found_query = await query_repo.findOne(id);
  if (!found_query) {
    res.status(404).send("PersistentQuery not found");
    return undefined;
  }
  const duplicate = new PersistentQuery();
  duplicate.name = `${found_query.name} ${DUPLICATE_SUFFIX}`;
  duplicate.included_tags = found_query.included_tags ?? [];
  duplicate.excluded_tags = found_query.excluded_tags ?? [];
  duplicate.studios = found_query.studios ?? [];
  duplicate.fairness_tags = found_query.fairness_tags ?? [];
  duplicate.search_text = found_query.search_text;
  duplicate.min_rating = found_query.min_rating;
  duplicate.max_rating = found_query.max_rating;
  duplicate.min_duration_sec = found_query.min_duration_sec;
  duplicate.max_duration_sec = found_query.max_duration_sec;
  duplicate.frame_height = found_query.frame_height;
  const saved_query = await query_repo.save(duplicate);
  res.status(201).send(saved_query);
  return saved_query;
};

export default Duplicate;
