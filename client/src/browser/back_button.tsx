import Button from "@mui/material/Button";

export const BackButton = (props: any) => {
  return (
    <Button variant="contained" href={props.href} sx={{ marginTop: "20px" }}>
      Back
    </Button>
  );
};
