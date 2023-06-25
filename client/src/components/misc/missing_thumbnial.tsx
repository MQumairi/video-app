import { observer } from "mobx-react-lite";

const MissingThumbnail = () => (
  <div
    style={{
      objectFit: "cover",
      height: "230px",
      backgroundColor: "black",
      fontSize: "20px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    No Thumbnail
  </div>
);

export default observer(MissingThumbnail);
