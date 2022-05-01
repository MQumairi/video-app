import BrowserPage from "./browser/browser_page";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PlayerPage } from "./player/player_page";
import CssBaseline from "@mui/material/CssBaseline";
import { useEffect } from "react";

const App = () => {
  return (
    <div>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route index element={<BrowserPage />} />
          <Route path="browser/:dir_path" element={<BrowserPage />} />
          <Route path="player/:vid_path" element={<PlayerPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
