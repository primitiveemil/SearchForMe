import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Alert,
} from 'react-native';
import { ShoppingFormData, StoreOption } from '../types';
import { COLORS, FONTS, SIZES } from '../utils/theme';
import { Button, FormInput, LoadingIndicator, StoreSelection } from '../components';
import { searchShopping } from '../services/api';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

type ShoppingScreenProps = {
  navigation: StackNavigationProp<RootStackParamList>;
};

const INITIAL_STORES: StoreOption[] = [
  { id: '1', name: 'Aliexpress', icon: 'shopping', selected: false },
  { id: '2', name: 'Daraz', icon: 'shopping-outline', selected: false },
  { id: '3', name: 'Alfateh', icon: 'store', selected: false },
  { id: '4', name: 'Foodpanda', icon: 'food', selected: false },
  { id: '5', name: 'Metro Cash & Carry', icon: 'cart', selected: false },
];

const ShoppingScreen: React.FC<ShoppingScreenProps> = ({ navigation }) => {
  const [formData, setFormData] = useState<ShoppingFormData>({
    itemName: '',
    itemDescription: '',
    brandName: '',
    packingSize: '',
    selectedStores: [],
  });

  const [stores, setStores] = useState<StoreOption[]>(INITIAL_STORES);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ShoppingFormData, string>>>({});

  const handleInputChange = (name: keyof ShoppingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelectStore = (storeId: string) => {
    // Update stores selection state
    setStores(prevStores => {
      return prevStores.map(store => {
        if (store.id === storeId) {
          return { ...store, selected: !store.selected };
        }
        return store;
      });
    });

    // Update form data with selected store ids
    setFormData(prev => {
      const updatedStore = stores.find(s => s.id === storeId);
      let selectedStores = [...prev.selectedStores];
      
      if (updatedStore) {
        const willBeSelected = !updatedStore.selected;
        
        if (willBeSelected && !selectedStores.includes(storeId)) {
          selectedStores.push(storeId);
        } else if (!willBeSelected) {
          selectedStores = selectedStores.filter(id => id !== storeId);
        }
      }
      
      // Clear error if at least one store is selected
      if (selectedStores.length > 0 && errors.selectedStores) {
        setErrors(prev => ({ ...prev, selectedStores: undefined }));
      }
      
      return { ...prev, selectedStores };
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ShoppingFormData, string>> = {};
    
    if (!formData.itemName.trim()) {
      newErrors.itemName = 'Item name is required';
    }
    
    if (!formData.brandName.trim()) {
      newErrors.brandName = 'Brand name is required';
    }
    
    if (!formData.packingSize.trim()) {
      newErrors.packingSize = 'Packing size is required';
    }
    
    if (formData.selectedStores.length === 0) {
      newErrors.selectedStores = 'Please select at least one store';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearch = async () => {
    if (validateForm()) {
      setIsLoading(true);
      
      try {
        const response = await searchShopping(formData);
        setIsLoading(false);
        
        if (response.error) {
          Alert.alert('Error', response.error);
        } else if (response.data) {
          navigation.navigate('ShoppingResults', { results: response.data });
        }
      } catch (error) {
        setIsLoading(false);
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
        console.error('Search error:', error);
      }
    }
  };

  return (
    <>
      {isLoading && <LoadingIndicator fullScreen text="Searching for items..." />}
      
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Item Details</Text>
          
          <FormInput
            label="Item Name"
            value={formData.itemName}
            onChangeText={(value) => handleInputChange('itemName', value)}
            placeholder="Enter item name"
            error={errors.itemName}
            required
          />
          
          <FormInput
            label="Item Description"
            value={formData.itemDescription}
            onChangeText={(value) => handleInputChange('itemDescription', value)}
            placeholder="Enter item description (optional)"
            multiline
            numberOfLines={3}
          />
          
          <FormInput
            label="Brand Name"
            value={formData.brandName}
            onChangeText={(value) => handleInputChange('brandName', value)}
            placeholder="Enter brand name"
            error={errors.brandName}
            required
          />
          
          <FormInput
            label="Packing Size"
            value={formData.packingSize}
            onChangeText={(value) => handleInputChange('packingSize', value)}
            placeholder="Enter packing size (e.g., 250g, 1L)"
            error={errors.packingSize}
            required
          />
          
          <StoreSelection
            stores={stores}
            onSelectStore={handleSelectStore}
            error={errors.selectedStores}
          />
          
          <Button
            title="Search Items"
            onPress={handleSearch}
            disabled={isLoading}
            size="large"
          />
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    paddingBottom: SIZES.padding * 2,
  },
  formContainer: {
    padding: SIZES.padding,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginVertical: SIZES.base * 2,
  },
});

export default ShoppingScreen; 