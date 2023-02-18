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

  @action add_searched_for_tag = (tag_name: string) => {
    console.log("attempting to add tag:", tag_name);
    const tag_to_add: ITag = {
      name: tag_name,
      id: 0,
      videos: [],
    };
    this.searched_for_tags.push(tag_to_add);
    console.log("searched_for_tags now:", toJS(this.searched_for_tags));
  };

  @action remove_searched_for_tag = (tag_name: string) => {
    console.log("attempting to remove tag:", tag_name);
    for (let i = 0; i < this.searched_for_tags.length; i++) {
      if (this.searched_for_tags[i].name === tag_name) {
        this.searched_for_tags.splice(i, 1);
      }
    }
    console.log("searched_for_tags now:", toJS(this.searched_for_tags));
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
