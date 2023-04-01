import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { observer } from "mobx-react-lite";
import TagVideosTab from "./tag_videos_tab";
import ITag from "../../../models/tag";
import TagImagesTab from "./tag_images_tab";
import IImageGallery from "../../../models/image_gallery";

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

interface IProps {
  tag: ITag;
  pages_total: number;
  current_page: number;
  handle_page_change: (page: number) => void;
}

const TagDetailsTabs = (props: IProps) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Videos" {...tab_props(0)} style={{ color: "white" }} />
          <Tab label="Images" {...tab_props(1)} style={{ color: "white" }} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <TagVideosTab tag={props.tag} pages_total={props.pages_total} current_page={props.current_page} handle_page_change={props.handle_page_change} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <TagImagesTab tag={props.tag} />
      </TabPanel>
    </Box>
  );
};

export default observer(TagDetailsTabs);
