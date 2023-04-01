import { Box } from "@mui/material";
import { observer } from "mobx-react-lite";
import ISeries from "../../../models/series";
import SeriesItem from "./series_item";

interface IProps {
  series_list: ISeries[]
}

const TagsList = (props: IProps) => {
  const box_style = {
    background: "#01141f",
    display: "flex",
    flexWrap: "wrap",
    padding: "15px",
    marginTop: "20px",
  };
  
  return (
    <Box component="div" sx={box_style}>
      {props.series_list?.map((series) => {
        return <SeriesItem key={series.name} series={series} />;
      })}
    </Box>
  );
};

export default observer(TagsList);
