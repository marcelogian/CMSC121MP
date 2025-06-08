import React, { useState, useEffect } from 'react';
import { 
  Box, Card, CardContent, Typography, 
  Button, Chip, Divider, TextField, 
  Dialog, DialogTitle, DialogContent, 
  DialogActions, Select, MenuItem, FormControl, 
  InputLabel, Paper, List, ListItem, 
  ListItemText, Avatar, Tabs, Tab,
  Badge, IconButton,
  ListItemAvatar
} from '@mui/material';
import { 
  Add as AddIcon, 
  Remove as RemoveIcon,
  LocalCafe as LocalCafeIcon,
  BakeryDining as BakeryDiningIcon,
  ShoppingBag as ShoppingBagIcon
} from '@mui/icons-material';
import { Item, TransactionItem, SelectedCustomization } from '../types';
import api from '../services/api';

interface ItemSelectionStepProps {
  onAddToOrder: (item: TransactionItem) => void;
  onCompleteOrder: () => void;
  currentOrderItems: TransactionItem[];
}

const ItemSelectionStep: React.FC<ItemSelectionStepProps> = ({ 
  onAddToOrder,
  onCompleteOrder,
  currentOrderItems
}) => {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [customizationSelections, setCustomizationSelections] = useState<Record<string, string>>({});
  const [tabValue, setTabValue] = useState(0);

  // Fetch items and categories on mount
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await api.get('/items');
        const itemsData: Item[] = response.data;
        setItems(itemsData);
        
        // Extract unique categories
        const uniqueCategories = Array.from(new Set(itemsData.map(item => item.category)));
        setCategories(uniqueCategories);
        if (uniqueCategories.length > 0) {
          setSelectedCategory(uniqueCategories[0]);
        }
      } catch (error) {
        console.error('Failed to fetch items:', error);
      }
    };
    fetchItems();
  }, []);

  const handleItemSelect = (item: Item) => {
    setSelectedItem(item);
    setSelectedSize(item.sizes[0]?.name || '');
    setCustomizationSelections({});
    setQuantity(1);
  };

  const handleCustomizationChange = (customizationId: string, optionId: string) => {
    setCustomizationSelections(prev => ({
      ...prev,
      [customizationId]: optionId
    }));
  };

  const handleAddToOrder = () => {
    if (!selectedItem) return;

    // Find selected size details
    const sizeDetails = selectedItem.sizes.find(s => s.name === selectedSize);
    const sizePriceModifier = sizeDetails?.priceModifier || 0;

    // Prepare customizations with their details
    const selectedCustomizations: SelectedCustomization[] = [];
    let customizationTotal = 0;

    Object.entries(customizationSelections).forEach(([customizationId, optionId]) => {
      const customization = selectedItem.customizations?.find(c => c.id.toString() === customizationId);
      if (customization) {
        const option = customization.options.find(o => o.id.toString() === optionId);
        if (option) {
          selectedCustomizations.push({
            customizationId: parseInt(customizationId),
            optionId: parseInt(optionId),
            name: customization.name,
            optionName: option.name,
            additionalPrice: option.priceModifier
          });
          customizationTotal += option.priceModifier;
        }
      }
    });

    const itemPrice = selectedItem.basePrice + sizePriceModifier + customizationTotal;

    const orderItem: TransactionItem = {
      itemCode: selectedItem.itemCode,
      name: selectedItem.name,
      type: selectedItem.type,
      size: selectedSize,
      quantity,
      customizations: selectedCustomizations,
      price: itemPrice
    };

    onAddToOrder(orderItem);
    setSelectedItem(null);
  };

  const calculateItemPrice = (): number => {
    if (!selectedItem) return 0;
    
    const sizeModifier = selectedItem.sizes.find(s => s.name === selectedSize)?.priceModifier || 0;
    let customizationTotal = 0;
    
    Object.values(customizationSelections).forEach(optionId => {
      selectedItem.customizations?.forEach(customization => {
        const option = customization.options.find(o => o.id.toString() === optionId);
        if (option) customizationTotal += option.priceModifier;
      });
    });

    return (selectedItem.basePrice + sizeModifier + customizationTotal) * quantity;
  };

  const getItemIcon = (type: 'DRINK' | 'FOOD' | 'MERCHANDISE') => {
    switch (type) {
      case 'DRINK': return <LocalCafeIcon />;
      case 'FOOD': return <BakeryDiningIcon />;
      case 'MERCHANDISE': return <ShoppingBagIcon />;
      default: return null;
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', mb: 3 }}>
        Select Items
      </Typography>

      <Tabs
        value={tabValue}
        onChange={(_, newValue) => setTabValue(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab label="Drinks" icon={<LocalCafeIcon />} />
        <Tab label="Food" icon={<BakeryDiningIcon />} />
        <Tab label="Merchandise" icon={<ShoppingBagIcon />} />
      </Tabs>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        {/* Items Grid */}
        <Box sx={{ flex: 2 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {items
              .filter(item => item.type === ['DRINK', 'FOOD', 'MERCHANDISE'][tabValue])
              .filter(item => item.category === selectedCategory)
              .map(item => (
                <Card 
                  key={item.itemCode}
                  onClick={() => handleItemSelect(item)}
                  sx={{ 
                    flex: '1 1 250px',
                    cursor: 'pointer',
                    border: selectedItem?.itemCode === item.itemCode ? '2px solid' : 'none',
                    borderColor: 'primary.main',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 3
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar sx={{ bgcolor: 'primary.light', mr: 1 }}>
                        {getItemIcon(item.type)}
                      </Avatar>
                      <Typography variant="h6">{item.name}</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {item.itemCode}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      Base Price: ₱{item.basePrice.toFixed(2)}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
          </Box>
        </Box>

        {/* Selection Panel */}
        <Box sx={{ flex: 1, minWidth: '300px', position: 'sticky', top: '20px' }}>
          {selectedItem ? (
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                {selectedItem.name}
              </Typography>

              {/* Size Selection */}
              {selectedItem.sizes.length > 0 && (
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Size</InputLabel>
                  <Select
                    value={selectedSize}
                    label="Size"
                    onChange={(e) => setSelectedSize(e.target.value)}
                  >
                    {selectedItem.sizes.map(size => (
                      <MenuItem key={size.name} value={size.name}>
                        {size.name} (+₱{size.priceModifier.toFixed(2)})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {/* Customizations */}
              {selectedItem.customizations?.map(customization => (
                <FormControl key={customization.id} fullWidth sx={{ mb: 2 }}>
                  <InputLabel>{customization.name}</InputLabel>
                  <Select
                    value={customizationSelections[customization.id] || ''}
                    label={customization.name}
                    onChange={(e) => handleCustomizationChange(
                      customization.id.toString(), 
                      e.target.value
                    )}
                    required={customization.required}
                  >
                    {customization.options.map(option => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name} (+₱{option.priceModifier.toFixed(2)})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ))}

              {/* Quantity */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Typography sx={{ mr: 2 }}>Quantity:</Typography>
                <IconButton onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  <RemoveIcon />
                </IconButton>
                <Typography sx={{ mx: 2 }}>{quantity}</Typography>
                <IconButton onClick={() => setQuantity(quantity + 1)}>
                  <AddIcon />
                </IconButton>
              </Box>

              <Button 
                variant="contained" 
                onClick={handleAddToOrder}
                disabled={
                  selectedItem.customizations?.some(
                    c => c.required && !customizationSelections[c.id]
                  ) || false
                }
                fullWidth
                size="large"
                startIcon={<AddIcon />}
              >
                Add to Order (₱{calculateItemPrice().toFixed(2)})
              </Button>
            </Paper>
          ) : (
            <Paper elevation={1} sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
              <Typography color="text.secondary">
                Select an item to customize your order
              </Typography>
            </Paper>
          )}
        </Box>
      </Box>

      {/* Order Summary */}
      {currentOrderItems.length > 0 && (
        <Paper elevation={0} sx={{ mt: 4, p: 3, backgroundColor: 'grey.50', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Current Order
          </Typography>
          <List>
            {currentOrderItems.map((item, index) => (
              <React.Fragment key={index}>
                <ListItem sx={{ py: 2 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.light' }}>
                      {getItemIcon(item.type)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${item.quantity}x ${item.name} (${item.size}) - ₱${(item.price * item.quantity).toFixed(2)}`}
                    secondary={
                      item.customizations.length > 0 && (
                        <Box component="span" sx={{ display: 'block', mt: 1 }}>
                          {item.customizations.map((custom, idx) => (
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
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
          <Box sx={{ textAlign: 'right', mt: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Total: ₱{currentOrderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="success"
            onClick={onCompleteOrder}
            fullWidth
            size="large"
            sx={{ mt: 2 }}
          >
            Complete Order
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default ItemSelectionStep;