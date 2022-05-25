export const PlaylistItem = (props: any) => {
  const card_style = {
    background: "#032a40",
    padding: "15px",
    margin: "20px",
    borderRadius: "10px",
  };
  return (
    <a href={`/playlists/${props.playlist.id}`}>
      <div style={card_style}>
        <h4>{props.playlist.name}</h4>
      </div>
    </a>
  );
};
