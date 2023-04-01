import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { observer } from "mobx-react-lite";
import IVideoMeta from "../../models/video_meta";
import { Video } from "../../api/agent";
import IImageGallery from "../../models/image_gallery";
import GalleryViewer from "../galleries/details/gallery_viewer";
import EditVideoForm from "./edit_video_form";
import DeleteVideoTab from "./delete_video_tab";
import { Button } from "@mui/material";
import ScriptsPanel from "./scripts_panel";
import TagsPanel from "./tags_panel";

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
  video: IVideoMeta;
}

const PlayerTabs = (props: IProps) => {
  const [value, setValue] = React.useState(0);
  const [gallery, setGallery] = React.useState<IImageGallery | undefined>(undefined);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const load_gallery = async () => {
    const res = await Video.gallery(props.video);
    if (res.status !== 200) return;
    const gallery: IImageGallery = res.data;
    setGallery(gallery);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Info" {...tab_props(0)} style={{ color: "white" }} />
          <Tab label="Gallery" {...tab_props(1)} style={{ color: "white" }} onClick={load_gallery} />
          <Tab label="Scripts" {...tab_props(2)} style={{ color: "white" }} />
          <Tab label="Edit" {...tab_props(3)} style={{ color: "white" }} />
          <Tab label="Delete" {...tab_props(4)} style={{ color: "white" }} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <TagsPanel video={props.video} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        {gallery && (
          <div>
            <Button style={{ margin: "10px 0px 10px 0px" }} variant="contained" href={`/galleries/${gallery.id}`} target="_blank">
              Details
            </Button>
            <GalleryViewer gallery={gallery} viewer_height={600} />
          </div>
        )}
      </TabPanel>
      <TabPanel value={value} index={2}>
        <ScriptsPanel video={props.video} />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <EditVideoForm video={props.video} />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <DeleteVideoTab video={props.video} />
      </TabPanel>
    </Box>
  );
};

export default observer(PlayerTabs);
