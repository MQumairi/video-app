import { observer } from "mobx-react-lite";
import IVideoMeta from "../../models/video_meta";
import TagSearcher from "../tags/tag_popover/tag_searcher";
import { useState } from "react";
import { Button, Checkbox, FormControlLabel } from "@mui/material";
import PlaylistsDropdown from "../popovers/playlist_popover/playlists_dropdown";
import IPlaylist from "../../models/playlist";
import { Gallery, Playlist, Tag, Video } from "../../api/agent";
import ITag from "../../models/tag";

interface IProps {
  video: IVideoMeta;
}

const EditVideoForm = (props: IProps) => {
  const [selected_tags, set_selected_tags] = useState<ITag[]>([]);
  const [selected_playlist, set_selected_playlist] = useState<IPlaylist>({ id: 0, name: "select", videos: [] });
  const [selected_files, set_selected_files] = useState<FileList | null>(null);
  const [should_generate_thumbs, set_should_generate_thumbs] = useState<boolean>(false);
  const [should_re_process, set_should_re_process] = useState<boolean>(false);

  const form_section_style = {
    marginTop: "30px",
  };

  const on_file_change = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files == undefined) return;
    set_selected_files(e.target.files);
  };

  const on_thumb_generate_check = () => {
    set_should_generate_thumbs(!should_generate_thumbs);
  };

  const on_re_process_check = () => {
    set_should_re_process(!should_re_process);
  };

  const submit_edit_video_form = async () => {
    const video = props.video;
    // Handle Tags
    await handle_tags(video);
    // Handle Playlist
    await handle_playlists(video);
    // Handle Upload
    await handle_upload(video);
    // Handle Generate
    await handle_generate(video);
    set_should_generate_thumbs(false);
    // Handle Re-Processing
    await handle_reprocess(video);
    set_should_re_process(false);
  };

  const handle_tags = async (video: IVideoMeta) => {
    if (selected_tags.length == 0) return;
    console.log("handling tags");
    const videos: IVideoMeta[] = [video];
    console.log("videos:", videos);
    console.log("tags:", selected_tags);
    await Tag.tag_videos(videos, selected_tags);
  };

  const handle_playlists = async (video: IVideoMeta) => {
    if (selected_playlist.id == 0) return;
    console.log("handling playlists");
    await Playlist.add_video(video, [selected_playlist]);
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

  return (
    <div>
      <div style={form_section_style}>
        {/* Tag */}
        <h3>Tag Video</h3>
        <p>Associate video with the selected tags</p>
        {props.video.tags && <TagSearcher selected_tags={selected_tags} set_selected_tags={set_selected_tags} />}
      </div>
      <div style={form_section_style}>
        {/* Playlists */}
        <h3>Add to Playlist</h3>
        <p>Associate video with the selected playlist</p>
        <PlaylistsDropdown selected_playlist={selected_playlist} set_selected_playlist={set_selected_playlist} />
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
            control={<Checkbox style={{ color: "white" }} value={should_generate_thumbs} onChange={on_thumb_generate_check} aria-label="Generate" />}
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
            control={<Checkbox style={{ color: "white" }} value={should_re_process} onChange={on_re_process_check} aria-label="Re-Process" />}
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
