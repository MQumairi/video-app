import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";

export const NavBar = () => {
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
          <a href="/">Browser</a>
        </Typography>
        <Typography variant="h6" color="inherit" component="div" sx={icon_style}>
          <a href="/tags">Tags</a>
        </Typography>
        <Typography variant="h6" color="inherit" component="div" sx={icon_style}>
          <a href="/playlists">Playlists</a>
        </Typography>
      </Toolbar>
    </AppBar>
  );
};
