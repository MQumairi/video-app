export const TagItem = (props: any) => {
  const card_style = {
    background: "#032a40",
    padding: "15px",
    margin: "20px",
    borderRadius: "10px",
  };
  return (
    <div style={card_style}>
      <h4>{props.tag.name}</h4>
    </div>
  );
};
