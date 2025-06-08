import React, { useState } from 'react';
import { 
  Box, 
  Stepper, 
  Step, 
  StepLabel, 
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  CssBaseline,
  ThemeProvider,
  createTheme
} from '@mui/material';
import { LocalCafe } from '@mui/icons-material';
import LogoutIcon from '@mui/icons-material/Logout';
import CustomerTypeStep from './CustomerTypeStep';
import ItemSelectionStep from './ItemSelectionStep';
import ReviewOrderStep from './ReviewOrderStep';
import CompleteOrderStep from './CompleteOrderStep';
import { Customer, TransactionItem } from '../types';

const steps = ['Customer Type', 'Select Items', 'Review Order', 'Complete'];

interface CashierDashboardProps {
  handleLogout: () => void;
}

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#4a2c0d', // Dark brown
    },
    secondary: {
      main: '#d4a76a', // Light brown
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        ::-webkit-scrollbar {
          display: none;
        }
        * {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `,
    },
  },
});

const CashierDashboard: React.FC<CashierDashboardProps> = ({ handleLogout }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orderItems, setOrderItems] = useState<TransactionItem[]>([]);
  const [transaction, setTransaction] = useState<any>(null);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setCustomer(null);
    setOrderItems([]);
    setTransaction(null);
  };

  const handleCustomerSelected = (selectedCustomer: Customer) => {
    setCustomer(selectedCustomer);
    handleNext();
  };

  const handleAddToOrder = (item: TransactionItem) => {
    // Check if identical item already exists in order
    const existingItemIndex = orderItems.findIndex(oi => 
      oi.itemCode === item.itemCode &&
      oi.size === item.size &&
      JSON.stringify(oi.customizations) === JSON.stringify(item.customizations)
    );

    if (existingItemIndex >= 0) {
      // Update quantity of existing item
      const updatedItems = [...orderItems];
      updatedItems[existingItemIndex].quantity += item.quantity;
      setOrderItems(updatedItems);
    } else {
      // Add new item
      setOrderItems([...orderItems, item]);
    }
  };

  const handleCompleteItems = () => {
    const total = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTransaction({ items: orderItems, total, customer });
    handleNext();
  };

  const handleCompleteTransaction = () => {
    handleNext();
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <CustomerTypeStep 
            onCustomerSelected={handleCustomerSelected}
            onBack={handleBack}
          />
        );
      case 1:
        return (
          <ItemSelectionStep
            onAddToOrder={handleAddToOrder}
            onCompleteOrder={handleCompleteItems}
            currentOrderItems={orderItems}
          />
        );
      case 2:
        return (
          <ReviewOrderStep
            orderItems={orderItems}
            customer={customer || undefined}
            onEdit={() => setActiveStep(1)}
            onBack={() => setActiveStep(0)}
            onComplete={handleCompleteTransaction}
          />
        );
      case 3:
        return (
          <CompleteOrderStep
            transaction={transaction}
            onNewTransaction={handleReset}
            onPrintReceipt={(id: any) => console.log('Print receipt:', id)}
          />
        );
      default:
        return <Typography>Unknown step</Typography>;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box 
        sx={{ 
          p: 3, 
          pt: '64px',
          minHeight: '100vh',
          backgroundImage: 'url(https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <AppBar 
          position="fixed" 
          sx={{ 
            backgroundColor: 'rgba(74, 44, 13, 0.9)',
            backdropFilter: 'blur(5px)',
          }}
        >
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#fff' }}>
              <LocalCafe sx={{ mr: 1 }} />
              Hell Week Coffee - Cashier
            </Typography>
            <Button 
              color="inherit" 
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{ 
                color: '#fff',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }
              }}
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>
        
        <Box 
          sx={{ 
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          <Box 
            sx={{ 
              width: '100%', 
              maxWidth: '1200px',
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              borderRadius: 2,
              p: 4,
              boxShadow: 3,
            }}
          >
            <Stepper 
              activeStep={activeStep} 
              alternativeLabel 
              sx={{ 
                mb: 4,
                '& .MuiStepIcon-root.Mui-active': {
                  color: theme.palette.primary.main,
                },
                '& .MuiStepIcon-root.Mui-completed': {
                  color: theme.palette.primary.main,
                },
              }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel 
                    sx={{
                      '& .MuiStepLabel-label': {
                        fontWeight: 600,
                        color: theme.palette.primary.main,
                      }
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
            
            <Paper 
              elevation={0} 
              sx={{ 
                p: 4, 
                mb: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                borderRadius: 2,
              }}
            >
              {renderStepContent(activeStep)}
            </Paper>
            
            {/* Navigation buttons - conditionally rendered based on step */}
            {activeStep !== 3 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  variant="outlined"
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: 'rgba(74, 44, 13, 0.1)',
                      borderColor: theme.palette.primary.dark,
                    }
                  }}
                >
                  Back
                </Button>
                {activeStep === 0 && (
                  <Button 
                    variant="contained" 
                    onClick={handleNext}
                    disabled={!customer}
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontWeight: 600,
                      backgroundColor: theme.palette.primary.main,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                      },
                      '&:disabled': {
                        backgroundColor: '#e0e0e0',
                      }
                    }}
                  >
                    Next
                  </Button>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default CashierDashboard;