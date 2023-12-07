import BrowserPage from "./components/browser/browser_page";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PlayerPage from "./components/videos/player/player_page";
import CssBaseline from "@mui/material/CssBaseline";
import TagsIndexPage from "./components/tags/index/tags_index_page";
import TagsCreatePage from "./components/tags/create/tags_create_page";
import { Box } from "@mui/material";
import TagDetailsPage from "./components/tags/details/tag_details_page";
import NavBar from "./components/misc/nav_bar";
import TagsDeletePage from "./components/tags/delete/tags_delete_page";
import { observer } from "mobx-react-lite";
import SearchPage from "./components/videos/search/search_page";
import TagEditPage from "./components/tags/edit/tag_edit_page";
import SeriesIndexPage from "./components/series/index/series_index_page";
import SeriesCreatePage from "./components/series/create/series_create_page";
import SeriesDetailsPage from "./components/series/details/series_details_page";
import SeriesDeletePage from "./components/series/delete/series_delete_page";
import CleanupPage from "./components/cleanup/cleanup_page";
import GalleryIndexPage from "./components/galleries/index/gallery_index_page";
import GalleryDetailsPage from "./components/galleries/details/gallery_details_page";
import GalleryEditPage from "./components/galleries/edit/gallery_edit_page";
import FileScriptsIndex from "./components/file_scripts/index/file_scripts_index";
import FileScriptDetails from "./components/file_scripts/details/file_script_details";
import FileScriptEdit from "./components/file_scripts/edit/file_script_edit";
import ImageDeletePage from "./components/galleries/image_delete/image_delete_page";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import HomePage from "./components/videos/index/home_page";
import EditResultsPage from "./components/videos/search/edit_results/edit_results_page";
import QueriesIndexPage from "./components/queries/index/queries_index_page";
import QueriesCreatePage from "./components/queries/create/queries_create_page";
import QueriesDetailPage from "./components/queries/details/queries_detail_page";
import QueryDeletePage from "./components/queries/delete/query_delete_page";
import PlaylistPlayer from "./components/playlists/player/playlist_player";
import QueriesEditPage from "./components/queries/edit/queries_edit_page";
import PlaylistIndex from "./components/playlists/index/playlist_index";
import PlaylistDetailsPage from "./components/playlists/details/playlist_details_page";
import PlaylistCreatePage from "./components/playlists/create/playlist_create_page";
import PlaylistEditPage from "./components/playlists/edit/playlist_edit_page";
import DeletePage from "./components/playlists/delete/delete_page";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const App = () => {
  const box_style = {
    backgroundColor: "#000f17",
    width: "90%",
    margin: "auto",
    marginTop: "50px",
    borderRadius: "10px",
    padding: "25px",
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box component="div" sx={box_style}>
        <CssBaseline />
        <NavBar />
        <BrowserRouter>
          <Routes>
            {/* Video System */}
            <Route index element={<HomePage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="search-results-edit" element={<EditResultsPage />} />
            <Route path="player/:vid_id" element={<PlayerPage />} />
            {/* Browser System */}
            <Route path="browser" element={<BrowserPage />} />
            <Route path="browser/search/:query/directory/:dir_path" element={<BrowserPage />} />
            <Route path="browser/search/:query" element={<BrowserPage />} />
            <Route path="browser/:dir_path" element={<BrowserPage />} />
            <Route path="browser/player/:vid_path" element={<PlayerPage />} />
            {/* Tag System */}
            <Route path="tags" element={<TagsIndexPage />} />
            <Route path="tags/new" element={<TagsCreatePage />} />
            <Route path="tags/:tag_id/video/:vid_id" element={<PlayerPage />} />
            <Route path="tags/:tag_id/delete" element={<TagsDeletePage />} />
            <Route path="tags/:tag_id/edit" element={<TagEditPage />} />
            <Route path="tags/:tag_id" element={<TagDetailsPage />} />
            {/* Playlist System */}
            <Route path="playlists" element={<PlaylistIndex />} />
            <Route path="playlists/new" element={<PlaylistCreatePage />} />
            <Route path="playlists/:playlist_id/order/:order" element={<PlaylistPlayer />} />
            <Route path="playlists/:playlist_id/delete" element={<DeletePage />} />
            <Route path="playlists/:playlist_id/edit" element={<PlaylistEditPage />} />
            <Route path="playlists/:playlist_id" element={<PlaylistDetailsPage />} />
            <Route path="dynamic-playlist/:playlist_id/order/:order" element={<PlaylistPlayer />} />
            {/* Query System */}
            <Route path="queries" element={<QueriesIndexPage />} />
            <Route path="queries/new" element={<QueriesCreatePage />} />
            <Route path="queries/:query_id/video/:vid_id" element={<PlayerPage />} />
            <Route path="queries/delete/:query_id" element={<QueryDeletePage />} />
            <Route path="queries/:query_id/edit" element={<QueriesEditPage />} />
            <Route path="queries/:query_id" element={<QueriesDetailPage />} />
            {/* Gallery System */}
            <Route path="galleries" element={<GalleryIndexPage />} />
            <Route path="galleries/:gallery_id" element={<GalleryDetailsPage />} />
            <Route path="galleries/:gallery_id/edit" element={<GalleryEditPage />} />
            <Route path="galleries/:gallery_id/image/:image_id" element={<ImageDeletePage />} />
            {/* Series System */}
            <Route path="series" element={<SeriesIndexPage />} />
            <Route path="series/new" element={<SeriesCreatePage />} />
            <Route path="series/:series_id" element={<SeriesDetailsPage />} />
            <Route path="series/:series_id/delete" element={<SeriesDeletePage />} />
            {/* File Scripts */}
            <Route path="file-scripts" element={<FileScriptsIndex />} />
            <Route path="file-scripts/:script_id" element={<FileScriptDetails />} />
            <Route path="file-scripts/:script_id/edit" element={<FileScriptEdit />} />
            {/* Cleanup */}
            <Route path="cleanup" element={<CleanupPage />} />
          </Routes>
        </BrowserRouter>
      </Box>
    </ThemeProvider>
  );
};

export default observer(App);
