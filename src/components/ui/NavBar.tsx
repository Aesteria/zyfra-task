import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

import { drawerWidth } from '../../constants/drawer';
import CssBaseline from '@mui/material/CssBaseline';

type NavBarProps = {
  handleDrawerToggle: () => void;
};

const NavBar = ({ handleDrawerToggle }: NavBarProps) => {
  return (
    <>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Персонал
          </Typography>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default NavBar;
