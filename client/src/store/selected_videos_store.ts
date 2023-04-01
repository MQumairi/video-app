import { observable, action } from "mobx";
import { createContext } from "react";
import IVideoMeta from "../models/video_meta";
import { makeObservable, toJS } from "mobx";
import ITag from "../models/tag";

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

  @observable edit_video_toggle = false;
  @action toggle_edit_video = () => {
    this.edit_video_toggle = !this.edit_video_toggle;
  };

  // Selected videos
  @observable selected_videos = new Map<string, IVideoMeta>();

  @action add_selected_video = (video: IVideoMeta) => {
    this.selected_videos.set(video.name, video);
  };

  @action remove_selected_video = (video: IVideoMeta) => {
    this.selected_videos.delete(video.name);
  };

  @action clear_selected_videos = () => {
    this.selected_videos.clear();
  };

  @action set_single_selection = (video: IVideoMeta) => {
    this.selected_tag = null;
    this.selected_videos.clear();
    this.selected_videos.set(video.name, video);
    console.log(toJS(this.selected_videos));
  };

  @action get_selected_videos = (): IVideoMeta[] => {
    return Array.from(this.selected_videos.values());
  };

  // Player
  @observable running_video: IVideoMeta | null = null;

  @action set_running_video = (video: IVideoMeta | null) => {
    this.running_video = video;
  };

  // Advanced search results
  @observable searched_for_tags: ITag[] = [];

  @action add_searched_for_tag = (tag: ITag) => {
    this.searched_for_tags.push(tag);
  };

  @action remove_searched_for_tag = (tag: ITag) => {
    for (let i = 0; i < this.searched_for_tags.length; i++) {
      if (this.searched_for_tags[i].id === tag.id) {
        return this.searched_for_tags.splice(i, 1);
      }
    }
  };

  @action set_searched_for_tags = (tags: ITag[]) => {
    console.log("tags", tags);
    this.searched_for_tags = tags;
    console.log("searched_for_tags", this.searched_for_tags.length);
  };

  @observable adv_search_results: IVideoMeta[] = [];

  @action set_adv_search_results = (videos: IVideoMeta[]) => {
    this.adv_search_results = videos;
  };

  // Tags
  @observable selected_tag: ITag | null = null;

  @action set_single_tag_selection = (tag: ITag) => {
    this.selected_tag = tag;
    console.log(toJS(this.selected_tag));
  };
}

export default createContext(new SelectedVideosStore());
