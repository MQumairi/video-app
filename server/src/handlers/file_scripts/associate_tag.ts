import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { FileScript } from "../../models/file_script";
import { Tag } from "../../models/tag";

const AssociateTag = async (req: Request, res: Response): Promise<FileScript | undefined> => {
  console.log("entered AssociateTag");
  const id = +req.params.id;
  const file_script_repo = getRepository(FileScript);
  const req_tag_id: number = req.body.tag_id;
  const tag_repo = getRepository(Tag);
  const script = await file_script_repo.findOne(id);
  if (!script || script.is_global_script) {
    console.log("did not find valid script");
    res.status(404).send({ message: "file script not found" });
    return;
  }
  const tag = await tag_repo
    .createQueryBuilder("tag")
    .addGroupBy("tag.id")
    .leftJoinAndSelect("tag.galleries", "gallery")
    .addGroupBy("gallery.id")
    .leftJoinAndSelect("tag.videos", "video")
    .addGroupBy("video.id")
    .where(`tag.id = ${req_tag_id}`)
    .getOne();

  if (!tag) {
    console.log("did not find tag");
    res.status(404).send({ message: "tag not found" });
    return;
  }
  // Associate all tag videos with script
  for (let v of tag.videos) {
    console.log(`associating to video: ${v.id}`);
    await FileScript.associate_script_to_video(script, v);
  }
  // Associate all tag galleries with script
  for (let g of tag.galleries) {
    console.log(`associating to gallery: ${g.id}`);
    await FileScript.associate_script_to_gallery(script, g);
  }
  console.log(`done associating ${script.name} script to media`);
  res.status(200).send(script);
  return script;
};

export default AssociateTag;
