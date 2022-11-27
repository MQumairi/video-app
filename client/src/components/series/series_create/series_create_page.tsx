import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Series } from "../../../api/agent";
import FunctionButton from "../../misc/function_button";
import HrefButton from "../../misc/href_button";

const SeriesCreatePage = () => {
  const [series_name, set_series_name] = useState("");
  const handle_change = (input: any) => {
    set_series_name(input.target.value);
  };
  const on_submit = async (input: any) => {
    const response = await Series.post(series_name);
    console.log(response);
    set_series_name("");
  };
  return (
    <div>
      <h1>New Series </h1>
      <HrefButton href="/series" textContent="Back" />
      <form onSubmit={on_submit}>
        <label>
          Name:
          <input type="text" name="name" value={series_name} onChange={handle_change} />
        </label>
        <FunctionButton textContent="Submit" fn={on_submit} />
      </form>
    </div>
  );
};

export default observer(SeriesCreatePage);
