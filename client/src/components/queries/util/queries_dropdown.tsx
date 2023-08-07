import { MenuItem, Select } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useContext, useEffect } from "react";
import QueriesStore from "../../../store/queries_store";
import IPersistentQuery from "../../../models/persistent_query";

interface IProps {
  order: number;
  selected_queries: IPersistentQuery[];
  set_selected_queries: (queries: IPersistentQuery[]) => void;
}

const QueriesDropdown = (props: IProps) => {
  const queries_store = useContext(QueriesStore);

  const handle_change = async (event: any) => {
    const query_id = event.target.value;
    const selected_query = queries_store.query_from_id(query_id);
    if (!selected_query) return;
    const queries = [...props.selected_queries];
    queries[props.order] = selected_query;
    props.set_selected_queries(queries);
  };

  useEffect(() => {
    queries_store.lookup();
    // eslint-disable-next-line
  }, []);

  const selector_style = {
    background: "#064669",
    color: "white",
  };

  if (queries_store.queries.length === 0) return <div></div>;

  return (
    <div>
      <Select sx={selector_style} labelId="tag-dropdown" id="tag-dropdown" label="tags" value={props.selected_queries[props.order]} onChange={handle_change}>
        {queries_store.queries.map((query) => {
          return (
            <MenuItem key={query.id} value={query.id}>
              {query.name}
            </MenuItem>
          );
        })}
      </Select>
    </div>
  );
};

export default observer(QueriesDropdown);
