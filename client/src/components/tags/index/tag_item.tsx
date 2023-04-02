import { observer } from "mobx-react-lite";
import { useSearchParams } from "react-router-dom";

const TagItem = (props: any) => {
  const [search_params] = useSearchParams({});
  const card_style = {
    background: "#032a40",
    padding: "15px",
    margin: "20px",
    borderRadius: "10px",
  };
  return (
    <a href={`/tags/${props.tag.id}?${search_params.toString()}`}>
      <div style={card_style}>
        <h4>{props.tag.name}</h4>
      </div>
    </a>
  );
};

export default observer(TagItem);
