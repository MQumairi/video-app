import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { PersistentQuery } from "../../models/persistent_query";

const Edit = async (req: Request, res: Response): Promise<PersistentQuery | undefined> => {
  console.log("eneted query edit");
  const id = +req.params.id;
  const query_repo = getRepository(PersistentQuery);
  const found_query = await query_repo.findOne(id);
  if (!found_query) {
    res.status(404).send("PersistentQuery not found");
    return;
  }
  const submitted_query: PersistentQuery = req.body;
  console.log(submitted_query);

  found_query.name = submitted_query.name;
  found_query.included_tags = submitted_query.included_tags;
  found_query.excluded_tags = submitted_query.excluded_tags;
  found_query.studios = submitted_query.studios ?? [];
  found_query.fairness_tags = submitted_query.fairness_tags ?? [];
  found_query.search_text = submitted_query.search_text;
  found_query.min_rating = submitted_query.min_rating;
  found_query.max_rating = submitted_query.max_rating;
  found_query.min_duration_sec = submitted_query.min_duration_sec;
  found_query.max_duration_sec = submitted_query.max_duration_sec;
  found_query.frame_height = submitted_query.frame_height;
  // is_template is fixed at creation, so a template's children can't end up inheriting from a regular query
  if (!found_query.is_template) {
    const template_id = submitted_query.template_id ?? null;
    const template_error = await PersistentQuery.template_assignment_error(found_query, template_id);
    if (template_error) {
      res.status(400).send(template_error);
      return;
    }
    found_query.template_id = template_id;
  }
  const saved_query = await query_repo.save(found_query);
  console.log("finished saving...");
  res.status(200).send(saved_query);
  return saved_query;
};

export default Edit;
