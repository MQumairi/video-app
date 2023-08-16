import { observer } from "mobx-react-lite";
import IVideoMeta from "../../../../models/video_meta";
import TagSelector from "../../../tags/util/selector/tag_selector";
import { useContext, useEffect, useState } from "react";
import { Button, Checkbox, FormControlLabel, TextField } from "@mui/material";
import { Gallery, Tag, Video } from "../../../../api/agent";
import TagsStore, { TagSelectorType } from "../../../../store/tags_store";
import VideoStore from "../../../../store/video_store";

const EditVideoForm = () => {
  const tags_store = useContext(TagsStore);
  const video_store = useContext(VideoStore);

  const [selected_files, set_selected_files] = useState<FileList | null>(null);
  const [should_generate_thumbs, set_should_generate_thumbs] = useState<boolean>(false);
  const [should_re_process, set_should_re_process] = useState<boolean>(false);

  const [gallery_id_to_associate, set_galllery_id_to_associate] = useState<string>("");

  const form_section_style = {
    marginTop: "30px",
  };

  const on_file_change = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === undefined) return;
    set_selected_files(e.target.files);
  };

  const on_gallery_id_change = (e: any) => {
    const inputed_id = e.target.value;
    if (isNaN(+inputed_id)) return;
    set_galllery_id_to_associate(inputed_id);
  };

  const submit_edit_video_form = async () => {
    const video = video_store.selected_video;
    if (!video) return;
    // Handle Tags
    await handle_tags(video);
    // Handle Upload
    await handle_upload(video);
    // Handle Generate
    await handle_generate(video);
    // Handle Gallery Pair
    await handle_gallery_pair(video);
    // Handle Re-Processing
    await handle_reprocess(video);
  };

  const handle_tags = async (video: IVideoMeta) => {
    if (tags_store.included_tags.length === 0) return;
    console.log("handling tags");
    await Tag.tag_video(video, tags_store.included_tags);
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

  const handle_gallery_pair = async (video: IVideoMeta) => {
    if (!video || isNaN(+gallery_id_to_associate) || !gallery_id_to_associate) return;
    await Gallery.pair(video, +gallery_id_to_associate);
  };

  const handle_reprocess = async (video: IVideoMeta) => {
    if (!should_re_process) return;
    console.log("requesting reprocessing...");
    await Video.reprocess(video);
  };

  const lookup_video_tags = async () => {
    await video_store.lookup_selected_video_tags();
    tags_store.set_selected_tags(video_store.selected_video_tags);
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
        <TagSelector selector_type={TagSelectorType.IncludedTags} />
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
        {/* Pair Gallery*/}
        <h3>Pair Gallery</h3>
        <p>Associate an already existing gallery (by id) to this video.</p>
        <div>
          <TextField
            type="number"
            value={gallery_id_to_associate}
            onChange={(n) => {
              on_gallery_id_change(n);
            }}
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
