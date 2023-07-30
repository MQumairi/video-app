import { Repository, getRepository } from "typeorm";
import { Request, Response } from "express";
import { VideoMeta } from "../../models/video_meta";
import { readdirSync } from "fs";
import { ImageGallery } from "../../models/image_gallery";

function doesFileExist(filePath: string): boolean {
  try {
    const dirName = filePath.substring(0, filePath.lastIndexOf("/"));
    const fileName = filePath.substring(filePath.lastIndexOf("/") + 1);
    const dirContents = readdirSync(dirName);

    // Check if the file exists with case sensitivity
    const fileExists = dirContents.some((file) => file === fileName);

    return fileExists;
  } catch (error) {
    // Handle any errors, such as directory not found, etc.
    return false;
  }
}

const CleanupMissingVideos = async (req: Request, res: Response): Promise<void> => {
  console.log("cleaning database from missing videos");
  let video_repo = getRepository(VideoMeta);
  let videos = await video_repo.find({ relations: ["file_scripts", "gallery"] });
  let result = new Map<string, boolean>();
  const counter = { deleted: 0, kept: 0 };
  for (let v of videos) {
    let path_exists = doesFileExist(v.path);
    result.set(v.name, path_exists);
    if (!path_exists) {
      console.log(`deleting video ${v.name}`);
      await delete_video(v, video_repo);
      counter.deleted += 1;
    } else {
      counter.kept += 1;
    }
  }
  console.log("done cleanup missing videos:", counter);
  res.status(200).json(Object.fromEntries(result));
};

const delete_video = async (v: VideoMeta, video_repo: Repository<VideoMeta>) => {
  if (v.gallery) {
    await ImageGallery.delete_gallery(v.gallery);
  }
  await video_repo.remove(v);
};

export default CleanupMissingVideos;
