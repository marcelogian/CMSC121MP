import React from 'react';
import { Box, Typography, Button, AppBar, Toolbar } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

const AdminDashboard: React.FC<{ handleLogout: () => void }> = ({ handleLogout }) => {
  return (
    <Box sx={{ width: '100%', p: 3, pt:'64px' }}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Hell Week Coffee - Manager Dashboard
          </Typography>
          <Button 
            color="inherit" 
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Typography>Admin-specific content goes here</Typography>
    </Box>
  );
};

export default AdminDashboard;