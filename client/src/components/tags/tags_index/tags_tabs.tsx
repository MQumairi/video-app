import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { observer } from "mobx-react-lite";
import AllTags from "./all_tags";
import CharacterTags from "./character_tags";
import StudioTags from "./studio_tags";
import OtherTags from "./other_tags";

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

const TagsTabs = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Characters" {...tab_props(0)} style={{ color: "white" }} />
          <Tab label="Studios" {...tab_props(1)} style={{ color: "white" }} />
          <Tab label="Other" {...tab_props(2)} style={{ color: "white" }} />
          <Tab label="All" {...tab_props(3)} style={{ color: "white" }} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <CharacterTags />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <StudioTags />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <OtherTags />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <AllTags />
      </TabPanel>
    </Box>
  );
};

export default observer(TagsTabs);
