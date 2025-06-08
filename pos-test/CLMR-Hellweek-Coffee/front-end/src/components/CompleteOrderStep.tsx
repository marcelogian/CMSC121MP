import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip
} from '@mui/material';
import { 
  CheckCircleOutline, 
  Celebration,
  LocalCafe,
  Print 
} from '@mui/icons-material';
import { Transaction, Customer, TransactionItem } from '../types';

interface CompleteOrderStepProps {
  transaction: {
    items: TransactionItem[];
    total: number;
    customer?: Customer;
  };
  onNewTransaction: () => void;
  onPrintReceipt: (id: number) => void;
}

const CompleteOrderStep: React.FC<CompleteOrderStepProps> = ({
  transaction,
  onNewTransaction,
  onPrintReceipt
}) => {
  // Generate a mock transaction ID for demo purposes
  const transactionId = Math.floor(Math.random() * 10000) + 1000;

  return (
    <Paper elevation={0} sx={{ 
      p: 4, 
      textAlign: 'center', 
      borderRadius: 3,
      maxWidth: 800,
      mx: 'auto',
      my: 2,
      backgroundColor: 'grey.50'
    }}>
      {/* Success Header */}
      <Box sx={{ mb: 4 }}>
        <Avatar sx={{ 
          bgcolor: 'success.light', 
          width: 80, 
          height: 80,
          mx: 'auto',
          mb: 2
        }}>
          <CheckCircleOutline sx={{ fontSize: 50, color: 'success.main' }} />
        </Avatar>
        
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'success.dark' }}>
          Order Completed!
        </Typography>
        
        <Typography variant="body1" gutterBottom>
          Thank you for your purchase{transaction.customer ? 
            transaction.customer.member ? 
              `, ${transaction.customer.firstName} (Member ID: ${transaction.customer.memberId})` : 
              `, ${transaction.customer.firstName}` : 
            ''}!
        </Typography>
        
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Transaction ID: #{transactionId}
        </Typography>
      </Box>

      {/* Order Summary */}
      <Paper elevation={0} sx={{ 
        p: 3, 
        mb: 4,
        backgroundColor: 'background.paper',
        borderRadius: 2,
        textAlign: 'left'
      }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Order Summary
        </Typography>
        
        <List>
          {transaction.items.map((item, index) => (
            <React.Fragment key={index}>
              <ListItem sx={{ py: 1 }}>
                <ListItemText
                  primary={`${item.quantity}x ${item.name} (${item.size})`}
                  secondary={
                    item.customizations.length > 0 && (
                      <Box component="span" sx={{ display: 'block', mt: 0.5 }}>
                        {item.customizations.map((custom: { name: any; optionName: any; }, idx: React.Key | null | undefined) => (
                          <Chip
                            key={idx}
                            label={`${custom.name}: ${custom.optionName}`}
                            size="small"
                            sx={{ mr: 1, mt: 0.5 }}
                          />
                        ))}
                      </Box>
                    )
                  }
                />
                <Typography variant="body1" fontWeight={600}>
                  ₱{(item.price * item.quantity).toFixed(2)}
                </Typography>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
        
        <Box sx={{ textAlign: 'right', mt: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Total: ₱{transaction.total.toFixed(2)}
          </Typography>
        </Box>
      </Paper>

      {/* Celebration and Actions */}
      <Box sx={{ mb: 3 }}>
        <Avatar sx={{ 
          bgcolor: 'primary.light', 
          width: 60, 
          height: 60,
          mx: 'auto',
          mb: 2
        }}>
          <Celebration fontSize="large" sx={{ color: 'primary.main' }} />
        </Avatar>
        <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 3 }}>
          {transaction.customer?.member ? 
            'Reward points have been added to your account!' : 
            'Consider joining our membership program for exclusive benefits!'}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button 
          variant="contained" 
          onClick={onNewTransaction}
          size="large"
          startIcon={<LocalCafe />}
          sx={{ 
            borderRadius: 2,
            px: 4,
            py: 1.5
          }}
        >
          New Order
        </Button>
        <Button 
          variant="outlined" 
          size="large"
          onClick={() => onPrintReceipt(transactionId)}
          startIcon={<Print />}
          sx={{ 
            borderRadius: 2,
            px: 4,
            py: 1.5
          }}
        >
          Print Receipt
        </Button>
      </Box>
    </Paper>
  );
};

export default CompleteOrderStep;