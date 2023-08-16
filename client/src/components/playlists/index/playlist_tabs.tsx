import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { observer } from "mobx-react-lite";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import QueriesIndexPage from "../../queries/index/queries_index_page";
import PlaylistList from "./playlist_list";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const tab_props = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

const PlaylistTabs = () => {
  const [value, setValue] = useState(0);
  const [search_params, set_search_params] = useSearchParams({});

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    const new_search_params = search_params;
    new_search_params.set("tags_index_tab", newValue.toString());
    set_search_params(new_search_params);
  };

  useEffect(() => {
    const tab_value = search_params.get("tags_index_tab");
    if (!tab_value) return;
    setValue(+tab_value);
    // eslint-disable-next-line
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Playlists" {...tab_props(0)} style={{ color: "white" }} />
          <Tab label="Queries" {...tab_props(1)} style={{ color: "white" }} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <PlaylistList />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <QueriesIndexPage />
      </TabPanel>
    </Box>
  );
};

export default observer(PlaylistTabs);
