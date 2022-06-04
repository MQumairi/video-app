import Button from "@mui/material/Button";
import { observer } from "mobx-react-lite";

const HrefButton = (props: any) => {
  return (
    <Button variant="contained" href={props.href} sx={{ marginTop: "20px" }}>
      {props.textContent}
    </Button>
  );
};

export default observer(HrefButton);
