import { Button, ButtonGroup } from "@mui/material";
import { Cleanup } from "../../api/agent";

const CleanupPage = () => {
  return (
    <div>
      <h1>Cleanup Page</h1>
      <ButtonGroup variant="contained" aria-label="outlined primary button group">
        <Button size="large" onClick={async () => await Cleanup.delete_missing_videos()}>
          Delete Videos
        </Button>
        <Button size="large" onClick={async () => await Cleanup.tag_videos()}>
          Tag Videos
        </Button>
        <Button size="large" onClick={async () => await Cleanup.delete_duplicate_tags()}>
          Duplicate Tags
        </Button>
        <Button size="large" onClick={async () => await Cleanup.cleanup_thumbs()}>
          Thumbnail Cleanup
        </Button>
        <Button size="large" onClick={async () => await Cleanup.cleanup_video_file_meta()}>
          Video File Meta
        </Button>
        <Button size="large" onClick={async () => await Cleanup.cleanup_file_scripts()}>
          File Scripts
        </Button>
        <Button size="large" onClick={async () => await Cleanup.cleanup_galleries()}>
          Galleries
        </Button>
        <Button size="large" onClick={async () => await Cleanup.cleanup_images()}>
          Images
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default CleanupPage;
