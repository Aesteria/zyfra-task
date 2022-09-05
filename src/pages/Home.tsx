import React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import SideBar from '../components/ui/SideBar';
import DepartmentsTree from '../features/departments/DepartmentsTree';
import NavBar from '../components/ui/NavBar';
import Main from '../components/ui/Main';
import { Outlet } from 'react-router-dom';

function HomePage() {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <NavBar handleDrawerToggle={handleDrawerToggle} />

      <SideBar handleDrawerToggle={handleDrawerToggle} mobileOpen={mobileOpen}>
        <DepartmentsTree />
      </SideBar>

      <Main>
        <Toolbar />
        <Outlet />
      </Main>
    </Box>
  );
}

export default HomePage;