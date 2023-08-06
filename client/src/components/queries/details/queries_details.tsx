import { observer } from "mobx-react-lite";
import { Button } from "@mui/material";
import IPersistentQuery from "../../../models/persistent_query";
import TagsList from "../../tags/util/tags_list";

interface IProps {
  query: IPersistentQuery;
}
const QueriesDetails = (props: IProps) => {
  return (
    <div style={{ marginTop: "20px" }}>
      <h1>{props.query.name}</h1>
      {props.query.search_text.length > 0 && <p>Searching for: "{props.query.search_text}"</p>}
      <TagsList tags={props.query.included_tags} />
    </div>
  );
};

export default observer(QueriesDetails);
