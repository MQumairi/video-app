import { observer } from "mobx-react-lite";
import IVideoMeta from "../../models/video_meta";
import TagSearcher from "../tags/util/searcher/tag_searcher";
import { useContext, useEffect, useState } from "react";
import { Button, Checkbox, FormControlLabel } from "@mui/material";
import { Gallery, Tag, Video } from "../../api/agent";
import TagsStore from "../../store/tags_store";

interface IProps {
  video: IVideoMeta;
}

const EditVideoForm = (props: IProps) => {
  const tags_store = useContext(TagsStore);

  const [selected_files, set_selected_files] = useState<FileList | null>(null);
  const [should_generate_thumbs, set_should_generate_thumbs] = useState<boolean>(false);
  const [should_re_process, set_should_re_process] = useState<boolean>(false);

  const form_section_style = {
    marginTop: "30px",
  };

  const on_file_change = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === undefined) return;
    set_selected_files(e.target.files);
  };

  const submit_edit_video_form = async () => {
    const video = props.video;
    // Handle Tags
    await handle_tags(video);
    // Handle Upload
    await handle_upload(video);
    // Handle Generate
    await handle_generate(video);
    // Handle Re-Processing
    await handle_reprocess(video);
  };

  const handle_tags = async (video: IVideoMeta) => {
    if (tags_store.selected_tags.length === 0) return;
    console.log("handling tags");
    await Tag.tag_video(video, tags_store.selected_tags);
  };

  const handle_upload = async (video: IVideoMeta) => {
    if (!selected_files) return;
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

  const handle_generate = async (video: IVideoMeta) => {
    if (!should_generate_thumbs) return;
    console.log("requesting generation...");
    await Gallery.from_video(video);
  };

  const handle_reprocess = async (video: IVideoMeta) => {
    if (!should_re_process) return;
    console.log("requesting reprocessing...");
    await Video.reprocess(video);
  };

  const lookup_video_tags = async () => {
    const res = await Video.tags(props.video);
    if (res.status !== 200) return;
    tags_store.set_selected_tags(res.data);
  };

  useEffect(() => {
    lookup_video_tags();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <div style={form_section_style}>
        {/* Tag */}
        <h3>Tag Video</h3>
        <p style={{ marginBottom: "10px" }}>Associate video with the selected tags</p>
        {props.video.tags && <TagSearcher />}
      </div>
      <div style={form_section_style}>
        {/* Uplaod */}
        <h3>Upload Thumbnails</h3>
        <p>Associate the videos with the selected tag.</p>
        <div>
          <input type="file" name="thumbnails" accept="image/png, image/gif, image/jpeg" onChange={on_file_change} multiple />
        </div>
      </div>
      <div style={form_section_style}>
        {/* Generate */}
        <h3>Generate Thumbnails</h3>
        <p>Should generate thumbnails from video frames (will take some time!)</p>
        <div>
          <FormControlLabel
            control={
              <Checkbox
                style={{ color: "white" }}
                value={should_generate_thumbs}
                onChange={(_, checked) => {
                  set_should_generate_thumbs(checked);
                }}
                aria-label="Generate"
              />
            }
            label="Generate"
          />
        </div>
      </div>
      <div style={form_section_style}>
        {/* Re-process Metadata */}
        <h3>Re-Process Metadata</h3>
        <p>Should re-process the video's Metadata- resolution, duration (will take some time!)</p>
        <div>
          <FormControlLabel
            control={
              <Checkbox
                style={{ color: "white" }}
                value={should_re_process}
                onChange={(_, checked) => {
                  set_should_re_process(checked);
                }}
                aria-label="Re-Process"
              />
            }
            label="Re-Process"
          />
        </div>
      </div>
      <div style={form_section_style}>
        {/* Submit */}
        <Button variant="contained" size="large" onClick={submit_edit_video_form}>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default observer(EditVideoForm);
