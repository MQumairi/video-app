import ReactDOM from "react-dom/client";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import App from "./App";
import "./index.css";

// Explicit emotion cache with prepend:true so MUI's styles are injected at the
// top of <head> in a deterministic order on every load. Without this, emotion
// injects styles lazily as components mount, which on a cold start can race the
// browser's first paint and produce a flash of unstyled content (mis-sized grid,
// invisible text). prepend also lets index.css reliably override MUI.
const emotionCache = createCache({ key: "css", prepend: true });

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <CacheProvider value={emotionCache}>
    <App />
  </CacheProvider>
);
