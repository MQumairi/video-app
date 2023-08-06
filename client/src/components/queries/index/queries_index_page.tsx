import { observer } from "mobx-react-lite";
import { Button } from "@mui/material";
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

  return (
    <div>
      <Button href="/queries/new" variant="contained" size="large">
        Create
      </Button>
      <QueriesList queries={queries} />
    </div>
  );
};

export default observer(QueriesIndexPage);
