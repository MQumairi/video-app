import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { PersistentQuery } from "../../models/persistent_query";

const Details = async (req: Request, res: Response): Promise<PersistentQuery | undefined> => {
  try {
    const id = +req.params.id;
    const persistent_query = await getRepository(PersistentQuery).findOne(id);
    if (!persistent_query) {
      res.status(404).send("PersistentQuery not found");
    } else {
      // Include the template (with its tags) so the client can show the inherited configuration
      persistent_query.template = persistent_query.template_id ? (await getRepository(PersistentQuery).findOne(persistent_query.template_id)) ?? null : null;
      res.status(200).send(persistent_query);
    }
    return persistent_query;
  } catch (err) {
    console.log(err);
  }
};

export default Details;
