import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Keyboard,
  Alert,
} from 'react-native';
import { OSINTFormData, OSINTSearchType } from '../types';
import { COLORS, FONTS, SIZES, SHADOWS } from '../utils/theme';
import { Button, FormInput, LoadingIndicator, SegmentedControl } from '../components';
import { searchOSINT } from '../services/api';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

type OSINTScreenProps = {
  navigation: StackNavigationProp<RootStackParamList>;
};

const OSINTScreen: React.FC<OSINTScreenProps> = ({ navigation }) => {
  const [searchType, setSearchType] = useState<OSINTSearchType>('phone');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const segmentOptions = [
    { key: 'phone', label: 'Phone Number' },
    { key: 'person', label: 'Person' },
  ];
  
  const validateInput = (): boolean => {
    if (!searchQuery.trim()) {
      setError('Search query cannot be empty');
      return false;
    }
    
    if (searchType === 'phone') {
      // Simple phone validation - can be enhanced based on requirements
      const phoneRegex = /^\+?[0-9]{10,15}$/;
      if (!phoneRegex.test(searchQuery.trim())) {
        setError('Please enter a valid phone number');
        return false;
      }
    }
    
    setError(null);
    return true;
  };
  
  const handleSearch = async () => {
    Keyboard.dismiss();
    
    if (validateInput()) {
      setIsLoading(true);
      
      try {
        const formData: OSINTFormData = {
          searchType,
          searchQuery: searchQuery.trim(),
        };
        
        const response = await searchOSINT(formData);
        setIsLoading(false);
        
        if (response.error) {
          Alert.alert('Error', response.error);
        } else if (response.data) {
          navigation.navigate('OSINTResults', { results: response.data });
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
      {isLoading && <LoadingIndicator fullScreen text="Searching OSINT data..." />}
      
      <View style={styles.container}>
        <SegmentedControl
          options={segmentOptions}
          selectedKey={searchType}
          onSelect={(key) => {
            setSearchType(key as OSINTSearchType);
            setError(null);
          }}
        />
        
        <View style={styles.searchContainer}>
          <FormInput
            label={searchType === 'phone' ? 'Enter Phone Number' : 'Enter Person Name'}
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              if (error) setError(null);
            }}
            placeholder={
              searchType === 'phone'
                ? 'e.g., +1234567890'
                : 'e.g., John Doe'
            }
            keyboardType={searchType === 'phone' ? 'phone-pad' : 'default'}
            error={error || undefined}
            required
          />
          
          <Button
            title="Search"
            onPress={handleSearch}
            disabled={isLoading}
            size="large"
          />
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>OSINT Search Information</Text>
          <Text style={styles.infoText}>
            {searchType === 'phone'
              ? 'Phone number search allows you to find information associated with a specific phone number including owner details, location, and other public records.'
              : 'Person search allows you to find publicly available information about individuals including social profiles, contact details, and other online presence.'}
          </Text>
          <Text style={styles.disclaimerText}>
            Disclaimer: All searches are conducted using publicly available information.
            Please respect privacy and use this tool responsibly.
          </Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SIZES.padding,
  },
  searchContainer: {
    marginBottom: SIZES.padding,
  },
  infoContainer: {
    backgroundColor: COLORS.card,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginTop: SIZES.padding,
    ...SHADOWS.small,
  },
  infoTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: SIZES.base * 2,
  },
  infoText: {
    ...FONTS.body2,
    color: COLORS.text,
    marginBottom: SIZES.base * 2,
  },
  disclaimerText: {
    ...FONTS.small,
    color: COLORS.secondary,
    fontStyle: 'italic',
  },
});

export default OSINTScreen; 