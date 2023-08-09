import { observer } from "mobx-react-lite";
import { Button } from "@mui/material";
import { useParams } from "react-router-dom";
import QueriesEditForm from "./queries_edit_form";

const QueriesEditPage = () => {
  let query_id = useParams().query_id;

  if (!query_id) {
    return (
      <div>
        <Button href="/queries" variant="contained" size="large">
          Back
        </Button>
        <h3>Query not found</h3>
      </div>
    );
  }

  return (
    <div>
      <Button href={`/queries/${query_id}`} variant="contained" size="large">
        Back
      </Button>
      <QueriesEditForm query_id={query_id} />
    </div>
  );
};

export default observer(QueriesEditPage);
