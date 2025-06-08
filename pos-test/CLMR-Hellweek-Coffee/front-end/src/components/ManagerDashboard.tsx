import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Papa, { ParseResult } from 'papaparse';
import { 
  Box, Typography, Button, Tabs, Tab, Paper, TextField,
  FormControl, InputLabel, Select, MenuItem, InputAdornment, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Snackbar, Alert, AppBar, Toolbar, Divider, Chip, Card, CardContent, CardActions,
  Avatar, CssBaseline, styled, useTheme, ThemeProvider, createTheme
} from '@mui/material';
import { Add, Edit, Delete, Publish, Logout as LogoutIcon, LocalCafe, Fastfood, ShoppingBag, ExpandMore, ExpandLess } from '@mui/icons-material';

// Create the same custom theme as CashierDashboard
const theme = createTheme({
  palette: {
    primary: { main: '#4a2c0d' },
    secondary: { main: '#d4a76a' },
    background: { default: '#f5f5f5' },
  },
  typography: { fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', h6: { fontWeight: 600 } },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        ::-webkit-scrollbar { display: none; }
        * { -ms-overflow-style: none; scrollbar-width: none; }
      `
    }
  }
});

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': { transform: 'translateY(-4px)', boxShadow: theme.shadows[6] }
}));
const PriceChip = styled(Chip)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  fontWeight: 'bold',
  backgroundColor: theme.palette.success.light,
  color: theme.palette.success.contrastText,
}));
const TypeIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'food': return <Fastfood color="secondary" />;
    case 'drink': return <LocalCafe color="primary" />;
    case 'merchandise': return <ShoppingBag color="action" />;
    default: return <LocalCafe />;
  }
};

interface Item {
  id: string;
  code: string;
  name: string;
  type: 'food' | 'drink' | 'merchandise';
  category: string;
  sizes: { name: string; price: number }[];
  customizations?: { name: string; options: { name: string; price: number }[] }[];
}
interface ManagerDashboardProps { handleLogout: () => void; }

const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ handleLogout }) => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentItem, setCurrentItem] = useState<Item | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' | 'warning' });
  const [file, setFile] = useState<File | null>(null);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const [formState, setFormState] = useState({
    name: '',
    type: 'drink' as 'food' | 'drink' | 'merchandise',
    category: '',
    sizes: [{ name: 'NS', price: 0 }],
    customizations: [] as { name: string; options: { name: string; price: number }[] }[]
  });

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);
  const fetchItems = async () => {
    try {
      const res = await axios.get<Item[]>('/api/manager/items');
      setItems(res.data);
    } catch (error) {
      console.error(error);
      setSnackbar({ open: true, message: 'Error loading items', severity: 'error' });
    }
  };

  const handleAddItem = async () => {
    try {
      await axios.post('/api/manager/items', formState);
      setSnackbar({ open: true, message: 'Item added successfully!', severity: 'success' });
      fetchItems(); resetForm(); setOpenDialog(false);
    } catch {
      setSnackbar({ open: true, message: 'Add failed', severity: 'error' });
    }
  };
  const handleUpdateItem = async () => {
    if (!currentItem) return;
    try {
      await axios.put(`/api/manager/items/${currentItem.id}`, formState);
      setSnackbar({ open: true, message: 'Item updated successfully!', severity: 'success' });
      fetchItems(); resetForm(); setOpenDialog(false);
    } catch {
      setSnackbar({ open: true, message: 'Update failed', severity: 'error' });
    }
  };
  const handleDeleteItem = async (id: string) => {
    try {
      await axios.delete(`/api/manager/items/${id}`);
      setSnackbar({ open: true, message: 'Item deleted', severity: 'info' });
      fetchItems();
    } catch {
      setSnackbar({ open: true, message: 'Delete failed', severity: 'error' });
    }
  };

  const handleEditItem = (item: Item) => {
    setCurrentItem(item);
    setFormState({ name: item.name, type: item.type, category: item.category, sizes: item.sizes, customizations: item.customizations || [] });
    setOpenDialog(true);
  };
  const fetchCategories = async () => {
    try {
      const res = await axios.get<string[]>('/api/manager/categories');
      setCategories(res.data);
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Failed to load categories', severity: 'warning' });
    }
  };

  const resetForm = () => {
    setFormState({ name: '', type: 'drink', category: '', sizes: [{ name: 'NS', price: 0 }], customizations: [] });
    setCurrentItem(null);
  };
  const toggleExpand = (id: string) => setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = e.target.files[0]; setFile(selected);
    if (selected.name.endsWith('.csv')) {
      Papa.parse(selected, { header: true, skipEmptyLines: true,
        complete: (results: ParseResult<any>) => {
          const imported = parseCSVData(results.data);
          if (imported.length) {
            setItems([...items, ...imported]);
            setSnackbar({ open: true, message: `${imported.length} items imported`, severity: 'success' });
          } else setSnackbar({ open: true, message: 'No valid items found', severity: 'warning' });
        }, error: (error: Error) => setSnackbar({ open: true, message: `Error parsing CSV: ${error.message}`, severity: 'error' })
      });
    } else if (selected.name.endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          const imported = parseJSONData(data);
          if (imported.length) {
            setItems([...items, ...imported]);
            setSnackbar({ open: true, message: `${imported.length} items imported`, severity: 'success' });
          } else setSnackbar({ open: true, message: 'No valid items found', severity: 'warning' });
        } catch {
          setSnackbar({ open: true, message: 'Error parsing JSON', severity: 'error' });
        }
      };
      reader.readAsText(selected);
    } else {
      setSnackbar({ open: true, message: 'Unsupported file format', severity: 'error' });
    }
  };
  const generateItemCode = (name: string, category: string): string => {
  const categoryPart = category.length >= 2
    ? `${category[0]}${category[category.length - 1]}`.toUpperCase()
    : 'XX';

  let namePart = name.substring(0, 4).toUpperCase();
  if (namePart.length < 4) {
    namePart = namePart.padEnd(4, 'X');
  }

  const itemsInCategory = items.filter(item => item.category.toLowerCase() === category.toLowerCase()).length;
  const numberPart = (itemsInCategory + 1).toString().padStart(3, '0');

  return `${categoryPart}-${namePart}-${numberPart}`;
};

const parseCSVData = (data: any[]): Item[] => {
  return data.filter(row => row.name && row.type).map((row) => {
    let sizes = [{ name: 'NS', price: 0 }];
    try {
      if (row.sizes) {
        sizes = JSON.parse(row.sizes);
      } else if (row.size && row.price) {
        sizes = [{ name: row.size, price: parseFloat(row.price) || 0 }];
      }
    } catch {}

    let customizations = [];
    try {
      if (row.customizations) {
        customizations = JSON.parse(row.customizations);
      }
    } catch {}

    return {
      id: `imported-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      code: row.code || generateItemCode(row.name, row.category || ''),
      name: row.name,
      type: ['food', 'drink', 'merchandise'].includes(row.type.toLowerCase()) ? row.type.toLowerCase() : 'drink',
      category: row.category || '',
      sizes,
      customizations
    };
  });
};

const parseJSONData = (data: any): Item[] => {
  if (!Array.isArray(data)) return [];
  return data.filter(item => item.name && item.type).map((item) => {
    return {
      id: item.id || `imported-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      code: item.code || generateItemCode(item.name, item.category || ''),
      name: item.name,
      type: ['food', 'drink', 'merchandise'].includes(item.type.toLowerCase()) ? item.type.toLowerCase() : 'drink',
      category: item.category || '',
      sizes: item.sizes || [{ name: 'NS', price: 0 }],
      customizations: item.customizations || []
    };
  });
};

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ p: 3, pt: '64px', minHeight: '100vh', backgroundImage: 'url(https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
        <AppBar position="fixed" sx={{ backgroundColor: 'rgba(74, 44, 13, 0.9)', backdropFilter: 'blur(5px)' }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#fff' }}><LocalCafe sx={{ mr: 1 }} />Hell Week Coffee - Manager</Typography>
            <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>Logout</Button>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 'calc(100vh - 64px)' }}>
          <Box sx={{ width: '100%', maxWidth: '1200px', backgroundColor: 'rgba(255, 255, 255, 0.85)', borderRadius: 2, p: 4, boxShadow: 3 }}>
            <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} variant="fullWidth" sx={{ mb: 3, '& .MuiTabs-indicator': { height: 4, borderRadius: 2 } }}>
              <Tab label="Items Management" icon={<Edit fontSize="small" />} iconPosition="start" sx={{ fontWeight: 600 }} />
              <Tab label="Import Items" icon={<Publish fontSize="small" />} iconPosition="start" sx={{ fontWeight: 600 }} />
            </Tabs>
            {tabValue === 0 ? (
              <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>Menu Items<Chip label={`${items.length} items`} size="small" color="primary" sx={{ ml: 1 }} /></Typography>
                  <Button variant="contained" startIcon={<Add />} onClick={() => { resetForm(); setOpenDialog(true); }} sx={{ borderRadius: 2, px: 3, py: 1, textTransform: 'none', fontWeight: 600, boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}>Add New Item</Button>
                </Box>
                {items.length === 0 ? (
                  <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: theme.palette.background.paper }}>
                    <Typography variant="h6" color="textSecondary" sx={{ mb: 2 }}>No items found</Typography>
                    <Button variant="outlined" startIcon={<Add />} onClick={() => setOpenDialog(true)}>Create your first item</Button>
                  </Paper>
                ) : (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '24px', '& > *': { flex: '1 1 300px', maxWidth: '100%' } }}>
                    {items.map(item => (
                      <StyledCard key={item.id}>
                        <CardContent>
                          <Box display="flex" alignItems="flex-start">
                            <Avatar sx={{ bgcolor: theme.palette.background.paper, mr: 2, mt: 1, color: theme.palette.text.primary }}><TypeIcon type={item.type} /></Avatar>
                            <Box flexGrow={1}>
                              <Box display="flex" justifyContent="space-between">
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>{item.name}</Typography>
                                <IconButton size="small" onClick={() => toggleExpand(item.id)} sx={{ ml: 1 }}>{expandedItems[item.id] ? <ExpandLess /> : <ExpandMore />}</IconButton>
                              </Box>
                              <Typography variant="body2" color="textSecondary">{item.category}</Typography>
                              <PriceChip label={item.code} size="small" variant="outlined" sx={{ mt: 1, fontSize: '0.7rem' }} />
                            </Box>
                          </Box>
                          {expandedItems[item.id] && (
                            <Box sx={{ mt: 2 }}>
                              <Divider sx={{ my: 1 }} />
                              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Sizes & Prices</Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {item.sizes.map((size, i) => (
                                  <PriceChip key={i} label={`${size.name}: ₱${size.price.toFixed(2)}`} variant="outlined" size="small" />
                                ))}
                              </Box>
                              {item.customizations && item.customizations.length > 0 && (
                                <>
                                  <Divider sx={{ my: 2 }} />
                                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Customizations</Typography>
                                  {item.customizations.map((custom, ci) => (
                                    <Box key={ci} sx={{ mb: 1 }}>
                                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{custom.name}</Typography>
                                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, ml: 1 }}>
                                        {custom.options.map((opt, oi) => (
                                          <PriceChip key={oi} label={`${opt.name}${opt.price > 0 ? ` (+₱${opt.price.toFixed(2)})` : ''}`} size="small" sx={{ fontSize: '0.7rem' }} />
                                        ))}
                                      </Box>
                                    </Box>
                                  ))}
                                </>
                              )}
                            </Box>
                          )}
                        </CardContent>
                        <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
                          <IconButton color="primary" onClick={() => handleEditItem(item)} size="small"><Edit fontSize="small" /></IconButton>
                          <IconButton color="error" onClick={() => handleDeleteItem(item.id)} size="small"><Delete fontSize="small" /></IconButton>
                        </CardActions>
                      </StyledCard>
                    ))}
                  </Box>
                )}
              </Box>
            ) : (
              <Box sx={{ mt: 3 }}>
                <Paper sx={{ p: 3, backgroundColor: theme.palette.background.paper }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>Import Items</Typography>
                  <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>Upload a CSV or JSON file to import multiple items at once. The file should include item details like name, type, category, and pricing.</Typography>
                  <Box sx={{ border: `2px dashed ${theme.palette.divider}`, borderRadius: 2, p: 4, textAlign: 'center', backgroundColor: theme.palette.action.hover }}>
                    <Publish fontSize="large" color="action" sx={{ mb: 1 }} />
                    <Typography variant="h6" sx={{ mb: 1 }}>Drag and drop files here</Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>or</Typography>
                    <input accept=".json,.csv" style={{ display: 'none' }} id="upload-file" type="file" onChange={handleFileUpload} />
                    <label htmlFor="upload-file"><Button variant="contained" component="span" startIcon={<Publish />} sx={{ borderRadius: 2, px: 3, py: 1, textTransform: 'none', fontWeight: 600 }}>Select File</Button></label>
                    {file && <Box sx={{ mt: 3 }}><PriceChip label={file.name} onDelete={() => setFile(null)} sx={{ fontWeight: 500 }} /></Box>}
                  </Box>
                  <Box sx={{ mt: 3, p: 2, backgroundColor: theme.palette.background.default, borderRadius: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>File Requirements</Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>• CSV/JSON format with UTF-8 encoding</Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>• Required fields: name, type (food/drink/merchandise)</Typography>
                    <Typography variant="body2">• Optional fields: category, sizes, customizations</Typography>
                  </Box>
                </Paper>
              </Box>
            )}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
              <DialogTitle sx={{ backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText, fontWeight: 600 }}>{currentItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
              <DialogContent sx={{ p: 3 }}>
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
    <Box sx={{ display: 'flex', gap: '24px', pt:'32px' }}>
      <Box sx={{ flex: 1 }}>
        <TextField
          fullWidth
          label="Item Name"
          value={formState.name}
          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
          sx={{ mb: 2 }}
          variant="outlined"
          size="small"
        />
        <FormControl fullWidth sx={{ mb: 2 }} size="small">
          <InputLabel>Item Type</InputLabel>
          <Select
            value={formState.type}
            label="Item Type"
            onChange={(e) => setFormState({ ...formState, type: e.target.value as any })}
            variant="outlined"
          >
            <MenuItem value="drink">Drink</MenuItem>
            <MenuItem value="food">Food</MenuItem>
            <MenuItem value="merchandise">Merchandise</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ mb: 2 }} size="small">
  <InputLabel>Category</InputLabel>
  <Select
    value={formState.category}
    label="Category"
    onChange={(e) => setFormState({ ...formState, category: e.target.value })}
  >
    {categories.map((cat: string, i: number) => (
      <MenuItem key={i} value={cat}>{cat}</MenuItem>
    ))}
  </Select>
</FormControl>
      </Box>
    </Box>
    <Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Sizes</Typography>
      {formState.sizes.map((size, index) => (
        <Box key={index} display="flex" gap={2} sx={{ mb: 2 }} alignItems="center">
          <TextField
            label="Size Name"
            value={size.name}
            onChange={(e) => {
              const newSizes = [...formState.sizes];
              newSizes[index].name = e.target.value;
              setFormState({ ...formState, sizes: newSizes });
            }}
            size="small"
            variant="outlined"
            sx={{ flex: 1 }}
          />
          <TextField
            label="Price"
            type="number"
            value={size.price}
            onChange={(e) => {
              const newSizes = [...formState.sizes];
              newSizes[index].price = parseFloat(e.target.value);
              setFormState({ ...formState, sizes: newSizes });
            }}
            size="small"
            variant="outlined"
            sx={{ flex: 1 }}
            InputProps={{ startAdornment: <InputAdornment position="start">₱</InputAdornment> }}
          />
          <IconButton onClick={() => {
            const newSizes = formState.sizes.filter((_, i) => i !== index);
            setFormState({ ...formState, sizes: newSizes });
          }} color="error" size="small">
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      ))}
      <Button variant="outlined" onClick={() => {
        setFormState({ ...formState, sizes: [...formState.sizes, { name: '', price: 0 }] });
      }} sx={{ mb: 3 }} size="small" startIcon={<Add />}>Add Size</Button>
    </Box>
    <Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Customizations</Typography>
      {formState.customizations.map((customization, cIndex) => (
        <Paper key={cIndex} sx={{ mb: 3, p: 2, borderRadius: 1 }}>
          <Box display="flex" alignItems="center" gap={2} sx={{ mb: 2 }}>
            <TextField
              label="Customization Name"
              value={customization.name}
              onChange={(e) => {
                const newCustomizations = [...formState.customizations];
                newCustomizations[cIndex].name = e.target.value;
                setFormState({ ...formState, customizations: newCustomizations });
              }}
              fullWidth
              size="small"
              variant="outlined"
            />
            <IconButton onClick={() => {
              const newCustomizations = formState.customizations.filter((_, i) => i !== cIndex);
              setFormState({ ...formState, customizations: newCustomizations });
            }} color="error" size="small">
              <Delete fontSize="small" />
            </IconButton>
          </Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 1 }}>Options</Typography>
          {customization.options.map((option, oIndex) => (
            <Box key={oIndex} display="flex" gap={2} sx={{ mb: 1 }} alignItems="center">
              <TextField
                label="Option Name"
                value={option.name}
                onChange={(e) => {
                  const newCustomizations = [...formState.customizations];
                  newCustomizations[cIndex].options[oIndex].name = e.target.value;
                  setFormState({ ...formState, customizations: newCustomizations });
                }}
                size="small"
                variant="outlined"
                sx={{ flex: 2 }}
              />
              <TextField
                label="Price"
                type="number"
                value={option.price}
                onChange={(e) => {
                  const newCustomizations = [...formState.customizations];
                  newCustomizations[cIndex].options[oIndex].price = parseFloat(e.target.value);
                  setFormState({ ...formState, customizations: newCustomizations });
                }}
                size="small"
                variant="outlined"
                sx={{ flex: 1 }}
                InputProps={{ startAdornment: <InputAdornment position="start">₱</InputAdornment> }}
              />
              <IconButton onClick={() => {
                const newCustomizations = [...formState.customizations];
                newCustomizations[cIndex].options = newCustomizations[cIndex].options.filter((_, i) => i !== oIndex);
                setFormState({ ...formState, customizations: newCustomizations });
              }} color="error" size="small">
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          ))}
          <Button variant="outlined" onClick={() => {
            const newCustomizations = [...formState.customizations];
            newCustomizations[cIndex].options.push({ name: '', price: 0 });
            setFormState({ ...formState, customizations: newCustomizations });
          }} sx={{ mt: 1 }} size="small" startIcon={<Add />}>Add Option</Button>
        </Paper>
      ))}
      <Button variant="outlined" onClick={() => {
        setFormState({ ...formState, customizations: [...formState.customizations, { name: '', options: [] }] });
      }} sx={{ mb: 2 }} size="small" startIcon={<Add />}>Add Customization</Button>
    </Box>
  </Box>
</DialogContent>
              <DialogActions sx={{ p: 2 }}>
                <Button onClick={() => setOpenDialog(false)} sx={{ borderRadius: 1 }}>Cancel</Button>
                <Button onClick={currentItem ? handleUpdateItem : handleAddItem} variant="contained" disabled={!formState.name || !formState.category} sx={{ borderRadius: 1 }}>{currentItem ? 'Update Item' : 'Add Item'}</Button>
              </DialogActions>
            </Dialog>
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
              <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%', boxShadow: theme.shadows[3], borderRadius: 1 }}>{snackbar.message}</Alert>
            </Snackbar>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ManagerDashboard;
