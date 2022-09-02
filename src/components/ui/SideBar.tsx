import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { drawerWidth } from '../../constants/drawer';
import DepartmentsTree from '../../features/departments/DepartmentsTree';

type SideBarProps = {
  handleDrawerToggle: () => void;
  mobileOpen: boolean;
};

const SideBar = ({ handleDrawerToggle, mobileOpen }: SideBarProps) => {
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
        <DepartmentsTree />
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
        <DepartmentsTree />
      </Drawer>
    </Box>
  );
};

export default SideBar;
