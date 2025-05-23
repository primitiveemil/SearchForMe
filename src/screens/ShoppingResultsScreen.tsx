import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Linking,
  SafeAreaView,
  StatusBar,
  ScrollView
} from 'react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '../utils/theme';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, ShoppingProduct } from '../types';
import { Button, LoadingIndicator } from '../components';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type ShoppingResultsScreenProps = {
  route: RouteProp<RootStackParamList, 'ShoppingResults'>;
  navigation: StackNavigationProp<RootStackParamList>;
};

const ShoppingResultsScreen: React.FC<ShoppingResultsScreenProps> = ({ route, navigation }) => {
  const { results } = route.params;

  const renderProductItem = ({ item }: { item: ShoppingProduct }) => (
    <View style={styles.productCard}>
      <Image
        source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }}
        style={styles.productImage}
        resizeMode="cover"
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productBrand}>{item.brand}</Text>
        <Text style={styles.productPrice}>{item.price}</Text>
        {item.description && (
          <Text style={styles.productDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}
        <TouchableOpacity
          style={styles.productButton}
          onPress={() => Linking.openURL(item.url)}
        >
          <Text style={styles.productButtonText}>View Product</Text>
          <MaterialCommunityIcons name="arrow-right" size={16} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStoreSection = ({ item }) => (
    <View style={styles.storeSection}>
      <View style={styles.storeHeader}>
        <Text style={styles.storeName}>{item.store}</Text>
        <Text style={styles.resultsCount}>{item.products.length} result{item.products.length !== 1 ? 's' : ''}</Text>
      </View>
      <FlatList
        data={item.products}
        renderItem={renderProductItem}
        keyExtractor={(product, index) => `${item.store}-${product.name}-${index}`}
        scrollEnabled={false}
      />
    </View>
  );

  const renderEmptyResults = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons name="search-off" size={80} color={COLORS.inactive} />
      <Text style={styles.emptyTitle}>No Results Found</Text>
      <Text style={styles.emptySubtitle}>
        Try adjusting your search criteria or select different stores.
      </Text>
      <Button
        title="Search Again"
        onPress={() => navigation.goBack()}
        variant="primary"
        size="medium"
        buttonStyle={styles.searchAgainButton}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search Results</Text>
        <View style={styles.headerRight} />
      </View>
      
      <View style={styles.searchSummary}>
        <Text style={styles.searchQuery}>
          {results.query.itemName} {results.query.brandName && `• ${results.query.brandName}`} {results.query.packingSize && `• ${results.query.packingSize}`}
        </Text>
      </View>
      
      {results.results.length === 0 ? (
        renderEmptyResults()
      ) : (
        <FlatList
          data={results.results}
          renderItem={renderStoreSection}
          keyExtractor={(item) => item.store}
          contentContainerStyle={styles.contentContainer}
          ListFooterComponent={() => (
            <Button
              title="New Search"
              onPress={() => navigation.goBack()}
              variant="outline"
              size="medium"
              buttonStyle={styles.newSearchButton}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base * 2,
  },
  backButton: {
    padding: SIZES.base,
  },
  headerTitle: {
    ...FONTS.h2,
    color: COLORS.white,
  },
  headerRight: {
    width: 24,
  },
  searchSummary: {
    backgroundColor: COLORS.card,
    padding: SIZES.base * 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchQuery: {
    ...FONTS.body1,
    color: COLORS.text,
    textAlign: 'center',
  },
  contentContainer: {
    padding: SIZES.padding,
    paddingBottom: SIZES.padding * 2,
  },
  storeSection: {
    marginBottom: SIZES.padding,
  },
  storeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  storeName: {
    ...FONTS.h3,
    color: COLORS.text,
  },
  resultsCount: {
    ...FONTS.body2,
    color: COLORS.secondary,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.base * 2,
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  productImage: {
    width: 120,
    height: 120,
  },
  productInfo: {
    flex: 1,
    padding: SIZES.base * 2,
  },
  productName: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: SIZES.base / 2,
  },
  productBrand: {
    ...FONTS.body2,
    color: COLORS.secondary,
    marginBottom: SIZES.base / 2,
  },
  productPrice: {
    ...FONTS.h3,
    color: COLORS.primary,
    marginBottom: SIZES.base,
  },
  productDescription: {
    ...FONTS.body2,
    color: COLORS.text,
    marginBottom: SIZES.base,
  },
  productButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.base,
    paddingHorizontal: SIZES.base * 2,
    borderRadius: SIZES.radius,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  productButtonText: {
    ...FONTS.body2,
    color: COLORS.white,
    marginRight: SIZES.base,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  emptyTitle: {
    ...FONTS.h2,
    color: COLORS.text,
    marginTop: SIZES.base * 2,
    marginBottom: SIZES.base,
  },
  emptySubtitle: {
    ...FONTS.body1,
    color: COLORS.secondary,
    textAlign: 'center',
    marginBottom: SIZES.padding,
  },
  searchAgainButton: {
    width: '80%',
  },
  newSearchButton: {
    marginTop: SIZES.padding,
  },
});

export default ShoppingResultsScreen; 