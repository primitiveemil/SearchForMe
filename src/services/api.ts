import axios from 'axios';
import { Product } from '../types/product';
import { 
  ShoppingFormData, 
  OSINTFormData, 
  ShoppingSearchResults,
  OSINTSearchResults,
  ShoppingProduct
} from '../types';

// API base URL - change this based on your deployment
const API_BASE_URL = 'http://localhost:3000/api';

// Define response types
export interface ApiResponse<T> {
  success: boolean;
  error?: string;
  count?: number;
  query?: string;
  source?: string;
  products?: Product[];
  sources?: string[];
  [key: string]: any;
}

// Store ID to scraper source mapping
export const storeIdToSource: Record<string, string> = {
  '1': 'aliexpress',
  '2': 'daraz',
  '3': 'alfateh',
  '4': 'foodpanda',
  '5': 'metro'  // Metro Cash & Carry
};

class ProductApiService {
  // Get available sources
  async getSources(): Promise<string[]> {
    try {
      const response = await axios.get<ApiResponse<string[]>>(`${API_BASE_URL}/sources`);
      if (response.data.success) {
        return response.data.sources || [];
      }
      throw new Error(response.data.error || 'Failed to get sources');
    } catch (error) {
      console.error('Error getting sources:', error);
      return [];
    }
  }
  
  // Search all sources
  async searchProducts(query: string): Promise<Product[]> {
    try {
      const response = await axios.get<ApiResponse<Product[]>>(
        `${API_BASE_URL}/search`, 
        { params: { q: query } }
      );
      
      if (response.data.success) {
        return response.data.products || [];
      }
      throw new Error(response.data.error || 'Failed to search products');
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }

  // Search by store ID
  async searchProductsByStoreId(storeId: string, query: string): Promise<Product[]> {
    const source = storeIdToSource[storeId];
    
    if (!source) {
      console.warn(`No source mapping found for store ID: ${storeId}`);
      return [];
    }
    
    return this.searchProductsBySource(source, query);
  }

  // Search specific source
  async searchProductsBySource(source: string, query: string): Promise<Product[]> {
    try {
      console.log(`Searching source: ${source} for query: ${query}`);
      const response = await axios.get<ApiResponse<Product[]>>(
        `${API_BASE_URL}/search/${source}`,
        { params: { q: query } }
      );
      
      if (response.data.success) {
        return response.data.products || [];
      }
      throw new Error(response.data.error || `Failed to search ${source}`);
    } catch (error) {
      console.error(`Error searching ${source}:`, error);
      return [];
    }
  }
}

export const productApiService = new ProductApiService();

/**
 * Generic API request function
 */
const apiRequest = async<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any
): Promise<T> => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    const config: RequestInit = {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

/**
 * Shopping search API call
 */
export const searchShopping = async (
  formData: ShoppingFormData
): Promise<ApiResponse<ShoppingSearchResults>> => {
  try {
    // Try to use the real API for Metro Cash & Carry
    if (formData.selectedStores.includes('5')) {
      try {
        console.log('Using real API for Metro search');
        // Call our backend API for Metro
        const metroProducts = await productApiService.searchProductsByStoreId(
          '5', 
          `${formData.itemName} ${formData.brandName} ${formData.packingSize}`.trim()
        );
        
        if (metroProducts.length > 0) {
          // Convert to expected format
          const metroResults = {
            store: 'Metro Cash & Carry',
            products: metroProducts.map(p => ({
              name: p.name,
              brand: formData.brandName,
              price: p.price,
              url: p.url,
              imageUrl: p.imageUrl,
              description: formData.itemDescription || `${p.name}`
            }))
          };
          
          // Return only Metro results if that's the only store selected
          if (formData.selectedStores.length === 1) {
            return {
              success: true,
              data: {
                results: [metroResults],
                query: formData
              },
              loading: false,
            };
          }
          
          // Otherwise, continue with other stores using mock data
          const otherStores = formData.selectedStores.filter(id => id !== '5');
          const mockResults = mockProductSearch(formData, otherStores);
          
          return {
            success: true,
            data: {
              results: [metroResults, ...mockResults],
              query: formData
            },
            loading: false,
          };
        }
      } catch (error) {
        console.error('Error with real Metro API, falling back to mock data:', error);
        // Fall back to mock data
      }
    }
    
    // Use mock data for all other stores or as fallback
    const results = mockProductSearch(formData, formData.selectedStores);
    
    return {
      success: true,
      data: {
        results,
        query: formData
      },
      loading: false,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      loading: false,
    };
  }
};

// Helper function to generate mock product results
const mockProductSearch = (formData: ShoppingFormData, storeIds: string[]): { store: string; products: ShoppingProduct[] }[] => {
  return storeIds.map(storeId => {
    // Get store name based on storeId
    const storeName = getStoreName(storeId);
    
    // Generate 1-3 mock products
    const numProducts = Math.floor(Math.random() * 3) + 1;
    const products: ShoppingProduct[] = Array.from({ length: numProducts }, (_, index) => {
      const isVariant = index > 0;
      return {
        name: isVariant ? `${formData.itemName} ${['Pro', 'Plus', 'Max'][index - 1]}` : formData.itemName,
        brand: formData.brandName,
        price: `$${(19.99 + Math.random() * 30).toFixed(2)}`,
        url: '#',
        imageUrl: `https://source.unsplash.com/random/200x200/?${encodeURIComponent(formData.itemName)}`,
        description: isVariant ? 
          `Premium version of ${formData.itemName}. ${formData.packingSize}.` : 
          formData.itemDescription || `Standard ${formData.itemName}. ${formData.packingSize}.`
      };
    });
    
    return {
      store: storeName,
      products
    };
  });
};

/**
 * OSINT search API call
 */
export const searchOSINT = async (
  formData: OSINTFormData
): Promise<ApiResponse<OSINTSearchResults>> => {
  try {
    // In a real app, this would be an actual API call
    // For demo purposes, we're simulating a response
    // const data = await apiRequest('/osint/search', 'POST', formData);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock response for demo purposes
    if (formData.searchType === 'phone') {
      return {
        success: true,
        data: {
          type: 'phone',
          data: {
            phoneNumber: formData.searchQuery,
            owner: 'John Doe',
            location: 'New York, USA',
            carrier: 'Verizon',
            type: 'Mobile',
            sources: ['public records', 'white pages', 'social media']
          }
        },
        loading: false,
      };
    } else {
      return {
        success: true,
        data: {
          type: 'person',
          data: {
            name: formData.searchQuery,
            profiles: [
              { platform: 'LinkedIn', url: '#' },
              { platform: 'Twitter', url: '#' },
              { platform: 'Facebook', url: '#' },
              { platform: 'Instagram', url: '#' }
            ],
            emails: ['john.doe@example.com', 'jdoe@business.com'],
            locations: ['New York, USA', 'Previously: Boston, MA']
          }
        },
        loading: false,
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      loading: false,
    };
  }
};

// Helper function to get store name by ID
const getStoreName = (storeId: string): string => {
  const storeMap: Record<string, string> = {
    '1': 'Aliexpress',
    '2': 'Daraz',
    '3': 'Alfateh',
    '4': 'Foodpanda',
    '5': 'Metro Cash & Carry'
  };
  
  return storeMap[storeId] || 'Unknown Store';
}; 