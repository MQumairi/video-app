export const VideoTags = (props: any) => {
  const video_tags = {
    background: "#01141f",
    display: "flex",
    flexWrap: "wrap" as "wrap",
    padding: "15px",
  };
  const tag_pill_style = {
    background: "#064669",
    borderRadius: "10px",
    padding: "5px 10px 5px 10px",
    margin: "10px",
  };
  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Tags</h2>
      <div style={video_tags}>
        {props.tags?.map((tag: any) => {
          return (
            <a href={`/tags/${tag.id}`}>
              <div style={tag_pill_style}>{tag.name}</div>
            </a>
          );
        })}
      </div>
    </div>
  );
};
