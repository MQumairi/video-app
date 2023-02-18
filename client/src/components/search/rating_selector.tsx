import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { observer } from "mobx-react-lite";

interface IProps {
  label: string;
  rating: number;
  handle_rating_change: (event: any) => void;
}

const RatingSelector = (props: IProps) => {
  return (
    <FormControl sx={{ marginLeft: "1em" }}>
      <InputLabel>{props.label}</InputLabel>
      <Select labelId="tag-dropdown" id="tag-dropdown" label="tags" value={props.rating} onChange={props.handle_rating_change}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => {
          return (
            <MenuItem key={rating} value={rating}>
              {rating}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default observer(RatingSelector);
