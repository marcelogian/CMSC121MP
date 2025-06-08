// src/components/CashierFlow/CustomerTypeStep.tsx
import React, { useState } from 'react';
import { 
  Box, Button, TextField, Typography, 
  Radio, RadioGroup, FormControlLabel,
  Dialog, DialogTitle, DialogContent,
  DialogActions, FormHelperText, Paper,
  Avatar, Stack, Divider, Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import PersonIcon from '@mui/icons-material/Person';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import api from '../services/api';
import { Customer } from '../types';

interface CustomerTypeStepProps {
  onCustomerSelected: (customer: Customer) => void;
  onBack?: () => void;
}

interface MemberData {
  firstName: string;
  lastName: string;
  dateOfBirth: Date | null;
  email: string;
  phone: string;
}

const CustomerTypeStep: React.FC<CustomerTypeStepProps> = ({ 
  onCustomerSelected, 
  onBack 
}) => {
  const [isMember, setIsMember] = useState(false);
  const [memberId, setMemberId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  const [newMember, setNewMember] = useState<MemberData>({
    firstName: '',
    lastName: '',
    dateOfBirth: null,
    email: '',
    phone: ''
  });
  const [validationError, setValidationError] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validateMemberId = (id: string) => /^[A-Z0-9]{5}$/.test(id);

  const handleGuestSubmit = () => {
    if (!firstName.trim()) {
      setError('First name is required for guest customers');
      return;
    }
    
    const guestCustomer: Customer = {
      firstName: firstName.trim(),
      member: false
    };
    onCustomerSelected(guestCustomer);
  };

  const handleMemberSubmit = async () => {
    if (!validateMemberId(memberId)) {
      setError('Member ID must be 5 alphanumeric characters');
      return;
    }

    setLoading(true);
    try {
      const response = await api.get(`/customers/members/${memberId}`);
      const memberCustomer: Customer = {
        ...response.data,
        member: true
      };
      onCustomerSelected(memberCustomer);
    } catch (err) {
      setError('Member not found. Please check the ID and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterMember = async () => {
    if (!newMember.firstName || !newMember.lastName || !newMember.dateOfBirth) {
      setValidationError('Full name and date of birth are required');
      return;
    }
    if (!newMember.email && !newMember.phone) {
      setValidationError('Either email or phone must be provided');
      return;
    }

    setLoading(true);
    try {
      const memberDto = {
        firstName: newMember.firstName,
        lastName: newMember.lastName,
        dateOfBirth: newMember.dateOfBirth?.toISOString().split('T')[0],
        email: newMember.email,
        phone: newMember.phone
      };

      const response = await api.post('/customers/members', memberDto);
      setMemberId(response.data.memberId);
      setIsMember(true);
      setRegisterDialogOpen(false);
    } catch (err) {
      setValidationError('Failed to register member. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 4, borderRadius: 3, maxWidth: 600, margin: '0 auto' }}>
      <Typography variant="h5" gutterBottom sx={{ 
        fontWeight: 600, 
        color: 'primary.main', 
        mb: 3,
        textAlign: 'center'
      }}>
        Customer Information
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <RadioGroup
        value={isMember ? 'member' : 'guest'}
        onChange={(e) => setIsMember(e.target.value === 'member')}
        sx={{ mb: 3 }}
      >
        <Stack direction="row" spacing={3}>
          <Paper
            elevation={isMember ? 0 : 3}
            sx={{
              p: 2,
              flex: 1,
              border: isMember ? '1px solid #e0e0e0' : '2px solid primary.main',
              borderRadius: 2,
              cursor: 'pointer',
              backgroundColor: isMember ? 'background.paper' : 'primary.light',
            }}
            onClick={() => setIsMember(false)}
          >
            <FormControlLabel
              value="guest"
              control={<Radio sx={{ display: 'none' }} />}
              label={
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Avatar sx={{ 
                    bgcolor: isMember ? 'grey.400' : 'primary.main', 
                    mb: 1,
                    width: 56,
                    height: 56
                  }}>
                    <PersonIcon fontSize="large" />
                  </Avatar>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    Guest
                  </Typography>
                </Box>
              }
              sx={{ m: 0 }}
            />
          </Paper>
          
          <Paper
            elevation={isMember ? 3 : 0}
            sx={{
              p: 2,
              flex: 1,
              border: isMember ? '2px solid primary.main' : '1px solid #e0e0e0',
              borderRadius: 2,
              cursor: 'pointer',
              backgroundColor: isMember ? 'primary.light' : 'background.paper',
            }}
            onClick={() => setIsMember(true)}
          >
            <FormControlLabel
              value="member"
              control={<Radio sx={{ display: 'none' }} />}
              label={
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Avatar sx={{ 
                    bgcolor: isMember ? 'primary.main' : 'grey.400', 
                    mb: 1,
                    width: 56,
                    height: 56
                  }}>
                    <LoyaltyIcon fontSize="large" />
                  </Avatar>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    Member
                  </Typography>
                </Box>
              }
              sx={{ m: 0 }}
            />
          </Paper>
        </Stack>
      </RadioGroup>

      {!isMember ? (
        <>
          <TextField
            fullWidth
            label="First Name"
            variant="outlined"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            sx={{ mb: 3 }}
            required
            InputProps={{
              sx: { borderRadius: 2, height: 48 }
            }}
          />
          <Button
            variant="contained"
            onClick={handleGuestSubmit}
            disabled={loading || !firstName.trim()}
            fullWidth
            sx={{ 
              height: 48,
              borderRadius: 2,
              fontSize: '1rem'
            }}
          >
            Continue as Guest
          </Button>
        </>
      ) : (
        <>
          <TextField
            fullWidth
            label="Member ID"
            variant="outlined"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value.toUpperCase())}
            placeholder="Enter 5-character ID (e.g., AB12E)"
            inputProps={{ 
              maxLength: 5,
              style: { textTransform: 'uppercase' }
            }}
            sx={{ mb: 2 }}
            error={memberId.length > 0 && !validateMemberId(memberId)}
            helperText={memberId.length > 0 && !validateMemberId(memberId) ? 
              'Member ID must be 5 uppercase letters/numbers' : ''}
            InputProps={{
              sx: { borderRadius: 2, height: 48 }
            }}
          />
          <Button 
            variant="contained" 
            onClick={handleMemberSubmit}
            disabled={loading || !validateMemberId(memberId)}
            fullWidth
            sx={{ 
              mb: 2,
              height: 48,
              borderRadius: 2,
              fontSize: '1rem'
            }}
          >
            {loading ? 'Verifying...' : 'Continue as Member'}
          </Button>
          <Button 
            variant="outlined"
            onClick={() => setRegisterDialogOpen(true)}
            fullWidth
            sx={{ 
              height: 48,
              borderRadius: 2,
              fontSize: '1rem'
            }}
            startIcon={<LoyaltyIcon />}
          >
            Register New Member
          </Button>
        </>
      )}


      {/* New Member Registration Dialog */}
      <Dialog 
        open={registerDialogOpen} 
        onClose={() => setRegisterDialogOpen(false)}
        PaperProps={{
          sx: { 
            borderRadius: 3,
            width: '100%',
            maxWidth: '500px'
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          fontWeight: 600
        }}>
          Register New Member
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <TextField
            fullWidth
            label="First Name"
            value={newMember.firstName}
            onChange={(e) => setNewMember({...newMember, firstName: e.target.value})}
            sx={{ mt: 2 }}
            required
            InputProps={{
              sx: { borderRadius: 2, height: 48 }
            }}
          />
          <TextField
            fullWidth
            label="Last Name"
            value={newMember.lastName}
            onChange={(e) => setNewMember({...newMember, lastName: e.target.value})}
            sx={{ mt: 2 }}
            required
            InputProps={{
              sx: { borderRadius: 2, height: 48 }
            }}
          />
          <DatePicker
            label="Date of Birth"
            value={newMember.dateOfBirth}
            onChange={(date) => setNewMember({...newMember, dateOfBirth: date})}
            sx={{ mt: 2, width: '100%' }}
            slotProps={{ 
              textField: { 
                required: true,
                InputProps: {
                  sx: { borderRadius: 2, height: 48 }
                }
              } 
            }}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={newMember.email}
            onChange={(e) => setNewMember({...newMember, email: e.target.value})}
            sx={{ mt: 2 }}
            InputProps={{
              sx: { borderRadius: 2, height: 48 }
            }}
          />
          <TextField
            fullWidth
            label="Phone Number"
            value={newMember.phone}
            onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
            sx={{ mt: 2 }}
            InputProps={{
              sx: { borderRadius: 2, height: 48 }
            }}
          />
          {validationError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {validationError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => {
              setRegisterDialogOpen(false);
              setValidationError('');
            }}
            sx={{ 
              borderRadius: 2,
              height: 48,
              px: 3
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleRegisterMember}
            variant="contained"
            disabled={loading}
            sx={{ 
              borderRadius: 2,
              height: 48,
              px: 3
            }}
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default CustomerTypeStep;