import { Button, FormGroup, TextField } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Tag } from "../../../api/agent";
import ITag from "../../../models/tag";

const TagsDeletePage = () => {
  let tag_id = useParams().tag_id;
  const [tag, set_tag] = useState<ITag | null>(null);
  const [delete_input, set_delete_input] = useState<string>("");
  const [delete_success, set_delete_success] = useState<boolean>(false);

  const fetch_tag = async () => {
    if (!tag_id) return;
    let res = await Tag.details(+tag_id);
    if (res.status !== 200) return;
    set_tag(res.data.tag);
  };

  const handle_delete_input_change = (event: any) => {
    set_delete_input(event.target.value);
  };

  const handle_tag_delete = async () => {
    console.log("entered handle tag delete");
    if (!tag) return;
    console.log("tag is found");
    const res = await Tag.delete(tag);
    console.log("res:", res);
    console.log("status:", res.status);
    if (res.status !== 200) return;
    set_delete_input("");
    set_delete_success(true);
  };

  useEffect(() => {
    fetch_tag();
    // eslint-disable-next-line
  }, []);

  if (!tag)
    return (
      <div>
        <Button href={`/tags`} variant="contained">
          Back
        </Button>
        <h2 style={{ marginTop: "20px" }}>Tag {tag_id} not found</h2>
      </div>
    );

  if (delete_success)
    return (
      <div>
        <h2>Successfully deleted tag "{tag.name}"</h2>
        <Button variant="contained" size="large" color="success" href="/tags">
          Done
        </Button>
      </div>
    );

  return (
    <div>
      <Button href={`/tags/${tag_id}`} variant="contained">
        Back
      </Button>
      <h2 style={{ marginTop: "10px" }}>Are you sure you want to delete the "{tag.name}" tag?</h2>
      <FormGroup sx={{ marginTop: "20px", gap: "10px" }}>
        <TextField label="Type 'DELETE' in order to proceed with delete" value={delete_input} onChange={handle_delete_input_change} />
        {delete_input === "DELETE" && (
          <Button variant="contained" size="large" color="error" onClick={handle_tag_delete}>
            Delete
          </Button>
        )}
      </FormGroup>
    </div>
  );
};

export default observer(TagsDeletePage);
