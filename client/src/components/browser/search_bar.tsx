import { TextField } from "@mui/material";
import { useState } from "react";
import { observer } from "mobx-react-lite";

const SearchBar = () => {
  const [search_query, set_search_query] = useState<string>("");

  const handle_search_change = (event: any) => {
    set_search_query(event.target.value);
  };

  const handle_search_submit = (event: any) => {
    if (event.key === "Enter") {
      window.location.replace(`/browser/search/${search_query}`);
    }
  };

  return (
    <TextField
      InputProps={{ style: { color: "black", background: "white", height: "50px" } }}
      InputLabelProps={{ style: { color: "grey" } }}
      id="outlined-basic"
      label="Search"
      variant="filled"
      color="primary"
      fullWidth={true}
      value={search_query}
      onChange={handle_search_change}
      onKeyDown={handle_search_submit}
    />
  );
};

export default observer(SearchBar);
