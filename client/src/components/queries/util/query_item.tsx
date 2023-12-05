import { observer } from "mobx-react-lite";
import { useSearchParams } from "react-router-dom";
import IPersistentQuery from "../../../models/persistent_query";

interface IProps {
  query: IPersistentQuery;
}

const QueryItem = (props: IProps) => {
  const [search_params] = useSearchParams({});
  const card_style = {
    background: "#032a40",
    padding: "15px",
    margin: "20px",
    borderRadius: "10px",
  };
  return (
    <a href={`/queries/${props.query.id}?${search_params.toString()}`}>
      <div style={card_style}>
        <h4>{props.query.name}</h4>
      </div>
    </a>
  );
};

export default observer(QueryItem);
