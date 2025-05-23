import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SHADOWS } from '../utils/theme';
import { StoreOption } from '../types';

interface StoreSelectionProps {
  stores: StoreOption[];
  onSelectStore: (storeId: string) => void;
  error?: string;
}

const STORE_ICONS: Record<string, string> = {
  'Aliexpress': 'shopping',
  'Daraz': 'shopping-outline',
  'Alfateh': 'store',
  'Foodpanda': 'food',
  'Metro Cash & Carry': 'cart',
};

const StoreSelection: React.FC<StoreSelectionProps> = ({
  stores,
  onSelectStore,
  error,
}) => {
  const renderStoreItem = ({ item }: { item: StoreOption }) => (
    <TouchableOpacity
      style={[styles.storeItem, item.selected && styles.storeItemSelected]}
      onPress={() => onSelectStore(item.id)}
      activeOpacity={0.7}
    >
      <MaterialCommunityIcons
        name={STORE_ICONS[item.name] || 'store'}
        size={24}
        color={item.selected ? COLORS.white : COLORS.text}
      />
      <Text
        style={[styles.storeText, item.selected && styles.storeTextSelected]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Stores</Text>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <FlatList
        data={stores}
        renderItem={renderStoreItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SIZES.base * 2,
  },
  title: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: SIZES.base * 2,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: SIZES.base * 2,
  },
  storeItem: {
    width: '48%',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.base * 2,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
    flexDirection: 'row',
  },
  storeItemSelected: {
    backgroundColor: COLORS.primary,
  },
  storeText: {
    ...FONTS.body2,
    color: COLORS.text,
    marginLeft: SIZES.base,
  },
  storeTextSelected: {
    color: COLORS.white,
  },
  errorText: {
    ...FONTS.small,
    color: COLORS.error,
    marginBottom: SIZES.base,
  },
});

export default StoreSelection; 