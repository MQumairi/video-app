import Button from "@mui/material/Button";

export const FunctionButton = (props: any) => {
  const handle_click = async (event: any) => {
    await props.fn();
  };
  return (
    <Button variant="contained" onClick={handle_click} sx={{ marginTop: "20px" }}>
      {props.textContent}
    </Button>
  );
};
