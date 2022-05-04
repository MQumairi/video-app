import BrowserPage from "./components/browser/browser_page";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PlayerPage } from "./components/player/player_page";
import CssBaseline from "@mui/material/CssBaseline";
import { TagsIndexPage } from "./components/tags/tags_index/tags_index_page";
import { TagsCreatePage } from "./components/tags/tags_create/tags_create_page";
import { Box } from "@mui/material";
import { TagDetailsPage } from "./components/tags/tag_details/tag_details_page";
import { TagVideoPage } from "./components/tags/tag_video/tag_video_page";
import { DirectorySearchResults } from "./components/search/directory_search_results";

const App = () => {
  const box_style = {
    backgroundColor: "#000f17",
    width: "80%",
    margin: "auto",
    marginTop: "50px",
    borderRadius: "10px",
    padding: "25px",
  };

  return (
    <Box component="div" sx={box_style}>
      <CssBaseline />
      <a href="/">Browser</a>
      <a href="/tags">Tags</a>
      <BrowserRouter>
        <Routes>
          {/* Main Browser */}
          <Route index element={<BrowserPage />} />
          <Route path="browser/search/:query" element={<DirectorySearchResults />} />
          <Route path="browser/:dir_path" element={<BrowserPage />} />
          <Route path="player/:vid_path" element={<PlayerPage />} />
          {/* Tag System */}
          <Route path="tags" element={<TagsIndexPage />} />
          <Route path="tags/new" element={<TagsCreatePage />} />
          <Route path="tags/:id/video/:vid_path" element={<TagVideoPage />} />
          <Route path="tags/:id" element={<TagDetailsPage />} />
        </Routes>
      </BrowserRouter>
    </Box>
  );
};

export default App;
