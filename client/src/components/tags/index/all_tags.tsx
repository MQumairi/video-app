import { observer } from "mobx-react-lite";
import { useContext, useEffect } from "react";
import TagsList from "./tags_list";
import TagsStore from "../../../store/tags_store";

const AllTags = () => {
  const tags_store = useContext(TagsStore);

  useEffect(() => {
    tags_store.lookup();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <h1>All Tags</h1>
      <h4>{tags_store.tags.length} tags</h4>
      <TagsList tags={tags_store.tags} />
    </div>
  );
};

export default observer(AllTags);
