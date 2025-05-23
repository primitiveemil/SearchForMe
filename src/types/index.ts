// Navigation Types
export type RootStackParamList = {
  Main: undefined;
  ShoppingResults: { results: ShoppingSearchResults };
  OSINTResults: { results: OSINTSearchResults };
};

export type BottomTabParamList = {
  Shopping: undefined;
  OSINT: undefined;
};

// Shopping Types
export interface StoreOption {
  id: string;
  name: string;
  icon: string;
  selected: boolean;
}

export interface ShoppingFormData {
  itemName: string;
  itemDescription: string;
  brandName: string;
  packingSize: string;
  selectedStores: string[];
}

export interface ShoppingProduct {
  name: string;
  brand: string;
  price: string;
  url: string;
  imageUrl?: string;
  description?: string;
}

export interface StoreResults {
  store: string;
  products: ShoppingProduct[];
}

export interface ShoppingSearchResults {
  results: StoreResults[];
  query: ShoppingFormData;
}

// OSINT Types
export type OSINTSearchType = 'phone' | 'person';

export interface OSINTFormData {
  searchType: OSINTSearchType;
  searchQuery: string;
}

export interface OSINTPhoneResult {
  phoneNumber: string;
  owner: string;
  location: string;
  carrier: string;
  type: string;
  sources: string[];
}

export interface OSINTPersonResult {
  name: string;
  profiles: { platform: string; url: string }[];
  emails: string[];
  locations: string[];
}

export type OSINTSearchResults = {
  type: 'phone';
  data: OSINTPhoneResult;
} | {
  type: 'person';
  data: OSINTPersonResult;
};

// Shared Types
export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  loading: boolean;
} 