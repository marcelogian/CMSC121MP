// App.tsx
// import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import LoginScreen from './components/LoginScreen';
import SignupScreen from './components/SignupScreen';
import CashierDashboard from './components/CashierDashboard';
import AdminDashboard from './components/AdminDashboard';
import ManagerDashboard from './components/ManagerDashboard';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';

type UserRole = 'cashier' | 'manager' | 'admin';

// interface User {
//   role: UserRole;
//   email: string;
// }

const theme = createTheme({
  palette: {
    primary: {
      main: '#6F4E37',
    },
    secondary: {
      main: '#C4A484',
    },
  },
});

const AppWrapper = () => {
  return (
    <AuthProvider> {/* ✅ Add AuthProvider here */}
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Router>
            <AppContent />
          </Router>
        </LocalizationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};


const AppContent = () => {
  const { user, logout } = useAuth(); // USE CONTEXT

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Routes>
      <Route 
        path="/" 
        element={user ? 
          (user.role === 'admin' ? 
            <AdminDashboard handleLogout={handleLogout} /> : 
            user.role === 'manager' ?
            <ManagerDashboard handleLogout={handleLogout} /> :
            <CashierDashboard handleLogout={handleLogout} />) : 
          <LoginScreen />} 
      />
      <Route path="/signup" element={<SignupScreen />} />
      <Route path="/cashier" element={<CashierDashboard handleLogout={handleLogout} />} />
      <Route path="/admin" element={<AdminDashboard handleLogout={handleLogout} />} />
      <Route path="/manager" element={<ManagerDashboard handleLogout={handleLogout} />} />
    </Routes>
  );
};

export default AppWrapper;
