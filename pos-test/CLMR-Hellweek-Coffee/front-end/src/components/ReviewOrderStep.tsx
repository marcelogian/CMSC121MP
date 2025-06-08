import React from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Divider, 
  Paper,
  Chip,
  Avatar,
  ListItemAvatar,
  Button,
  Grid
} from '@mui/material';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import BakeryDiningIcon from '@mui/icons-material/BakeryDining';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { TransactionItem, Customer } from '../types';

interface ReviewOrderStepProps {
  orderItems: TransactionItem[];
  customer?: Customer;
  onEdit: () => void;
  onBack: () => void;
  onComplete: () => void;
}

const ReviewOrderStep: React.FC<ReviewOrderStepProps> = ({
  orderItems,
  customer,
  onEdit,
  onBack,
  onComplete
}) => {
  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.12;
  const total = subtotal + tax;

  const getItemIcon = (type: 'DRINK' | 'FOOD' | 'MERCHANDISE') => {
    switch(type) {
      case 'DRINK': return <LocalCafeIcon />;
      case 'FOOD': return <BakeryDiningIcon />;
      case 'MERCHANDISE': return <ShoppingBagIcon />;
      default: return <LocalCafeIcon />;
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 4, borderRadius: 3, maxWidth: 800, margin: '0 auto' }}>
      <Typography variant="h5" gutterBottom sx={{ 
        fontWeight: 600, 
        color: 'primary.main', 
        mb: 3,
        textAlign: 'center'
      }}>
        Review Order
      </Typography>
      
      {/* Customer Information */}
      <Paper elevation={0} sx={{ 
        mb: 3, 
        p: 3, 
        backgroundColor: 'grey.50', 
        borderRadius: 2,
        borderLeft: '4px solid',
        borderColor: customer?.member ? 'primary.main' : 'secondary.main'
      }}>
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
          Customer Information
        </Typography>
        {customer ? (
          customer.member ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Chip 
                label="Member" 
                color="primary" 
                size="small" 
                sx={{ mr: 2, fontWeight: 600 }} 
              />
              <Box>
                <Typography variant="body1">
                  {customer.firstName} {customer.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ID: {customer.memberId}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Chip 
                label="Guest" 
                color="secondary" 
                size="small" 
                sx={{ mr: 2, fontWeight: 600 }} 
              />
              <Typography variant="body1">
                {customer.firstName}
              </Typography>
            </Box>
          )
        ) : (
          <Typography variant="body1" color="text.secondary">
            No customer information available
          </Typography>
        )}
      </Paper>
      
      {/* Order Items */}
      <List sx={{ mb: 2 }}>
        {orderItems.map((orderItem, index) => (
          <React.Fragment key={index}>
            <ListItem sx={{ py: 2 }}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'primary.light' }}>
                  {getItemIcon(orderItem.type)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography fontWeight={600}>
                    {orderItem.quantity}x {orderItem.name} ({orderItem.size})
                  </Typography>
                }
                secondary={
                  orderItem.customizations.length > 0 && (
                    <Box component="span" sx={{ display: 'block', mt: 1 }}>
                      {orderItem.customizations.map((custom, idx) => (
                        <Chip
                          key={idx}
                          label={`${custom.name}: ${custom.optionName} (+₱${custom.additionalPrice.toFixed(2)})`}
                          size="small"
                          sx={{ mr: 1, mt: 1 }}
                        />
                      ))}
                    </Box>
                  )
                }
              />
              <Typography fontWeight={600}>
                ₱{(orderItem.price * orderItem.quantity).toFixed(2)}
              </Typography>
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>
      
      {/* Order Summary */}
      <Paper elevation={0} sx={{ 
        p: 3, 
        mb: 3,
        backgroundColor: 'grey.50', 
        borderRadius: 2,
        borderTop: '2px solid',
        borderColor: 'primary.main'
      }}>
        <Box sx={{ mb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>Subtotal:</Typography>
            <Typography>₱{subtotal.toFixed(2)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>Tax (12%):</Typography>
            <Typography>₱{tax.toFixed(2)}</Typography>
          </Box>
        </Box>
        <Divider sx={{ my: 1 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight={700}>Total:</Typography>
          <Typography variant="h6" fontWeight={700} color="primary">
            ₱{total.toFixed(2)}
          </Typography>
        </Box>
      </Paper>

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ flex: '1 1 48%' }}>
          <Button
            variant="outlined"
            onClick={onBack}
            fullWidth
            sx={{
              height: 48,
              borderRadius: 2,
              fontWeight: 600,
              borderColor: 'primary.main',
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'rgba(74, 44, 13, 0.1)',
                borderColor: 'primary.dark',
              }
            }}
          >
            Back
          </Button>
        </Box>
        <Box sx={{ flex: '1 1 48%' }}>
          <Button
            variant="contained"
            onClick={onEdit}
            fullWidth
            sx={{
              height: 48,
              borderRadius: 2,
              fontWeight: 600,
              backgroundColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.dark',
              }
            }}
          >
            Edit Order
          </Button>
        </Box>
        <Box sx={{ flex: '1 1 48%' }}>
          <Button
            variant="contained"
            color="success"
            onClick={onComplete}
            fullWidth
            sx={{
              height: 48,
              borderRadius: 2,
              fontWeight: 600,
              fontSize: '1rem'
            }}
          >
            Complete Transaction
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default ReviewOrderStep;