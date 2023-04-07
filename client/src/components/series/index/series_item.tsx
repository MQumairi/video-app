import { observer } from "mobx-react-lite";
import ISeries from "../../../models/series";

interface IProps {
  series: ISeries
}

const SeriesItem = (props: IProps) => {
  const card_style = {
    background: "#032a40",
    padding: "15px",
    margin: "20px",
    borderRadius: "10px",
  };
  return (
    <a href={`/series/${props.series.id}`}>
      <div style={card_style}>
        <h4>{props.series.name}</h4>
      </div>
    </a>
  );
};

export default observer(SeriesItem);
