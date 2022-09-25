import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Tag } from "../../models/tag";

const Delete = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = +req.params.id;
    console.log("deleted playlist of id:", id);
    const tag_repo = getRepository(Tag);
    const playlist = await tag_repo.findOne({ where: { id: id, is_playlist: true } });
    if (!playlist) {
      res.status(404).send("Not found");
      return;
    }
    await tag_repo.remove(playlist);
    res.status(201);
  } catch (error: any) {
    console.log("error:", error);
  }
};

export default Delete;
