import { PersistentQuery } from "../src/models/persistent_query";
import { Tag } from "../src/models/tag";

const tag = (id: number, name: string): Tag => Object.assign(new Tag(), { id, name });

const award_winning = tag(1, "Award Winning");
const release_2025 = tag(2, "2025 release");
const horror = tag(3, "horror");
const pg_15 = tag(4, "pg 15");
const netflix = tag(5, "Netflix");
const hbo = tag(6, "HBO");

const query = (fields: Partial<PersistentQuery>): PersistentQuery =>
  Object.assign(PersistentQuery.create("query", [], [], [], 0, 10, 0, 99999999, 0), { search_text: "" }, fields);

test("combines included tags of the template and query", () => {
  const template = query({ is_template: true, included_tags: [release_2025, award_winning] });
  const child = query({ included_tags: [horror, pg_15, award_winning] });
  const resolved = PersistentQuery.merge_template(child, template);
  expect(resolved.included_tags.map((t) => t.name)).toEqual(["2025 release", "Award Winning", "horror", "pg 15"]);
});

test("does not modify the stored query", () => {
  const template = query({ is_template: true, included_tags: [release_2025] });
  const child = query({ included_tags: [horror] });
  PersistentQuery.merge_template(child, template);
  expect(child.included_tags).toEqual([horror]);
});

test("query studios replace template studios, template studios apply when the query has none", () => {
  const template = query({ is_template: true, studios: [netflix] });
  expect(PersistentQuery.merge_template(query({ studios: [hbo] }), template).studios).toEqual([hbo]);
  expect(PersistentQuery.merge_template(query({ studios: [] }), template).studios).toEqual([netflix]);
});

test("numeric bounds take the stricter value", () => {
  const template = query({ is_template: true, min_rating: 6, max_rating: 9, frame_height: 720 });
  const resolved = PersistentQuery.merge_template(query({ min_rating: 4, max_rating: 10, frame_height: 1080 }), template);
  expect(resolved.min_rating).toBe(6);
  expect(resolved.max_rating).toBe(9);
  expect(resolved.frame_height).toBe(1080);
});

test("both search texts must match", async () => {
  const template = query({ is_template: true, search_text: "movies" });
  const resolved = PersistentQuery.merge_template(query({ search_text: "2025" }), template);
  const search_query = await PersistentQuery.build_search_query(resolved);
  expect(search_query.searched_text).toBe("2025");
  expect(search_query.additional_searched_texts).toEqual(["movies"]);
  expect(PersistentQuery.merge_template(query({ search_text: "" }), template).search_text).toBe("movies");
});
