export interface User {
  id: number;
  email: string;
}

export interface Expense {
  id: number;
  category: string;
  amount: number;
  amount_type: 'debit' | 'credit';
  date: string;
  created_at?: string;
}

export interface AddExpenseData {
  category: string;
  amount: number;
  amount_type: 'debit' | 'credit';
  date: string;
}

export interface UpdateExpenseData {
  category?: string;
  amount?: number;
  date?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ResetPasswordData {
  email: string;
  newpassword: string;
}

export interface ChatMessage {
  query: string;
}

export interface ChatResponse {
  response: string;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  position: 'before' | 'after';
}

export const CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', position: 'before' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', position: 'before' },
  { code: 'GBP', name: 'British Pound', symbol: '£', position: 'before' },
  { code: 'EUR', name: 'Euro', symbol: '€', position: 'before' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', position: 'before' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', position: 'before' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', position: 'before' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', position: 'before' },
];
