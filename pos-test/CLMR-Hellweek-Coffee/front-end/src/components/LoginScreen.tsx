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
  Snackbar,
  Checkbox
} from '@mui/material';
import { LocalCafe } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

type UserRole = 'cashier' | 'manager' | 'admin';

const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('cashier');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Required if your backend uses cookies/session
        body: JSON.stringify({
          username,
          password,
          role: role.toUpperCase(), // your backend expects uppercase roles like "ADMIN"
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (rememberMe) {
          localStorage.setItem('rememberedUser', JSON.stringify({ username, role }));
        }
        if (role === 'admin') navigate('/admin');
        else if (role === 'manager') navigate('/manager');
        else navigate('/cashier');
      } else {
        const errorText = await response.text();
        setError(errorText || 'Login failed');
        setOpenSnackbar(true);
      }
    } catch (error) {
      setError('Network error or server not available');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
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
          {/* Background image layer */}
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
          {/* Left side - Login Form */}
          <Box sx={{
            width: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#242424',
            p: 4
          }}>
            <Box sx={{ width: '100%', maxWidth: 400 }}>
              <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 3, color:'white' }}>
                <LocalCafe sx={{ mr: 1 }} />
                Hell Week Coffee POS
              </Typography>
              <Typography variant="body1" align="center" sx={{ mb: 3, color: 'white' }}>
                Please login to your account
              </Typography>
              
              <Box sx={{ mb: 2, color:'white' }}>
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
                />
                
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={rememberMe} 
                      onChange={(e) => setRememberMe(e.target.checked)}
                      sx={{ color: 'white' }}
                    />
                  }
                  label="Remember me"
                  sx={{ color: 'white' }}
                />
                
                <RadioGroup
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  sx={{ mb: 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', color:'white' }}
                >
                  <FormControlLabel value="cashier" control={
                    <Radio
                      sx={{
                        color: '#ff9800',
                        '&.Mui-checked': {
                          color: '#8B5E3C',
                        },
                      }}
                    />
                  } label="Cashier" />
                  <FormControlLabel value="manager" control={
                    <Radio
                      sx={{
                        color: '#f44336',
                        '&.Mui-checked': {
                          color: '#8B5E3C',
                        },
                      }}
                    />
                  } label="Manager" />
                  <FormControlLabel value="admin" control={
                    <Radio
                      sx={{
                        color: '#2196f3',
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
                  onClick={handleLogin}
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
                  Sign In
                </Button>
                
                <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                  Don't have an account?{' '}
                  <Link to="/signup" style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 'bold' }}>
                    Sign up
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Right side - Image */}
          <Box sx={{
            width: '50%',
            backgroundImage: 'url(Side-Image.png)',
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

export default LoginScreen;