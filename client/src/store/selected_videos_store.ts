import { observable, action } from "mobx";
import { createContext } from "react";
import IVideoMeta from "../models/video_meta";
import { makeObservable, toJS } from "mobx";

class SelectedVideosStore {
  constructor() {
    makeObservable(this);
  }
  // Toggles
  @observable tag_popover_visible = false;
  @action toggle_tag_popover = () => {
    this.tag_popover_visible = !this.tag_popover_visible;
  };

  @observable playlist_popover_visible = false;
  @action toggle_playlist_popover = () => {
    this.playlist_popover_visible = !this.playlist_popover_visible;
  };

  @observable remove_vid_popover_visible = false;
  @action toggle_remove_vid_popover = () => {
    this.remove_vid_popover_visible = !this.remove_vid_popover_visible;
  };

  // Selected videos

  @observable selected_videos = new Map<string, IVideoMeta>();

  @action add_selected_video = (video: IVideoMeta) => {
    this.selected_videos.set(video.name, video)
  };

  @action remove_selected_video = (video: IVideoMeta) => {
    this.selected_videos.delete(video.name);
  };

  @action clear_selected_videos = () => {
    this.selected_videos.clear();
  };
}

export default createContext(new SelectedVideosStore());
