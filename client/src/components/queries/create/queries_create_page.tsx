import { observer } from "mobx-react-lite";
import { Button } from "@mui/material";
import QueriesCreateForm from "./queries_create_form";

const QueriesCreatePage = () => {
  return (
    <div>
      <Button href="/playlists?tags_index_tab=1" variant="contained" size="large">
        Back
      </Button>
      <QueriesCreateForm />
    </div>
  );
};

export default observer(QueriesCreatePage);
