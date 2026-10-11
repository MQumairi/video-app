import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { PersistentQuery } from "../../models/persistent_query";

const Create = async (req: Request, res: Response): Promise<PersistentQuery | undefined> => {
  try {
    const submitted_query: PersistentQuery = req.body;
    const persistent_query = Object.assign(new PersistentQuery(), submitted_query);
    // Templates can't inherit from other templates
    persistent_query.is_template = submitted_query.is_template ?? false;
    persistent_query.template_id = persistent_query.is_template ? null : submitted_query.template_id ?? null;
    delete (persistent_query as Partial<PersistentQuery>).template;
    const template_error = await PersistentQuery.template_assignment_error(persistent_query, persistent_query.template_id);
    if (template_error) {
      res.status(400).send(template_error);
      return undefined;
    }
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
