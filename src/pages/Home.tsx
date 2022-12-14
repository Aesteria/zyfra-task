import React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import SideBar from '../components/ui/SideBar';
import NavBar from '../components/ui/NavBar';
import Main from '../components/ui/Main';
import DepartmentsTree from '../features/departments/DepartmentsTree';
import Divider from '@mui/material/Divider';
import Staff from '../features/staff/Staff';
import DepartmentInfo from '../features/departments/DepartmentInfo';

function HomePage() {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <NavBar handleDrawerToggle={handleDrawerToggle} />

      <SideBar handleDrawerToggle={handleDrawerToggle} mobileOpen={mobileOpen}>
        <Toolbar />
        <Divider />
        <DepartmentsTree />
      </SideBar>

      <Main>
        <Toolbar />
        <DepartmentInfo />
        <Staff />
      </Main>
    </Box>
  );
}

export default HomePage;
