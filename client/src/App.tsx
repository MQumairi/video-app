import BrowserPage from "./components/browser/browser_page";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PlayerPage } from "./components/player/player_page";
import CssBaseline from "@mui/material/CssBaseline";
import { TagsIndexPage } from "./components/tags/tags_index/tags_index_page";
import { TagsCreatePage } from "./components/tags/tags_create/tags_create_page";

const App = () => {
  return (
    <div>
      <CssBaseline />
      <a href="/">Browser</a>
      <a href="/tags">Tags</a>
      <BrowserRouter>
        <Routes>
          <Route index element={<BrowserPage />} />
          <Route path="browser/:dir_path" element={<BrowserPage />} />
          <Route path="player/:vid_path" element={<PlayerPage />} />
          <Route path="tags" element={<TagsIndexPage />} />
          <Route path="tags/new" element={<TagsCreatePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
