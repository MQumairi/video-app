import { observer } from "mobx-react-lite";
import { Button, ButtonGroup } from "@mui/material";
import QueriesList from "../util/queries_list";
import { useEffect, useState } from "react";
import IPersistentQuery from "../../../models/persistent_query";
import { PersistentQueries } from "../../../api/agent";

const QueriesIndexPage = () => {
  const [queries, set_queries] = useState<IPersistentQuery[]>([]);
  const fetch_queries = async () => {
    const res = await PersistentQueries.list();
    if (res.status !== 200) return;
    set_queries(res.data);
  };

  useEffect(() => {
    fetch_queries();
    // eslint-disable-next-line
  }, []);

  const templates = queries.filter((q) => q.is_template);
  const regular_queries = queries.filter((q) => !q.is_template);

  return (
    <div>
      <ButtonGroup variant="contained" size="large">
        <Button href="/queries/new">Create</Button>
        <Button href="/queries/new?template=true">Create Template</Button>
      </ButtonGroup>
      <h2 style={{ marginTop: "20px" }}>Queries</h2>
      <QueriesList queries={regular_queries} />
      <h2 style={{ marginTop: "20px" }}>Templates</h2>
      <p>Templates hold configuration shared by other queries. They can be previewed, but can't be added to playlists.</p>
      <QueriesList queries={templates} />
    </div>
  );
};

export default observer(QueriesIndexPage);
