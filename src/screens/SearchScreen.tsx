import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Linking,
  SafeAreaView,
  Platform
} from 'react-native';
import { useProductSearch } from '../hooks/useProductSearch';
import { Product } from '../types/product';
import { storeIdToSource } from '../services/api';

const SearchScreen: React.FC = () => {
  const [query, setQuery] = useState('');
  const [activeSource, setActiveSource] = useState<string | undefined>(undefined);
  const [activeStoreId, setActiveStoreId] = useState<string | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Use our custom hook for product search
  const { products, loading, error, searchProducts } = useProductSearch();
  
  // Available sources including Metro
  const sources = ['All Sources', 'amazon', 'walmart', 'ebay', 'metro'];
  
  // Store IDs for special searches
  const stores = [
    { id: '5', name: 'Metro Cash & Carry' }
  ];
  
  const handleSearch = () => {
    if (!query.trim()) return;
    
    setSearchTerm(query);
    
    // If we have a specific store ID selected
    if (activeStoreId) {
      searchProducts(query, undefined, activeStoreId);
      return;
    }
    
    // Otherwise search by source
    const source = activeSource === 'All Sources' ? undefined : activeSource;
    searchProducts(query, source);
  };
  
  const selectSource = (source: string) => {
    // Reset any active store ID when selecting a source
    setActiveStoreId(undefined);
    
    const selectedSource = source === 'All Sources' ? undefined : source;
    setActiveSource(source);
    
    // If there's an active search term, update results
    if (searchTerm) {
      searchProducts(searchTerm, selectedSource);
    }
  };
  
  const selectStore = (storeId: string) => {
    // Reset any active source when selecting a store
    setActiveSource(undefined);
    setActiveStoreId(storeId);
    
    // If there's an active search term, update results
    if (searchTerm) {
      searchProducts(searchTerm, undefined, storeId);
    }
  };
  
  const renderProductItem = ({ item }: { item: Product }) => (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => Linking.openURL(item.url)}
    >
      <Image 
        source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }} 
        style={styles.productImage}
        resizeMode="contain"
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.productPrice}>{item.price}</Text>
        <Text style={styles.productSource}>Source: {item.source}</Text>
      </View>
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Product Search</Text>
        <Text style={styles.subtitle}>Find the best prices across multiple sites</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for products..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={handleSearch}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Search by Source</Text>
        <FlatList
          data={sources}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.sourceButton,
                activeSource === item && styles.activeSourceButton
              ]}
              onPress={() => selectSource(item)}
            >
              <Text style={[
                styles.sourceButtonText,
                activeSource === item && styles.activeSourceButtonText
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
        />
      </View>
      
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Search by Store</Text>
        <FlatList
          data={stores}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.storeButton,
                activeStoreId === item.id && styles.activeStoreButton
              ]}
              onPress={() => selectStore(item.id)}
            >
              <Text style={[
                styles.storeButtonText,
                activeStoreId === item.id && styles.activeStoreButtonText
              ]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A80F0" />
          <Text style={styles.loadingText}>Searching products...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={handleSearch}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {searchTerm && (
            <Text style={styles.resultsText}>
              {products.length} results for "{searchTerm}"
              {activeStoreId ? ` in ${stores.find(s => s.id === activeStoreId)?.name}` : ''}
              {activeSource && activeSource !== 'All Sources' ? ` from ${activeSource}` : ''}
            </Text>
          )}
          
          <FlatList
            data={products}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.productsList}
            ListEmptyComponent={
              searchTerm ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No products found</Text>
                  <Text style={styles.emptySubtext}>Try a different search term or source</Text>
                </View>
              ) : (
                <View style={styles.initialContainer}>
                  <Text style={styles.initialText}>Search for products to get started</Text>
                </View>
              )
            }
          />
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  searchInput: {
    flex: 1,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 16,
  },
  searchButton: {
    marginLeft: 8,
    backgroundColor: '#4A80F0',
    borderRadius: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  sourceButton: {
    marginRight: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  activeSourceButton: {
    backgroundColor: '#4A80F0',
  },
  sourceButtonText: {
    fontWeight: '500',
    color: '#4B5563',
  },
  activeSourceButtonText: {
    color: '#FFFFFF',
  },
  storeButton: {
    marginRight: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeStoreButton: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  storeButtonText: {
    fontWeight: '500',
    color: '#4B5563',
  },
  activeStoreButtonText: {
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#4A80F0',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  resultsText: {
    paddingHorizontal: 20,
    marginBottom: 10,
    fontSize: 16,
    color: '#374151',
  },
  productsList: {
    padding: 20,
    paddingTop: 0,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A80F0',
    marginTop: 4,
  },
  productSource: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  emptySubtext: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  initialContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 120,
  },
  initialText: {
    fontSize: 16,
    color: '#6B7280',
  },
});

export default SearchScreen; 