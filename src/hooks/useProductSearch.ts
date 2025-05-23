import { useEffect, useState } from 'react';
import { productApiService, storeIdToSource } from '../services/api';
import { Product } from '../types/product';

interface ProductSearchState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

export const useProductSearch = (
  query: string = '', 
  source?: string, 
  storeId?: string
) => {
  const [state, setState] = useState<ProductSearchState>({
    products: [],
    loading: false,
    error: null
  });

  const searchProducts = async (
    searchQuery: string, 
    searchSource?: string, 
    searchStoreId?: string
  ) => {
    if (!searchQuery.trim()) {
      setState({
        products: [],
        loading: false,
        error: null
      });
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      let results: Product[];
      
      // If store ID is provided, use that for search
      if (searchStoreId) {
        console.log(`Searching for store ID: ${searchStoreId}, query: ${searchQuery}`);
        results = await productApiService.searchProductsByStoreId(searchStoreId, searchQuery);
      }
      // If source is provided, search by source
      else if (searchSource) {
        console.log(`Searching for source: ${searchSource}, query: ${searchQuery}`);
        results = await productApiService.searchProductsBySource(searchSource, searchQuery);
      }
      // Otherwise search all sources
      else {
        console.log(`Searching all sources for query: ${searchQuery}`);
        results = await productApiService.searchProducts(searchQuery);
      }
      
      setState({
        products: results,
        loading: false,
        error: null
      });
    } catch (error) {
      setState({
        products: [],
        loading: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    }
  };

  useEffect(() => {
    if (query) {
      if (storeId) {
        searchProducts(query, undefined, storeId);
      } else {
        searchProducts(query, source);
      }
    }
  }, [query, source, storeId]);

  return {
    ...state,
    searchProducts
  };
}; 