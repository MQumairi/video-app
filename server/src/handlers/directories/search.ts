import { Request, Response } from "express";
import { Directory } from "../../lib/directory";
import { VideoMeta } from "../../models/video_meta";
import { data_dir } from "../../app";
import { promisify } from "util";
import { exec as exec_sync } from "child_process";
const exec = promisify(exec_sync);

const Search = async (req: Request, res: Response): Promise<Directory | undefined> => {
  const search_query = req.params.query;
  const find_command = `find ${data_dir} -iname "*${search_query}*"`;
  const find_results = (await exec(find_command)).stdout.split("\n");
  const directories: string[] = [];
  const videos: VideoMeta[] = [];
  for (const result of find_results) {
    if (result == "") {
      continue;
    }
    if (await Directory.is_directory(result)) {
      const dir_to_add = new Directory(result);
      if (dir_to_add) {
        directories.push(result);
      }
    }
    if (Directory.is_video(result)) {
      const vid_to_add = new VideoMeta(result);
      videos.push(vid_to_add);
    }
  }
  res.status(200).send({ query: search_query, directories: directories, videos: videos });
  return undefined;
};

export default Search;
