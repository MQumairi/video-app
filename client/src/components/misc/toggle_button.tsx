import Button from "@mui/material/Button";

export const ToggleButton = (props: any) => {
  const handle_click = (event: any) => {
    props.set_toggle(!props.toggle);
  };
  return (
    <Button variant="contained" onClick={handle_click} sx={{ marginTop: "20px" }}>
      {props.toggle && props.trueText}
      {!props.toggle && (props.falseText ?? props.trueText)}
    </Button>
  );
};
