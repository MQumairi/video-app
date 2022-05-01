import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BrowserPage from "./browser/browser_page";
import { PlayerPage } from "./player/player_page";

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route index element={<BrowserPage dir_path="data" />} />
      <Route path="player/:vid_path" element={<PlayerPage />}></Route>
    </Routes>
  </BrowserRouter>
);
