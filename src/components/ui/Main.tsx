import Box from '@mui/material/Box';
import { ReactNode } from 'react';
import { drawerWidth } from '../../constants/drawer';

type MainProps = {
  children: ReactNode;
};

const Main = ({ children }: MainProps) => {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        width: { sm: `calc(100% - ${drawerWidth}px)` },
      }}
    >
      {children}
    </Box>
  );
};

export default Main;
