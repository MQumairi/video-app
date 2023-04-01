import { Button } from "@mui/material";
import IFileScript from "../../models/file_script";
import StartIcon from "@mui/icons-material/Start";
import PlumbingIcon from "@mui/icons-material/Plumbing";
import { FileScripts } from "../../api/agent";
import IVideoMeta from "../../models/video_meta";
import { observer } from "mobx-react-lite";

interface IProps {
  video: IVideoMeta;
  script: IFileScript;
}

const VideoScriptRow = (props: IProps) => {
  const row_style = {
    backgroundColor: "#001f30",
    padding: "15px",
    marginTop: "10px",
    borderRadius: "10px",
    fontSize: "1.2em",
    color: "white",
    display: "flex",
    gap: "15px",
  };

  const execute_video_script = async () => {
    await FileScripts.execute_video_script(props.script, props.video);
  };

  return (
    <div style={row_style}>
      {props.script.is_start_script && <StartIcon fontSize="large" />}
      {props.script.is_manual_script && <PlumbingIcon fontSize="large" />}
      {props.script.name}
      {props.script.is_manual_script && (
        <Button
          variant="contained"
          style={{ marginRight: "auto" }}
          onClick={async () => {
            await execute_video_script();
          }}
        >
          Execute
        </Button>
      )}
    </div>
  );
};

export default observer(VideoScriptRow);
