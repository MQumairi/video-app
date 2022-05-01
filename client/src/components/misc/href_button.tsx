import Button from "@mui/material/Button";

export const HrefButton = (props: any) => {
  return (
    <Button variant="contained" href={props.href} sx={{ marginTop: "20px" }}>
      {props.textContent}
    </Button>
  );
};
