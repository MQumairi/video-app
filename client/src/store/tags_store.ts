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

  @action set_selected_tags = (selector_type: TagSelectorType, tags: ITag[]) => {
    if (selector_type === TagSelectorType.IncludedTags) this.included_tags = tags;
    else if (selector_type === TagSelectorType.ExcludedTags) this.excluded_tags = tags;
  };

  get_selected_tags = (selector_type: TagSelectorType): ITag[] => {
    if (selector_type === TagSelectorType.IncludedTags) return toJS(this.included_tags);
    else if (selector_type === TagSelectorType.ExcludedTags) return toJS(this.excluded_tags);
    else return [];
  };

  deselect = (selector_type: TagSelectorType, tag: ITag) => {
    let tags_to_iterate: ITag[] = this.get_selected_tags(selector_type);
    const new_tags: ITag[] = [];
    for (let i = 0; i < tags_to_iterate.length; i++) {
      const t = tags_to_iterate[i];
      if (t.id !== tag.id) {
        new_tags.push(t);
      }
    }
    this.set_selected_tags(selector_type, new_tags);
  };

  selected_tags_query_parms = (selector_type: TagSelectorType): string => {
    return this.ids(this.get_selected_tags(selector_type)).join("-");
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

  // Given array of tags return array of their ids
  ids = (tags: ITag[]): number[] => {
    return tags.map((t) => {
      return t.id;
    });
  };
}

export default createContext(new TagsStore());
