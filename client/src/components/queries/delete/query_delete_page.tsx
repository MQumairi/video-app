import { observer } from "mobx-react-lite";
import { Button } from "@mui/material";
import { useParams } from "react-router-dom";
import IPersistentQuery from "../../../models/persistent_query";
import { useEffect, useState } from "react";
import { PersistentQueries } from "../../../api/agent";

const QueriesDeletePage = () => {
  let query_id = useParams().query_id ?? 1;
  const [query, set_query] = useState<IPersistentQuery | null>(null);
  const [delete_successful, set_delete_successful] = useState<boolean>(false);

  const fetch_query = async () => {
    const res = await PersistentQueries.details(+query_id);
    if (res.status !== 200) return;
    set_query(res.data);
  };

  const delete_query = async () => {
    console.log("deleting query");
    if (!query) return;
    PersistentQueries.delete(query);
    set_delete_successful(true);
  };

  useEffect(() => {
    fetch_query();
    // eslint-disable-next-line
  }, []);

  if (delete_successful) {
    <div>
      <Button href="/queries" variant="contained" size="large">
        Back
      </Button>
      <h1>Deleted query</h1>
    </div>;
  }

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
      <Button href="/queries" variant="contained" size="medium">
        Back
      </Button>
      <h2>Deleting {query.name}</h2>
      <Button
        onClick={async () => {
          await delete_query();
        }}
        color="error"
        variant="contained"
        size="large"
      >
        DELETE
      </Button>
    </div>
  );
};

export default observer(QueriesDeletePage);
