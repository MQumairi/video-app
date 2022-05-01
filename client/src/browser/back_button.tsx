import Button from "@mui/material/Button";

export const BackButton = (props: any) => {
  return (
    <Button
      variant="contained"
      onClick={async () => {
        await props.on_click();
      }}
      sx={{ marginTop: "20px" }}
    >
      Back
    </Button>
  );
};
