import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { observer } from "mobx-react-lite";

interface IProps {
  selected_sort_option: string;
  handle_sort_change: (event: any) => void;
}

const SortSelector = (props: IProps) => {
  return (
    <FormControl sx={{ marginLeft: "1em" }}>
      <InputLabel>Sort</InputLabel>
      <Select
        labelId="sort-dropdown"
        id="sort-dropdown"
        label="sort-selector"
        value={props.selected_sort_option}
        onChange={props.handle_sort_change}
      >
        {["Path", "Name", "Rating", "Latest", "Views", "Length", "Size", "Thumb"].map((sort_option) => {
          return (
            <MenuItem key={sort_option} value={sort_option}>
              {sort_option}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default observer(SortSelector);
