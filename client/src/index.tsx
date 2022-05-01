import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BrowserPage from "./browser/browser_page";
import { PlayerPage } from "./player/player_page";

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <BrowserRouter>
    <Routes>
      <Route index element={<BrowserPage />} />
      <Route path="browser/:dir_path" element={<BrowserPage />} />
      <Route path="player/:vid_path" element={<PlayerPage />} />
    </Routes>
  </BrowserRouter>
);
