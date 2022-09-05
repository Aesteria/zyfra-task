import React, { useMemo } from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import SideBar from '../components/ui/SideBar';
import { useGetStaffQuery } from '../features/api/api';
import { useAppSelector } from '../app/hooks';
import Staff from '../features/staff/Staff';
import DepartmentsTree from '../features/departments/DepartmentsTree';
import NavBar from '../components/ui/NavBar';
import Main from '../components/ui/Main';

function HomePage() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { data: staff = [], isSuccess } = useGetStaffQuery();
  const selectedDepartment = useAppSelector(
    (state) => state.departments.selected
  );

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const staffFiltered = useMemo(() => {
    return staff.filter((item: any) => item.department === selectedDepartment);
  }, [staff, selectedDepartment]);

  return (
    <Box sx={{ display: 'flex' }}>
      <NavBar handleDrawerToggle={handleDrawerToggle} />

      <SideBar handleDrawerToggle={handleDrawerToggle} mobileOpen={mobileOpen}>
        <DepartmentsTree />
      </SideBar>

      <Main>
        <Toolbar />
        {isSuccess && staffFiltered.length > 0 && (
          <Staff staff={staffFiltered} />
        )}
      </Main>
    </Box>
  );
}

export default HomePage;
