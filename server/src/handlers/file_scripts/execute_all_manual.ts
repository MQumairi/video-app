import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { FileScript } from "../../models/file_script";
import { VideoMeta } from "../../models/video_meta";
import { ImageMeta } from "../../models/image_meta";

const query_videos = async (scriptId: number, videoOffset: number, batchSize: number): Promise<VideoMeta[]> => {
  const videoMetaRepository = getRepository(VideoMeta);
  return await videoMetaRepository
    .createQueryBuilder("videoMeta")
    .innerJoin("videoMeta.file_scripts", "fileScript")
    .where("fileScript.id = :scriptId", { scriptId })
    .skip(videoOffset)
    .take(batchSize)
    .getMany();
};

const query_images = async (scriptId: number, imageOffset: number, batchSize: number): Promise<ImageMeta[]> => {
  const imageMetaRepository = getRepository(ImageMeta);
  return await imageMetaRepository
    .createQueryBuilder("imageMeta")
    .innerJoin("imageMeta.file_scripts", "fileScript")
    .where("fileScript.id = :scriptId", { scriptId })
    .skip(imageOffset)
    .take(batchSize)
    .getMany();
};

const process_videos = async (script: FileScript, videos: VideoMeta[]) => {
  console.log("iterating over videos...");
  for (let v of videos) {
    console.log(`processing "${v.id}"`);
    await FileScript.execute_script(script, `./${v.path}`);
  }
  console.log(`finished executing on videos`);
};

const process_images = async (script: FileScript, images: ImageMeta[]) => {
  console.log("iterating over images...");
  for (let i of images) {
    console.log(`processing image ${i.id}`);
    await FileScript.execute_script(script, `./${i.path}`);
  }
  console.log(`finished executing on images`);
};

const ExecuteAllManual = async (req: Request, res: Response): Promise<FileScript | undefined> => {
  console.log("entered ExecuteAllManual");
  const id = +req.params.id;
  const fileScriptRepository = getRepository(FileScript);

  const batchSize = 50;

  const fileScript = await fileScriptRepository.findOne(id);
  if (!fileScript) {
    res.status(404).send({ message: "file script not found" });
    return;
  }

  let videoOffset = 0;
  let videosBatch = await query_videos(id, videoOffset, batchSize);

  let imageOffset = 0;
  let imagesBatch = await query_images(id, imageOffset, batchSize);

  while (videosBatch.length > 0 || imagesBatch.length > 0) {
    // process videos and images in batches
    await process_videos(fileScript, videosBatch);
    await process_images(fileScript, imagesBatch);

    // update batch offsets and get next batch of videos/images
    videoOffset += batchSize;
    videosBatch = await query_videos(id, videoOffset, batchSize);

    imageOffset += batchSize;
    imagesBatch = await query_images(id, imageOffset, batchSize);
  }

  return fileScript;
};

export default ExecuteAllManual;
