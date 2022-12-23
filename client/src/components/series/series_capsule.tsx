import { Chip } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Series } from "../../api/agent";
import ISeries from "../../models/series";
import SelectedVideosStore from "../../store/selected_videos_store";
import { PathConverter } from "../../util/path_converter";

interface IProps {
  series: ISeries;
}

const SeriesCapsule = (props: IProps) => {
  const selectedVideoStore = useContext(SelectedVideosStore);
  const [chip_display, set_chip_display] = useState<string>("");
  const [series_prefix, set_series_prefix] = useState<string>("");

  const series_id = useParams().series_id;
  const playlist_id = useParams().playlist_id;
  const tag_id = useParams().tag_id;

  const handle_delete = async (event: any) => {
    const video = selectedVideoStore.running_video;
    const updated_series: ISeries = {
      id: props.series.id,
      name: props.series.name,
      videos: [],
    };
    if (!video) return;
    updated_series.videos = [video];
    await Series.remove_video(updated_series);
    set_chip_display("none");
  };

  const style = {
    padding: "5px",
  };

  useEffect(() => {
    //Logic goes here
    if (series_id) {
      set_series_prefix(`/series`);
    } else if (playlist_id) {
      set_series_prefix(`/playlists/${playlist_id}/video`);
    } else if (tag_id) {
      set_series_prefix(`/tags/${tag_id}/video`);
    } else {
      set_series_prefix("/player");
    }
  }, []);

  return (
    <div>
      <Chip
        sx={{ color: "white", fontSize: "16px", background: "#064669", margin: "5px", display: chip_display }}
        label={<a href={`/series/${props.series.id}`}>{props.series.name}</a>}
        onDelete={handle_delete}
      />
      {props.series.videos.map((vid) => {
        return (
          <a href={`${series_prefix}/${PathConverter.to_query(vid.path)}`} key={vid.id}>
            <div style={style}>{vid.name}</div>
          </a>
        );
      })}
    </div>
  );
};

export default observer(SeriesCapsule);
