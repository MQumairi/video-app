import FunctionButton from "../../misc/function_button";
import { useContext, useEffect, useState } from "react";
import { Series, Video } from "../../../api/agent";
import SelectedVideosStore from "../../../store/selected_videos_store";
import { observer } from "mobx-react-lite";
import ISeries from "../../../models/series";
import SeriesDropdown from "./series_dropdown";
import IVideoMeta from "../../../models/video_meta";

interface IProps {
  running_video?: IVideoMeta;
}

const SeriesPanel = (props: IProps) => {
  const [selected_series_id, set_selected_series_id] = useState<number>(0);
  const [running_video_series_order, set_running_video_series_order] = useState<number>(1);
  const selectedVideoStore = useContext(SelectedVideosStore);

  const style = {
    background: "#022a40",
    width: "500px",
    height: "min-content",
    padding: "20px",
    margin: "auto",
  };

  const send_video = async () => {
    const videos = Array.from(selectedVideoStore.selected_videos.values());
    console.log("sending videos to series:", videos);
    const updated_series: ISeries = {
      id: selected_series_id,
      name: "",
      videos: videos,
    };
    console.log("putting series:", updated_series);
    await Series.add_video(updated_series);
    // If series order was changed we also want to update that
    if (!props.running_video) return;
    const updated_video = props.running_video;
    updated_video.series_order = running_video_series_order;
    await Video.edit(updated_video);
  };

  const handle_change = (input: any) => {
    set_running_video_series_order(input.target.value);
  };

  useEffect(() => {
    if (props.running_video && props.running_video.series) {
      set_selected_series_id(props.running_video.series.id);
      set_running_video_series_order(props.running_video.series_order);
    }
  }, []);

  return (
    <div style={style}>
      <h2>Add to Series</h2>
      <SeriesDropdown selected_series_id={selected_series_id} set_selected_series_id={set_selected_series_id} />
      <p>Associate the videos with the selected series.</p>
      {props.running_video && (
        <div>
          <input type="text" name="name" value={running_video_series_order} onChange={handle_change} />
        </div>
      )}
      <FunctionButton fn={send_video} textContent="Submit" />
    </div>
  );
};

export default observer(SeriesPanel);
