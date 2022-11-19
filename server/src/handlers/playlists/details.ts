import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Tag } from "../../models/tag";

const Details = async (req: Request, res: Response): Promise<Tag | undefined> => {
  console.log("entered playlists details");
  const id = +req.params.id;
  const tag_repo = getRepository(Tag);
  const playlist = await tag_repo
    .createQueryBuilder("playlist")
    .where("playlist.id = :id", { id: id })
    .innerJoinAndSelect("playlist.videos", "videos")
    .orderBy("videos.name", "ASC")
    .getOne();

  if (!playlist) {
    res.status(404).send("Playlist not found");
    return undefined;
  }
  res.status(200).send(playlist);
  return playlist;
};

export default Details;
