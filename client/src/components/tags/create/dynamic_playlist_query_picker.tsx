import { useState } from "react";
import IPersistentQuery from "../../../models/persistent_query";
import QueriesDropdown from "../../queries/util/queries_dropdown";
import { observer } from "mobx-react-lite";
import { Button, FormLabel } from "@mui/material";

interface IProps {
  selected_queries: IPersistentQuery[];
  set_selected_queries: (queries: IPersistentQuery[]) => void;
}

const DynamicPlaylistQueryPicker = (props: IProps) => {
  const [queries_size, set_queries_size] = useState<number>(1);

  const arr = [];
  for (let i = 0; i < queries_size; i++) {
    arr.push(0);
  }

  return (
    <div>
      <FormLabel>Queries for Dynamic Playlist</FormLabel>
      <p>Select the queries that will be used for the dynamic playlist</p>
      {arr.map((v, i) => {
        return <QueriesDropdown selected_queries={props.selected_queries} set_selected_queries={props.set_selected_queries} order={i} />;
      })}
      <Button
        onClick={() => {
          set_queries_size(queries_size + 1);
        }}
      >
        Add
      </Button>
    </div>
  );
};

export default observer(DynamicPlaylistQueryPicker);
