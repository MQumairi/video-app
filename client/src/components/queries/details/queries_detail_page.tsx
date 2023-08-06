import { observer } from "mobx-react-lite";
import { Button, ButtonGroup } from "@mui/material";
import { useParams } from "react-router-dom";
import IPersistentQuery from "../../../models/persistent_query";
import { useEffect, useState } from "react";
import { PersistentQueries } from "../../../api/agent";
import QueriesDetails from "./queries_details";

const QueriesDetailsPage = () => {
  let query_id = useParams().query_id ?? 1;
  const [query, set_query] = useState<IPersistentQuery | null>(null);

  const fetch_query = async () => {
    const res = await PersistentQueries.details(+query_id);
    if (res.status !== 200) return;
    set_query(res.data);
  };

  useEffect(() => {
    fetch_query();
  }, []);

  if (!query) {
    return (
      <div>
        <Button href="/queries" variant="contained" size="large">
          Back
        </Button>
        <h2>Query Not Found</h2>
      </div>
    );
  }

  return (
    <div>
      <ButtonGroup>
        <Button href="/queries" variant="contained" size="medium">
          Back
        </Button>
        <Button href={`/queries/delete/${query.id}`} variant="contained" size="medium">
          Delete
        </Button>
      </ButtonGroup>

      <QueriesDetails query={query} />
    </div>
  );
};

export default observer(QueriesDetailsPage);
