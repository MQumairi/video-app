import { createContext } from "react";
import { makeObservable, observable, action, toJS } from "mobx";
import ITag from "../models/tag";
import { Tag } from "../api/agent";

export enum TagSelectorType {
  IncludedTags = 1,
  ExcludedTags,
}

class TagsStore {
  constructor() {
    makeObservable(this);
  }

  // All Tags
  @observable tags: ITag[] = [];

  @action set_tags = (tags: ITag[]) => {
    this.tags = tags;
  };

  @action lookup = async () => {
    let res = await Tag.get();
    if (res.status !== 200) return;
    const fetched_tags: ITag[] = res.data;
    this.set_tags(fetched_tags);
  };

  // Included Tags
  @observable included_tags: ITag[] = [];

  // Excluded Tags
  @observable excluded_tags: ITag[] = [];

  @action set_selected_tags = (tags: ITag[]) => {
    this.included_tags = tags;
  };

  get_selected_tags = (): ITag[] => {
    return toJS(this.included_tags);
  };

  // Utility functions

  // Given selected tag search query in 1-2-3 form, return array of tags
  search_query_to_tags = (tags_params: string): ITag[] => {
    const tag_ids = new Set(
      tags_params.split("-").map((t) => {
        return +t;
      })
    );
    const tags_from_params: ITag[] = [];
    for (const t of this.tags) {
      if (tag_ids.has(t.id)) tags_from_params.push(t);
    }
    return tags_from_params;
  };

  // Remove the given tag from selected_tags
  deselect = (tag: ITag) => {
    const new_tags: ITag[] = [];
    for (let i = 0; i < this.included_tags.length; i++) {
      const t = this.included_tags[i];
      if (t.id !== tag.id) {
        new_tags.push(t);
      }
    }
    this.set_selected_tags(new_tags);
  };

  // Return query params for all selected tags in 1-2-3 format
  selected_tags_query_parms = (): string => {
    return this.ids(this.included_tags).join("-");
  };

  // Given array of tags return array of their ids
  ids = (tags: ITag[]): number[] => {
    return tags.map((t) => {
      return t.id;
    });
  };
}

export default createContext(new TagsStore());
