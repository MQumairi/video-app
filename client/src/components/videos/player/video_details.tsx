import { useContext } from "react";
import { Button, ButtonGroup, Chip, FormGroup, FormLabel, Stack } from "@mui/material";
import { calculate_resolution } from "../../../lib/video_file_meta_calculator";
import VideoPlayer from "./video_player";
import PlayerTabs from "./player_tabs";
import RatingStars from "../../misc/rating_stars";
import VideoStore from "../../../store/video_store";
import { observer } from "mobx-react-lite";
import { Video } from "../../../api/agent";

interface IProps {
  random_url?: string;
  back_url?: string;
}

const VideoDetails = (props: IProps) => {
  const video_store = useContext(VideoStore);

  const video = video_store.selected_video;

  const handle_rating_change = async (rating: number | null) => {
    console.log("entered handle_rating_change");
    const new_rating = rating || 0;
    if (!video) return;
    console.log(`new_rating=${new_rating}, video=${video.name}`);
    video_store.set_selected_video_rating(new_rating);
    const res = await Video.rate(video, new_rating);
    if (res.status !== 200) return;
  };

  if (!video)
    return (
      <div>
        <h2>Video</h2>
      </div>
    );

  return (
    <div>
      <h1>{video.name}</h1>
      <div>
        <Stack direction="row" spacing={1}>
          {video.id && <Chip label={video.id} color="primary" variant="outlined" />}
          {video.width !== null && <Chip label={calculate_resolution(video)} color="primary" variant="outlined" />}
          {video.views !== null && <Chip label={`${video.views} views`} color="primary" variant="outlined" />}
        </Stack>
      </div>
      <ButtonGroup sx={{ margin: "10px 0px 10px 0px" }} variant="contained">
        {props.back_url && <Button href={props.back_url}>Back</Button>}
        {props.random_url && <Button href={props.random_url}>Random</Button>}
      </ButtonGroup>
      <VideoPlayer vid_path={video.path} />
      <FormGroup sx={{ marginTop: "30px" }}>
        <RatingStars default_rating={video.rating} rating={video_store.selected_video_rating} set_rating={handle_rating_change} />
      </FormGroup>
      <PlayerTabs />
    </div>
  );
};

export default observer(VideoDetails);
