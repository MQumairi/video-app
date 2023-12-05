import { Box } from "@mui/material";
import { observer } from "mobx-react-lite";
import QueryItem from "./query_item";
import IPersistentQuery from "../../../models/persistent_query";

interface IProps {
  queries: IPersistentQuery[];
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
      {props.queries.map((query: any) => {
        return <QueryItem key={query.name} query={query} />;
      })}
    </Box>
  );
};

export default observer(QueriesList);
