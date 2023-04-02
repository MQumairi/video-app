import { getRepository } from "typeorm";
import { Tag } from "../models/tag";

export default class Tagger {
  static async combine(tags_1: Tag[], tags_2: Tag[]): Promise<Tag[]> {
    return await Tagger.expand_tags_with_children([...tags_1, ...tags_2]);
  }

  static remove(tags_to_remove: Tag[], tags_arr: Tag[]): Tag[] {
    const ids_to_remove: Set<number> = new Set(
      tags_to_remove.map((t) => {
        return t.id;
      })
    );
    const res: Tag[] = [];
    for (let t of tags_arr) {
      if (ids_to_remove.has(t.id)) continue;
      res.push(t);
    }
    return res;
  }

  static async expand_tags_with_children(tags_arr: Tag[]): Promise<Tag[]> {
    const seen_tag_ids: Set<number> = new Set();
    const res: Tag[] = [];
    const tag_repo = getRepository(Tag);
    for (let t of tags_arr) {
      const found_tag = await tag_repo.findOne(t.id, { relations: ["child_tags"] });
      if (!found_tag) continue;
      // Add tag's children
      const child_tags = found_tag.child_tags;
      child_tags.forEach((child) => {
        if (!seen_tag_ids.has(child.id)) {
          res.push(child);
          seen_tag_ids.add(child.id);
        }
      });
      // Add the tag itself
      if (!seen_tag_ids.has(found_tag.id)) {
        res.push(found_tag);
        seen_tag_ids.add(found_tag.id);
      }
    }
    return res;
  }
}
