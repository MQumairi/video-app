import app from "./app";
import { Directory } from "./models/directory";

const port = process.env.PORT || 5000;

app.listen(port, async () => {
  console.log(process.argv);
  console.log(`listening on: http://localhost:${port}/"`);
  const main_dir = new Directory("videos");
  await main_dir.read_contents();
  await main_dir.process_sub_dirs(main_dir.directory_paths);
});
