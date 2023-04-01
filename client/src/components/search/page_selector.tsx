import { Pagination } from "@mui/material";
import { observer } from "mobx-react-lite";

interface IProps {
  pages: number;
  current_page: number;
  set_current_page: (page: number) => void;
}

const PageSelector = (props: IProps) => {
  const style = {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
    marginBottom: "20px",
  };
  return (
    <div style={style}>
      <Pagination
        page={props.current_page}
        onChange={(_, page) => {
          props.set_current_page(page);
        }}
        sx={{ button: { color: "#ffffff" } }}
        count={props.pages}
        shape="rounded"
        color="primary"
      />
    </div>
  );
};

export default observer(PageSelector);
