import { SelectQueryBuilder } from "typeorm";
import { VideoMeta } from "../../models/video_meta";
import { BatchResult } from "../file_batcher";

export class VideoBatcher {
  static BATCHSIZE = 50;

  static execute_handler = async (
    query: SelectQueryBuilder<VideoMeta>,
    handler: (video: VideoMeta, args: any[]) => Promise<boolean>,
    args: any[]
  ): Promise<BatchResult> => {
    const result: BatchResult = { successes: 0, failures: 0 };
    // Get first batch
    let offset = 0;
    let video_batch = await VideoBatcher.query_videos(query, offset);
    while (video_batch.length > 0) {
      // Process video batch
      const batch_res = await VideoBatcher.process_batch(video_batch, handler, args);
      result.successes += batch_res.successes;
      result.failures += batch_res.failures;
      // Update batch offsets and get next batch of videos
      offset += VideoBatcher.BATCHSIZE;
      video_batch = await VideoBatcher.query_videos(query, offset);
    }
    return result;
  };

  private static process_batch = async (
    videos: VideoMeta[],
    handler: (video: VideoMeta, args: any[]) => Promise<boolean>,
    args: any[]
  ): Promise<BatchResult> => {
    const batch_result: BatchResult = { successes: 0, failures: 0 };
    for (let v of videos) {
      const handler_res = await handler(v, args);
      if (handler_res) {
        batch_result.successes += 1;
      } else {
        batch_result.failures += 1;
      }
    }
    return batch_result;
  };

  private static query_videos = async (query: SelectQueryBuilder<VideoMeta>, offset: number): Promise<VideoMeta[]> => {
    return await query.skip(offset).take(VideoBatcher.BATCHSIZE).getMany();
  };
}
