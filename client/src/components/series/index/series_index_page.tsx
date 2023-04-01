import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Series } from "../../../api/agent";
import ISeries from "../../../models/series";
import HrefButton from "../../misc/href_button";
import TagsList from "./series_list";

const TagsIndexPage = () => {
  const [series, set_series] = useState<ISeries[]>([]);
  const fetch_series = async () => {
    let received_series = (await Series.get()).data;
    set_series(received_series);
  };
  useEffect(() => {
    fetch_series();
  }, []);
  return (
    <div>
      <h1>Series</h1>
      <HrefButton href="/series/new" textContent="Create" />
      <TagsList series_list={series} />
    </div>
  );
};

export default observer(TagsIndexPage);
