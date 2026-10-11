import ITag from "./tag";

export interface IPersistentQueryCreate {
  name: string;
  included_tags: ITag[];
  excluded_tags: ITag[];
  studios: ITag[];
  fairness_tags: ITag[];
  search_text: string;
  min_rating: number;
  max_rating: number;
  min_duration_sec: number;
  max_duration_sec: number;
  frame_height: number;
  is_template: boolean;
  template_id: number | null;
}

export default interface IPersistentQuery extends IPersistentQueryCreate {
  id: number;
  // Only populated by the details endpoint
  template?: IPersistentQuery | null;
}

export const empty_query = (): IPersistentQuery => {
  return {
    id: -1,
    name: "None",
    included_tags: [],
    excluded_tags: [],
    studios: [],
    fairness_tags: [],
    search_text: "",
    min_rating: 0,
    max_rating: 0,
    min_duration_sec: 0,
    max_duration_sec: 0,
    frame_height: 0,
    is_template: false,
    template_id: null,
  };
};

// Shown wherever a template is assigned, so users know how its configuration is combined with the query's
export const TEMPLATE_MERGE_HELP =
  "The template's included, excluded and fairness tags are added to this query's, both search texts must match, and ratings and quality use the stricter of the two values.";
export const TEMPLATE_STUDIOS_HELP = "Studios are not combined: if this query has any studios, they replace the template's studios.";
