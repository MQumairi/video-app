import { MenuItem, Select } from "@mui/material";
import { observer } from "mobx-react-lite";

interface IProps {
  label: string;
  rating: number;
  handle_rating_change: (event: any) => void;
}

const RatingSelector = (props: IProps) => {
  return (
    <div>
      <label>
        {props.label}
        <br />
      </label>
      <Select
        sx={{ background: "#064669", color: "white", marginTop: "15px", marginLeft: "10px" }}
        labelId="tag-dropdown"
        id="tag-dropdown"
        label="tags"
        value={props.rating}
        onChange={props.handle_rating_change}
      >
        {[0, 1, 2, 3, 4, 5].map((rating) => {
          return (
            <MenuItem key={rating} value={rating}>
              {rating}
            </MenuItem>
          );
        })}
      </Select>
    </div>
  );
};

export default observer(RatingSelector);
