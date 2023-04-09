import { createContext } from "react";
import { makeObservable, observable, action } from "mobx";
import IVideoMeta from "../models/video_meta";
import IImageGallery from "../models/image_gallery";
import ITag from "../models/tag";
import IFileScript from "../models/file_script";
import { Video } from "../api/agent";

class VideoStore {
  constructor() {
    makeObservable(this);
  }

  // Selected Video
  @observable selected_video: IVideoMeta | undefined = undefined;

  @observable selected_video_rating: number | null = null;

  @observable selected_video_tags: ITag[] = [];

  @observable selected_video_gallery: IImageGallery | undefined = undefined;

  @observable selected_video_scripts: IFileScript[] = [];

  @observable selected_video_similiar_videos: IVideoMeta[] = [];

  @action set_selected_video = (video: IVideoMeta | undefined) => {
    this.selected_video = video;
    if (video) this.selected_video_rating = video.rating;
  };

  @action set_selected_video_rating = (rating: number | null) => {
    this.selected_video_rating = rating;
  };

  @action lookup_selected_video_tags = async () => {
    if (!this.selected_video) return;
    const res = await Video.tags(this.selected_video);
    if (res.status !== 200) return;
    this.selected_video_tags = res.data;
  };

  @action lookup_selected_video_gallery = async () => {
    if (!this.selected_video) return;
    const res = await Video.gallery(this.selected_video);
    if (res.status !== 200) return;
    this.selected_video_gallery = res.data;
  };

  @action lookup_selected_video_scripts = async () => {
    if (!this.selected_video) return;
    const res = await Video.scripts(this.selected_video);
    if (res.status !== 200) return;
    this.selected_video_scripts = res.data;
  };

  @action lookup_selected_video_similar_videos = async () => {
    if (!this.selected_video) return;
    const res = await Video.similar(this.selected_video);
    if (res.status !== 200) return;
    this.selected_video_similiar_videos = res.data;
  };
}

export default createContext(new VideoStore());
