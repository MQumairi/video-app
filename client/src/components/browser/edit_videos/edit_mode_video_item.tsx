import VideoFileIcon from "@mui/icons-material/VideoFile";

export const EditModeVideoItem = (props: any) => {
  const card_style = {
    margin: "30px",
    width: "100px",
    height: "auto",
    overflow: "hidden",
  };
  const icon_style = {
    width: "100px",
    height: "auto",
    textAlign: "center",
  };
  return (
    <div
      style={card_style}
      onClick={() => {
        props.fetch_directory(props.dir);
      }}
    >
      <VideoFileIcon sx={icon_style} />
      <h4 style={{ textAlign: "center" }}>Edit {props.vid.name}</h4>
    </div>
  );
};
