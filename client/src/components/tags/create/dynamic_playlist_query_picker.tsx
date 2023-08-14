import IPersistentQuery, { empty_query } from "../../../models/persistent_query";
import QueriesDropdown from "../../queries/util/queries_dropdown";
import { observer } from "mobx-react-lite";
import { Button, FormLabel } from "@mui/material";

interface IProps {
  selected_queries: IPersistentQuery[];
  set_selected_queries: (queries: IPersistentQuery[]) => void;
}

const DynamicPlaylistQueryPicker = (props: IProps) => {
  const add_empty_query = () => {
    console.log("adding an empty query");
    const new_selected_queries = [...props.selected_queries];
    new_selected_queries.push(empty_query());
    props.set_selected_queries(new_selected_queries);
  };
  return (
    <div>
      <FormLabel>Queries for Dynamic Playlist</FormLabel>
      <p>Select the queries that will be used for the dynamic playlist</p>
      {props.selected_queries.map((_, i) => {
        return <QueriesDropdown selected_queries={props.selected_queries} set_selected_queries={props.set_selected_queries} order={i} />;
      })}
      <Button onClick={add_empty_query}>Add</Button>
    </div>
  );
};

export default observer(DynamicPlaylistQueryPicker);
