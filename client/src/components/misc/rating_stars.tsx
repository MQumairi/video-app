import { Star } from "@mui/icons-material";
import { Rating } from "@mui/material";

interface IProps {
  rating: number | null;
  set_rating: (rating: number | null) => void;
  default_rating?: number;
}

const RatingStars = (props: IProps) => {
  return (
    <Rating
      name="simple-controlled"
      value={props.rating}
      defaultValue={props.default_rating}
      size="large"
      onChange={(_, newValue) => {
        props.set_rating(newValue);
      }}
      emptyIcon={<Star style={{ opacity: 0.8, color: "grey", fontSize: "50px" }} fontSize="inherit" />}
      icon={<Star style={{ opacity: 0.8, color: "#ffcc00", fontSize: "50px" }} fontSize="inherit" />}
      max={10}
    />
  );
};

export default RatingStars;
