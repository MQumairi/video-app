import { ButtonGroup } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Series } from "../../../api/agent";
import ISeries from "../../../models/series";
import Iseries from "../../../models/series";
import FunctionButton from "../../misc/function_button";
import HrefButton from "../../misc/href_button";

const SeriesDeletePage = () => {
  let series_id = useParams().series_id ?? 1;
  const [series, set_series] = useState<Iseries | null>(null);

  const fetch_series = async () => {
    if (!series_id) {
      return;
    }
    let response: ISeries = (await Series.details(+series_id)).data;
    set_series(response);
  };

  const handle_series_delete = async () => {
    console.log("attempting to delete series");
    if (series_id) {
      await Series.delete(+series_id);
    }
  };

  useEffect(() => {
    fetch_series();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <h1>Are you sure you want to delete the "{series?.name}" series?</h1>
      <ButtonGroup>
        <HrefButton href={"/series"} textContent="Back" />
        <FunctionButton fn={handle_series_delete} textContent="Delete" />
      </ButtonGroup>
    </div>
  );
};

export default observer(SeriesDeletePage);
