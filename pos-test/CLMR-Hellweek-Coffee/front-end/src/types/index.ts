// src/types/index.ts
export interface Customer {
  id?: number;
  firstName: string;
  lastName?: string;
  member: boolean;
  memberId?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
}

export interface Item {
  itemCode: string;
  name: string;
  type: 'DRINK' | 'FOOD' | 'MERCHANDISE';
  category: string;
  basePrice: number;
  sizes: ItemSize[];
  customizations?: ItemCustomization[];
}

export interface ItemSize {
  name: string;
  priceModifier: number;
}

export interface ItemCustomization {
  id: number;
  name: string;
  required: boolean;
  options: CustomizationOption[];
}

export interface CustomizationOption {
  id: number;
  name: string;
  priceModifier: number;
}

export interface TransactionItem {
  type: 'DRINK' | 'FOOD' | 'MERCHANDISE';
  itemCode: string;
  name: string;
  size: string;
  quantity: number;
  customizations: SelectedCustomization[];
  price: number;
}

export interface SelectedCustomization {
  customizationId: number;
  optionId: number;
  name: string;
  optionName: string;
  additionalPrice: number;
}

export interface Transaction {
  id?: number;
  customer?: Customer;
  items: TransactionItem[];
  total: number;
  transactionDate?: string;
}