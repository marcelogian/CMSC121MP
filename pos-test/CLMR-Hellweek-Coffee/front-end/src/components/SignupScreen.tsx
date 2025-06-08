import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  Alert,
  Snackbar
} from '@mui/material';
import { LocalCafe } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

type UserRole = 'cashier' | 'manager' | 'admin';

const SignupScreen: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('cashier');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/auth/signup', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          role: role.toUpperCase(), // 🟢 Fix here
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Signup failed');
      }

      const data = await response.json();
      // Redirect based on role
      if (role === 'admin') navigate('/admin');
      else if (role === 'manager') navigate('/manager');
      else navigate('/cashier');
    } catch (err: any) {
      setError(err.message || 'Network or server error');
      setOpenSnackbar(true);
    }
  };


  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSignup();
    }
  };

  return (
    <Box sx={{ 
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        p: 4,
        overflow: 'hidden',
        color: 'white',
        backgroundColor: 'black'
    }}>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url(Foreground.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0,
          filter: 'blur(8px)'
        }}
      />
        <Box sx={{ zIndex: 1, width: '100%', maxWidth: 1000 }}>
          <Box sx={{
          display: 'flex',
          width: '100%',
          height: '80vh',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
        }}>
          {/* Left side - Signup Form */}
          <Box sx={{
            width: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#242424',
            p: 4
          }}>
            <Box sx={{ width: '100%', maxWidth: 400 }}>
              <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 3 }}>
                <LocalCafe sx={{ mr: 1 }} />
                Create Your Account
              </Typography>
              
              <Box sx={{ mb: 2, color: 'white' }}>
                <TextField
                  fullWidth
                  label="Username"
                  variant="outlined"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={handleKeyPress}
                  InputLabelProps={{
                    sx: {
                      color: '#ab8d77', // <- Label color
                      '&.Mui-focused': {
                        color: '#ab8d77',
                      },
                    },
                  }}
                  sx={{
                    mb: 2,
                    input: { color: 'white' },
                    label: { color: 'white' },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'white' },
                      '&:hover fieldset': { borderColor: 'white' },
                      '&.Mui-focused fieldset': { borderColor: 'white' },
                    }
                  }}
                  placeholder="Example1"
                />
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  InputLabelProps={{
                    sx: {
                      color: '#ab8d77', // <- Label color
                      '&.Mui-focused': {
                        color: '#ab8d77',
                      },
                    },
                  }}
                  sx={{
                    mb: 2,
                    input: { color: 'white' },
                    label: { color: 'white' },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'white' },
                      '&:hover fieldset': { borderColor: 'white' },
                      '&.Mui-focused fieldset': { borderColor: 'white' },
                    }
                  }}
                  placeholder="Create Password"
                />
                <TextField
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  variant="outlined"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  InputLabelProps={{
                    sx: {
                      color: '#ab8d77', // <- Label color
                      '&.Mui-focused': {
                        color: '#ab8d77',
                      },
                    },
                  }}
                  sx={{
                    mb: 2,
                    input: { color: 'white' },
                    label: { color: 'white' },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'white' },
                      '&:hover fieldset': { borderColor: 'white' },
                      '&.Mui-focused fieldset': { borderColor: 'white' },
                    }
                  }}
                  placeholder="Repeat the Password"
                />
                
                <RadioGroup
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  sx={{ mb: 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', color: 'white' }}
                >
                  <FormControlLabel value="cashier" control={
                    <Radio
                      sx={{
                        color: '#ff9800', // Orange
                        '&.Mui-checked': {
                          color: '#8B5E3C',
                        },
                      }}
                    />
                  } label="Cashier" />
                  <FormControlLabel value="manager" control={
                    <Radio
                      sx={{
                        color: '#f44336', // Orange
                        '&.Mui-checked': {
                          color: '#8B5E3C',
                        },
                      }}
                    />
                  } label="Manager" />
                  <FormControlLabel value="admin" control={
                    <Radio
                      sx={{
                        color: '#2196f3', // Orange
                        '&.Mui-checked': {
                          color: '#8B5E3C',
                        },
                      }}
                    />
                  } label="Admin" />
                </RadioGroup>
                
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleSignup}
                  size="large"
                  sx={{ 
                    backgroundColor: '#8B5E3C',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#704528',
                    },
                    mb: 2,
                    py: 1.5,
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontSize: '1rem'
                  }}
                >
                  Sign Up
                </Button>
                
                <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                  Already have an account?{' '}
                  <Link to="/" style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 'bold' }}>
                    Sign in
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Right side - Image */}
          <Box sx={{
            width: '50%',
            backgroundImage: 'url(https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }} />
        </Box>
      </Box>


      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SignupScreen;