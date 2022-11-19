import app from "./app";

const port = process.env.PORT || 5000;

app.listen(port, async () => {
  console.log(process.argv);
  console.log(`listening on: http://localhost:${port}/"`);
});
