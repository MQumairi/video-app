import { Box } from "@mui/material";
import { observer } from "mobx-react-lite";
import IPersistentQuery from "../../../models/persistent_query";
import DynamicPlaylistQueryItem from "./dynamic_playlisy_query_item";

interface IProps {
  queries: IPersistentQuery[];
  tag_id: number;
}

const QueriesList = (props: IProps) => {
  const box_style = {
    background: "#01141f",
    display: "flex",
    flexWrap: "wrap",
    padding: "15px",
    marginTop: "20px",
  };
  return (
    <Box component="div" sx={box_style}>
      {props.queries.map((query: IPersistentQuery, i) => {
        return <DynamicPlaylistQueryItem key={query.id} query={query} order={i + 1} tag_id={props.tag_id} />;
      })}
    </Box>
  );
};

export default observer(QueriesList);
