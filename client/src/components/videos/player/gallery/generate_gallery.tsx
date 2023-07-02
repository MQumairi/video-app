import { useContext, useState } from "react";
import IVideoMeta from "../../../../models/video_meta";
import { Gallery } from "../../../../api/agent";
import VideoStore from "../../../../store/video_store";
import { observer } from "mobx-react-lite";
import { Button, ButtonGroup } from "@mui/material";

const GenerateGallery = () => {
  const [selected_files, set_selected_files] = useState<FileList | null>(null);
  const video_store = useContext(VideoStore);

  const handle_upload = async () => {
    const video = video_store.selected_video;
    if (!selected_files || !video) return;
    console.log("handling upload");
    for (let i = 0; i < selected_files.length; i++) {
      const file_to_upload = selected_files[i];
      const data = new FormData();
      data.append("file", file_to_upload);
      data.append("video", video.id.toString());
      await Gallery.upload(data);
    }
    set_selected_files(null);
  };

  const on_file_change = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === undefined) return;
    set_selected_files(e.target.files);
  };

  const handle_generate = async () => {
    console.log("requesting generation...");
    const video = video_store.selected_video;
    if (!video) return;
    await Gallery.from_video(video);
  };

  return (
    <div>
      <h1>Missing Gallery</h1>
      <p>Either upload gallery for thumbnails or generate them.</p>
      <hr />
      {/* Upload */}
      <h3>Upload Thumbnails</h3>
      <p>Associate the videos with the selected tag.</p>
      <div>
        <input type="file" name="thumbnails" accept="image/png, image/gif, image/jpeg" onChange={on_file_change} multiple />
      </div>
      <Button sx={{ marginTop: "10px" }} variant="contained" size="small" onClick={handle_upload}>
        Upload
      </Button>
      <hr />
      {/* Generate */}
      <h3>Generate Thumbnails</h3>
      <p>Should generate thumbnails from video frames (will take some time!)</p>
      <Button sx={{ marginTop: "10px" }} variant="contained" size="small" onClick={handle_generate}>
        Generate
      </Button>
    </div>
  );
};

export default observer(GenerateGallery);
