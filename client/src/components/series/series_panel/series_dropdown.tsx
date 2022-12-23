import { MenuItem, Select } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Series } from "../../../api/agent";
import IPlaylist from "../../../models/playlist";
import ISeries from "../../../models/series";

interface IProps {
  set_selected_series_id: (id: number) => void;
  selected_series_id: number;
}

const SeriesDropDown = (props: IProps) => {
  const [series, set_series] = useState<ISeries[]>([]);

  const fetch_playlists = async () => {
    let received_series: ISeries[] = (await Series.get()).data;
    set_series(received_series);
  };

  const handle_change = async (event: any) => {
    props.set_selected_series_id(+event.target.value);
  };

  useEffect(() => {
    fetch_playlists();
  }, []);

  const selector_style = {
    background: "#064669",
    color: "white",
  };

  return (
    <div>
      {series.length > 0 && (
        <Select
          defaultValue={""}
          sx={selector_style}
          labelId="series-dropdown"
          id="series-dropdown"
          label="series"
          value={props.selected_series_id.toString()}
          onChange={handle_change}
        >
          {series.map((s) => {
            return (
              <MenuItem key={s.id} value={s.id}>
                {s.name}
              </MenuItem>
            );
          })}
        </Select>
      )}
    </div>
  );
};

export default observer(SeriesDropDown);
