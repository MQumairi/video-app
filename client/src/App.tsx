import BrowserPage from "./components/browser/browser_page";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PlayerPage from "./components/player/player_page";
import CssBaseline from "@mui/material/CssBaseline";
import TagsIndexPage from "./components/tags/tags_index/tags_index_page";
import TagsCreatePage from "./components/tags/tags_create/tags_create_page";
import { Box } from "@mui/material";
import TagDetailsPage from "./components/tags/tags_details/tag_details_page";
import NavBar from "./components/nav_bar";
import TagsDeletePage from "./components/tags/tags_delete/tags_delete_page";
import PlaylistsIndexPage from "./components/playlists/playlists_index/playlists_index_page";
import PlaylistCreatePage from "./components/playlists/playlists_create/playlists_create_page";
import PlaylistsDeletePage from "./components/playlists/playlists_delete/playlists_delete_page";
import PlaylistsDetailsPage from "./components/playlists/playlists_details/playlists_details_page";
import { observer } from "mobx-react-lite";
import AdvancedSearchPage from "./components/advanced_search/advanced_search_page";
import TagEditPage from "./components/tags/tags_edit/tag_edit_page";
import SeriesIndexPage from "./components/series/series_index/series_index_page";
import SeriesCreatePage from "./components/series/series_create/series_create_page";
import SeriesDetailsPage from "./components/series/series_details/series_details_page";
import SeriesDeletePage from "./components/series/series_delete/series_delete_page";

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
      <NavBar />
      <BrowserRouter>
        <Routes>
          {/* Main Browser */}
          <Route index element={<BrowserPage />} />
          <Route path="browser/search/:query/directory/:dir_path" element={<BrowserPage />} />
          <Route path="browser/search/:query" element={<BrowserPage />} />
          <Route path="browser/:dir_path" element={<BrowserPage />} />
          <Route path="player/:vid_path" element={<PlayerPage />} />
          {/* Tag System */}
          <Route path="tags" element={<TagsIndexPage />} />
          <Route path="tags/new" element={<TagsCreatePage />} />
          <Route path="tags/:tag_id/video/:vid_path" element={<PlayerPage />} />
          <Route path="tags/:tag_id/delete" element={<TagsDeletePage />} />
          <Route path="tags/:tag_id/edit" element={<TagEditPage />} />
          <Route path="tags/:tag_id" element={<TagDetailsPage />} />
          {/* Playlist System */}
          <Route path="playlists" element={<PlaylistsIndexPage />} />
          <Route path="playlists/new" element={<PlaylistCreatePage />} />
          <Route path="playlists/:playlist_id/video/:vid_path" element={<PlayerPage />} />
          <Route path="playlists/:playlist_id/delete" element={<PlaylistsDeletePage />} />
          <Route path="playlists/:playlist_id" element={<PlaylistsDetailsPage />} />
          {/* Series System */}
          <Route path="series" element={<SeriesIndexPage />} />
          <Route path="series/new" element={<SeriesCreatePage />} />
          <Route path="series/:series_id" element={<SeriesDetailsPage />} />
          <Route path="series/:series_id/delete" element={<SeriesDeletePage />} />
          {/* Advanced Search */}
          <Route path="advanced-search" element={<AdvancedSearchPage />} />
        </Routes>
      </BrowserRouter>
    </Box>
  );
};

export default observer(App);
