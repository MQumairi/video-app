import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import IVideoScript from "../../../models/video_script";
import { Scripts } from "../../../api/agent";
import Table from "@mui/material/Table";
import { TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import ScriptsListRow from "./scripts_list_row";

const ScriptsPage = () => {
  const [scripts, set_scripts] = useState<IVideoScript[]>([]);

  useEffect(() => {
    const fetch_scripts = async () => {
      const received_scripts: IVideoScript[] = (await Scripts.get()).data;
      set_scripts(received_scripts);
    };
    fetch_scripts();
  }, []);
  return (
    <div>
      <h1>Scripts</h1>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell style={{ color: "white" }}>Name</TableCell>
            <TableCell style={{ color: "white" }}>Command</TableCell>
            <TableCell style={{ color: "white" }}>Auto Start</TableCell>
            <TableCell style={{ color: "white" }}></TableCell>
            <TableCell style={{ color: "white" }}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {scripts.map((script) => {
            return <ScriptsListRow script={script} />;
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default observer(ScriptsPage);
