import { Button, ButtonGroup } from "@mui/material";
import { Cleanup } from "../../api/agent";

const CleanupPage = () => {
  const delete_missing_videos = async () => {
    await Cleanup.delete_missing_videos();
  };

  const tag_videos = async () => {
    await Cleanup.tag_videos();
  };

  const delete_duplicate_tags = async () => {
    await Cleanup.delete_duplicate_tags();
  };

  return (
    <div>
      <h1>Cleanup Page</h1>
      <ButtonGroup variant="contained" aria-label="outlined primary button group">
        <Button size="large" onClick={delete_missing_videos}>
          Delete Videos
        </Button>
        <Button size="large" onClick={tag_videos}>
          Tag Videos
        </Button>
        <Button size="large" onClick={delete_duplicate_tags}>
          Duplicate Tags
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default CleanupPage;
