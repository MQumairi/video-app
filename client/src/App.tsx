import DirectoryPanel from "./browser/directory_panel";

const App = () => {
  return (
    <div>
      <h1>Video App</h1>
      <DirectoryPanel dir_path="data" />
    </div>
  );
};

export default App;
