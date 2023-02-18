import { getRepository } from "typeorm";
import { Tag } from "../../models/tag";
import { VideoMeta } from "../../models/video_meta";
import VideoFinder from "./video_finder";
import Tagger from "../tagger";
import { ImageGallery } from "../../models/image_gallery";

export default class VideoTagger {
  videos: VideoMeta[];
  tags: Tag[];

  constructor(videos: VideoMeta[], tags: Tag[]) {
    this.videos = videos;
    this.tags = tags;
  }

  apply_tags_to_videos = async (): Promise<void> => {
    for (let v of this.videos) {
      const finder = new VideoFinder(v.path);
      finder.check_file_system = false;
      const video_to_tag = await finder.find();
      if (video_to_tag == null) return;
      console.log(`found video: ${video_to_tag.id}`);
      console.log(`applying tags to video ${video_to_tag.id}`);
      console.log(`originally has ${video_to_tag.tags.length}`);
      const new_tags = await Tagger.combine(video_to_tag.tags, this.tags);
      console.log(`new tags: ${new_tags.length}`);
      video_to_tag.tags = new_tags;
      if (video_to_tag.gallery) {
        await ImageGallery.apply_tags(video_to_tag.gallery, new_tags);
      }
      await getRepository(VideoMeta).save(video_to_tag);
      console.log(`Done applying tags to video ${video_to_tag.id}`);
    }
  };

  remove_tags_from_videos = async (): Promise<void> => {
    for (let v of this.videos) {
      const finder = new VideoFinder(v.path);
      const video_to_untag = await finder.find();
      if (video_to_untag == null) return;
      console.log(`removing tags from video ${video_to_untag.id}`);
      console.log(`originally has ${video_to_untag.tags.length} tags`);
      const new_tags = Tagger.remove(this.tags, video_to_untag.tags);
      video_to_untag.tags = new_tags;
      if (video_to_untag.gallery) {
        await ImageGallery.remove_tags(video_to_untag.gallery, this.tags);
      }
      await getRepository(VideoMeta).save(video_to_untag);
      console.log(`Done removing from video ${video_to_untag.id}`);
    }
  };
}
