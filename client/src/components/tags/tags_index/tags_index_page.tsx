import { observer } from "mobx-react-lite";
import TagsTabs from "./tags_tabs";
import { Button } from "@mui/material";

const TagsIndexPage = () => {
  return (
    <div>
      <Button href="/tags/new" variant="contained" size="large">
        Create
      </Button>
      <TagsTabs />
    </div>
  );
};

export default observer(TagsIndexPage);
