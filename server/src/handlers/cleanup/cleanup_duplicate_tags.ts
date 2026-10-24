import { EntityManager, getManager, getRepository } from "typeorm";
import { Tag } from "../../models/tag";
import { Request, Response } from "express";

type CountedTag = Tag & { video_count: number };

const TYPE_FLAGS = ["is_playlist", "is_dynamic_playlist", "is_character", "is_series", "is_studio", "is_script"] as const;

// Repoint every reference to the duplicate tag at the keeper. Relations are read from the
// TypeORM metadata so new relations to Tag are merged without changing this handler.
const MergeTagReferences = async (manager: EntityManager, keeper_id: number, duplicate_id: number): Promise<void> => {
  for (const entity of manager.connection.entityMetadatas) {
    for (const relation of entity.relations) {
      const points_to_tag = relation.inverseEntityMetadata.target === Tag;
      const owned_by_tag = relation.entityMetadata.target === Tag;
      if (relation.isManyToMany && relation.isOwning && (points_to_tag || owned_by_tag)) {
        const junction = relation.junctionEntityMetadata!;
        const owner_column = junction.ownerColumns[0].databaseName;
        const inverse_column = junction.inverseColumns[0].databaseName;
        const tag_columns: [string, string][] = [];
        if (owned_by_tag) tag_columns.push([owner_column, inverse_column]);
        if (points_to_tag) tag_columns.push([inverse_column, owner_column]);
        for (const [column, other] of tag_columns) {
          // Drop rows the keeper already has, then move the rest over
          await manager.query(
            `DELETE FROM "${junction.tableName}" d WHERE d."${column}" = $1 AND EXISTS (SELECT 1 FROM "${junction.tableName}" k WHERE k."${column}" = $2 AND k."${other}" = d."${other}")`,
            [duplicate_id, keeper_id]
          );
          await manager.query(`UPDATE "${junction.tableName}" SET "${column}" = $1 WHERE "${column}" = $2`, [keeper_id, duplicate_id]);
        }
        // Self-referencing relations (child_tags, playlist_included_tags) must not point the keeper at itself
        if (owned_by_tag && points_to_tag) {
          await manager.query(`DELETE FROM "${junction.tableName}" WHERE "${owner_column}" = $1 AND "${inverse_column}" = $1`, [keeper_id]);
        }
      } else if (relation.isManyToOne && points_to_tag) {
        const column = relation.joinColumns[0].databaseName;
        await manager.query(`UPDATE "${entity.tableName}" SET "${column}" = $1 WHERE "${column}" = $2`, [keeper_id, duplicate_id]);
      } else if (relation.isManyToOne && owned_by_tag) {
        // e.g. activation_script: inherit the duplicate's value only if the keeper has none
        const column = relation.joinColumns[0].databaseName;
        await manager.query(
          `UPDATE "${entity.tableName}" SET "${column}" = (SELECT "${column}" FROM "${entity.tableName}" WHERE id = $2) WHERE id = $1 AND "${column}" IS NULL`,
          [keeper_id, duplicate_id]
        );
      }
    }
  }
};

const MergeTagFlags = (keeper: Tag, duplicate: Tag): void => {
  keeper.default_excluded = keeper.default_excluded || duplicate.default_excluded;
  keeper.default_hidden = keeper.default_hidden || duplicate.default_hidden;
  // Only one type flag should be set, so take the duplicate's type only if the keeper has none
  if (TYPE_FLAGS.some((flag) => keeper[flag])) return;
  for (const flag of TYPE_FLAGS) keeper[flag] = duplicate[flag];
};

const CleanupDuplicateTags = async (req: Request, res: Response): Promise<void> => {
  console.log("cleaning database from duplicate tags");
  const tags = (await getRepository(Tag)
    .createQueryBuilder("tag")
    .loadRelationCountAndMap("tag.video_count", "tag.videos")
    .getMany()) as CountedTag[];
  const groups = new Map<string, CountedTag[]>();
  for (let t of tags) {
    const key = t.name.toLowerCase();
    groups.set(key, [...(groups.get(key) ?? []), t]);
  }
  const merged: { kept: Tag; merged: Tag[] }[] = [];
  for (const group of Array.from(groups.values())) {
    if (group.length < 2) continue;
    // Keep the most used casing; the oldest tag breaks ties
    group.sort((a, b) => b.video_count - a.video_count || a.id - b.id);
    const [keeper, ...duplicates] = group;
    console.log(`merging tags ${duplicates.map((d) => d.id)} into tag ${keeper.id} (${keeper.name})`);
    await getManager().transaction(async (manager) => {
      for (const duplicate of duplicates) {
        await MergeTagReferences(manager, keeper.id, duplicate.id);
        MergeTagFlags(keeper, duplicate);
        await manager.delete(Tag, duplicate.id);
      }
      const flags = { default_excluded: keeper.default_excluded, default_hidden: keeper.default_hidden };
      for (const flag of TYPE_FLAGS) Object.assign(flags, { [flag]: keeper[flag] });
      await manager.update(Tag, keeper.id, flags);
    });
    merged.push({ kept: keeper, merged: duplicates });
  }
  console.log("done cleanup duplicate tags:", { groups_merged: merged.length, tags_removed: merged.reduce((n, m) => n + m.merged.length, 0) });
  res.json(merged);
};

export default CleanupDuplicateTags;
