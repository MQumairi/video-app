import { AppBar, Toolbar, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";

const NavBar = () => {
  const bar_style = {
    borderRadius: "10px",
    marginBottom: "30px",
    backgroundColor: "#001f30",
  };
  const icon_style = {
    marginLeft: "30px",
  };
  return (
    <AppBar position="static" sx={bar_style}>
      <Toolbar variant="dense">
        <Typography variant="h6" color="inherit" component="div">
          <a href="/">Home</a>
        </Typography>
        <Typography variant="h6" color="inherit" component="div" sx={icon_style}>
          <a href="/browser">Browser</a>
        </Typography>
        <Typography variant="h6" color="inherit" component="div" sx={icon_style}>
          <a href="/tags">Tags</a>
        </Typography>
        <Typography variant="h6" color="inherit" component="div" sx={icon_style}>
          <a href="/search">Search</a>
        </Typography>
        <Typography variant="h6" color="inherit" component="div" sx={icon_style}>
          <a href="/playlists">Playlists</a>
        </Typography>
        <Typography variant="h6" color="inherit" component="div" sx={icon_style}>
          <a href="/galleries">Galleries</a>
        </Typography>
        <Typography variant="h6" color="inherit" component="div" sx={icon_style}>
          <a href="/series">Series</a>
        </Typography>
        <Typography variant="h6" color="inherit" component="div" sx={icon_style}>
          <a href="/file-scripts">Scripts</a>
        </Typography>
        <Typography variant="h6" color="inherit" component="div" sx={icon_style}>
          <a href="/cleanup">Cleanup</a>
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default observer(NavBar);
