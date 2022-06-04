import { observable, action } from "mobx";
import { createContext } from "react";
import IVideoMeta from "../models/video_meta";

class SelectedVideosStore {
  @observable title = "Hello from MobX";
  @observable selected_videos = new Set<IVideoMeta>();

  @action add_selected_video = (video: IVideoMeta) => {
    this.selected_videos.add(video);
  };

  @action clear_selected_videos = () => {
    this.selected_videos.clear();
  };
}

export default createContext(new SelectedVideosStore());
