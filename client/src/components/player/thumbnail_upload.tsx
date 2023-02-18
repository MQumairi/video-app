import { observer } from "mobx-react-lite";
import { useContext, useState } from "react";
import SelectedVideosStore from "../../store/selected_videos_store";
import ToggleButton from "../misc/toggle_button";
import FunctionButton from "../misc/function_button";
import { Thumbnails } from "../../api/agent";
import IVideoMeta from "../../models/video_meta";

interface IProps {
  running_video: IVideoMeta;
}

const ThumbnailUpload = (props: IProps) => {
  const style = {
    background: "#022a40",
    width: "500px",
    height: "min-content",
    padding: "20px",
    margin: "auto",
  };

  const [selected_files, set_selected_files] = useState<FileList | null>(null);

  const selectedVideoStore = useContext(SelectedVideosStore);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files == undefined) return;
    set_selected_files(e.target.files);
  };

  const send_video = async () => {
    if (!selected_files) return;
    console.log("sending video");
    for (let i = 0; i < selected_files.length; i++) {
      const file_to_upload = selected_files[i];
      console.log("uplaoding...", file_to_upload);
      const data = new FormData();
      data.append("file", file_to_upload);
      data.append("video", props.running_video.id.toString());
      await Thumbnails.upload(data);
    }
  };

  return (
    <div style={style}>
      <h2>Upload Thumnail</h2>
      <p>Associate the videos with the selected tag.</p>
      <div>
        <input type="file" name="thumbnails" onChange={onFileChange} multiple />
      </div>
      <ToggleButton toggle={selectedVideoStore.edit_video_toggle} set_toggle={selectedVideoStore.toggle_edit_video} trueText="Cancel" />
      <FunctionButton fn={send_video} textContent="Submit" />
    </div>
  );
};

export default observer(ThumbnailUpload);
