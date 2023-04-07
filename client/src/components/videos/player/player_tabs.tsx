import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { observer } from "mobx-react-lite";
import EditVideoForm from "./edit/edit_video_form";
import DeleteVideoTab from "./delete_video_tab";
import ScriptsPanel from "./scripts/scripts_panel";
import TagsPanel from "./tags/tags_panel";
import GalleryPanel from "./gallery/gallery_panel";
import VideoStore from "../../../store/video_store";
import { useContext, useState } from "react";

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

const PlayerTabs = () => {
  const video_store = useContext(VideoStore);

  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Info" {...tab_props(0)} style={{ color: "white" }} />
          <Tab label="Gallery" {...tab_props(1)} style={{ color: "white" }} />
          <Tab label="Scripts" {...tab_props(2)} style={{ color: "white" }} />
          <Tab label="Edit" {...tab_props(3)} style={{ color: "white" }} />
          <Tab label="Delete" {...tab_props(4)} style={{ color: "white" }} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <TagsPanel />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <GalleryPanel />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <ScriptsPanel />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <EditVideoForm />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <DeleteVideoTab />
      </TabPanel>
    </Box>
  );
};

export default observer(PlayerTabs);
