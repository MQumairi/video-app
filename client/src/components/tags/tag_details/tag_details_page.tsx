import { useParams } from "react-router-dom";

export const TagDetailsPage = () => {
  let vid_path = useParams().tag_id ?? 1;

  return (
    <div>
      <h1>Tag Details</h1>
    </div>
  );
};
