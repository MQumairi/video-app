import Button from "@mui/material/Button";
import { observer } from "mobx-react-lite";

const SubmitButton = () => {
  return (
    <Button type="submit" variant="contained">
      Submit
    </Button>
  );
};

export default observer(SubmitButton);
