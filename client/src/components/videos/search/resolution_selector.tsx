import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { observer } from "mobx-react-lite";
import { resolution_from_height } from "../../../lib/video_file_meta_calculator";

interface IProps {
  label: string;
  resolution: number;
  handle_resolution_change: (event: any) => void;
}

const ResolutionSelector = (props: IProps) => {
  return (
    <FormControl sx={{ marginLeft: "1em" }}>
      <InputLabel>{props.label}</InputLabel>
      <Select
        labelId="resolution-dropdown"
        id="resolution-dropdown"
        label="resolution-selector"
        value={props.resolution}
        onChange={props.handle_resolution_change}
      >
        {[0, 720, 1080, 1440, 2160].map((height) => {
          return (
            <MenuItem key={height} value={height}>
              {resolution_from_height(height)}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default observer(ResolutionSelector);
