import React, { useMemo } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';

import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { drawerWidth } from './constants/drawer';
import SideBar from './components/ui/SideBar';
import { useGetStaffQuery } from './features/api/api';
import { useAppSelector } from './app/hooks';
import Staff from './features/staff/Staff';
import DepartmentsTree from './features/departments/DepartmentsTree';

function App() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { data: staff = [], isSuccess } = useGetStaffQuery();
  const selectedDepartment = useAppSelector(
    (state) => state.departments.selected
  );

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const staffFiltered = useMemo(() => {
    return staff.filter(
      (item: any) => item.departmentId === selectedDepartment
    );
  }, [staff, selectedDepartment]);

  return (
    <Box sx={{ display: 'flex' }}>
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
      <SideBar handleDrawerToggle={handleDrawerToggle} mobileOpen={mobileOpen}>
        <DepartmentsTree />
      </SideBar>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {isSuccess && staffFiltered.length > 0 && (
          <Staff staff={staffFiltered} />
        )}
      </Box>
    </Box>
  );
}

export default App;
