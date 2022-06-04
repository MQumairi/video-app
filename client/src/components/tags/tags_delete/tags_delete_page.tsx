import { ButtonGroup } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Tag } from "../../../api/agent";
import ITag from "../../../models/tag";
import FunctionButton from "../../misc/function_button";
import HrefButton from "../../misc/href_button";

const TagsDeletePage = () => {
  let tag_id = useParams().tag_id;
  const [tag, set_tag] = useState<ITag | null>(null);

  const fetch_tag = async () => {
    if (!tag_id) {
      return;
    }
    let response: ITag = (await Tag.details(+tag_id)).data;
    set_tag(response);
  };

  const handle_tag_delete = async () => {
    window.location.replace(`/tags/`);
    if (tag_id) {
      await Tag.delete(+tag_id);
    }
  };

  useEffect(() => {
    fetch_tag();
  }, []);

  return (
    <div>
      <h1>Are you sure you want to delete the "{tag?.name}" tag?</h1>
      <ButtonGroup>
        <HrefButton href={"/tags"} textContent="Back" />
        <FunctionButton fn={handle_tag_delete} textContent="Delete" />
      </ButtonGroup>
    </div>
  );
};

export default observer(TagsDeletePage);
