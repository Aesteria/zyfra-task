import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { ReactNode } from 'react';
import { drawerWidth } from '../../constants/drawer';

type SideBarProps = {
  handleDrawerToggle: () => void;
  mobileOpen: boolean;
  children: ReactNode;
};

const SideBar = ({
  handleDrawerToggle,
  mobileOpen,
  children,
}: SideBarProps) => {
  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      <Drawer
        container={document.body}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
      >
        {children}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
        open
      >
        {children}
      </Drawer>
    </Box>
  );
};

export default SideBar;
