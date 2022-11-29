import { ButtonGroup } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Series } from "../../../api/agent";
import BrowserEditMode from "../../browser/edit_videos/browser_edit_mode";
import HrefButton from "../../misc/href_button";
import ToggleButton from "../../misc/toggle_button";
import { observer } from "mobx-react-lite";
import PlaylistPopoverButton from "../../popovers/playlist_popover/playlist_popover_button";
import TagPopoverButton from "../../tags/tag_popover/tag_popover_button";
import RemoveVideosPopoverButton from "../../popovers/remove_video_popover/remove_videos_popover_button";
import ISeries from "../../../models/series";
import SeriesVideoList from "./series_video_list";

const SeriesDetailsPage = () => {
  let series_id = useParams().series_id ?? 1;
  const [series, set_series] = useState<ISeries | null>(null);
  const [edit_mode, set_edit_mode] = useState<boolean>(false);
  const [check_all, set_check_all] = useState<boolean>(false);

  const fetch_series = async () => {
    let response: ISeries = (await Series.details(+series_id)).data;
    set_series(response);
  };

  useEffect(() => {
    fetch_series();
  }, []);

  return (
    <div>
      {series && <h1>Series: {series?.name}</h1>}

      <ButtonGroup>
        <ToggleButton toggle={edit_mode} set_toggle={set_edit_mode} trueText="Edit" />
        {edit_mode && <ToggleButton toggle={check_all} set_toggle={set_check_all} falseText="Check All" trueText="Unlock Check" />}
        {edit_mode && <TagPopoverButton />}
        {edit_mode && <PlaylistPopoverButton />}
        {edit_mode && <RemoveVideosPopoverButton />}
        {!edit_mode && <HrefButton href={`/series/${series_id}/delete`} textContent={"Delete"} />}
      </ButtonGroup>

      {!edit_mode && series && <SeriesVideoList videos={series.videos} />}

      {edit_mode && <BrowserEditMode video_paths={series?.videos} check_all={check_all} />}
    </div>
  );
};

export default observer(SeriesDetailsPage);
