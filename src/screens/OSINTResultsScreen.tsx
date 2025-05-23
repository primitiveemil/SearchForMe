import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '../utils/theme';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { Button } from '../components';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type OSINTResultsScreenProps = {
  route: RouteProp<RootStackParamList, 'OSINTResults'>;
  navigation: StackNavigationProp<RootStackParamList>;
};

const OSINTResultsScreen: React.FC<OSINTResultsScreenProps> = ({ route, navigation }) => {
  const { results } = route.params;
  
  const renderPhoneResults = () => {
    const { data } = results;
    return (
      <View style={styles.resultContainer}>
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <MaterialCommunityIcons name="phone" size={24} color={COLORS.primary} />
            <Text style={styles.infoTitle}>Phone Information</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Number:</Text>
            <Text style={styles.infoValue}>{data.phoneNumber}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Owner:</Text>
            <Text style={styles.infoValue}>{data.owner}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Location:</Text>
            <Text style={styles.infoValue}>{data.location}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Carrier:</Text>
            <Text style={styles.infoValue}>{data.carrier}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Type:</Text>
            <Text style={styles.infoValue}>{data.type}</Text>
          </View>
        </View>
        
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <MaterialCommunityIcons name="database-search" size={24} color={COLORS.primary} />
            <Text style={styles.infoTitle}>Sources</Text>
          </View>
          
          {data.sources.map((source, index) => (
            <View key={index} style={styles.sourceItem}>
              <MaterialCommunityIcons name="check-circle" size={18} color={COLORS.success} />
              <Text style={styles.sourceText}>{source}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.disclaimerCard}>
          <Text style={styles.disclaimerTitle}>Important Notice</Text>
          <Text style={styles.disclaimerText}>
            The information provided is sourced from publicly available data and may not be 100% accurate or up to date.
            Please use this information responsibly and respect privacy laws in your jurisdiction.
          </Text>
        </View>
      </View>
    );
  };
  
  const renderPersonResults = () => {
    const { data } = results;
    return (
      <View style={styles.resultContainer}>
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <MaterialCommunityIcons name="account" size={24} color={COLORS.primary} />
            <Text style={styles.infoTitle}>Person Information</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name:</Text>
            <Text style={styles.infoValue}>{data.name}</Text>
          </View>
          
          {data.locations.length > 0 && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Location:</Text>
              <View style={styles.multiValueContainer}>
                {data.locations.map((location, index) => (
                  <Text key={index} style={styles.infoValue}>{location}</Text>
                ))}
              </View>
            </View>
          )}
          
          {data.emails.length > 0 && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              <View style={styles.multiValueContainer}>
                {data.emails.map((email, index) => (
                  <Text key={index} style={styles.infoValue}>{email}</Text>
                ))}
              </View>
            </View>
          )}
        </View>
        
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <MaterialCommunityIcons name="web" size={24} color={COLORS.primary} />
            <Text style={styles.infoTitle}>Social Profiles</Text>
          </View>
          
          {data.profiles.map((profile, index) => (
            <TouchableOpacity
              key={index}
              style={styles.profileItem}
              onPress={() => Linking.openURL(profile.url)}
            >
              <MaterialCommunityIcons
                name={getSocialIcon(profile.platform)}
                size={24}
                color={getSocialColor(profile.platform)}
              />
              <Text style={styles.profileText}>{profile.platform}</Text>
              <MaterialCommunityIcons name="open-in-new" size={18} color={COLORS.primary} />
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.disclaimerCard}>
          <Text style={styles.disclaimerTitle}>Important Notice</Text>
          <Text style={styles.disclaimerText}>
            The information provided is sourced from publicly available data and may not be 100% accurate or up to date.
            Please use this information responsibly and respect privacy laws in your jurisdiction.
          </Text>
        </View>
      </View>
    );
  };
  
  // Helper function to get social media icon
  const getSocialIcon = (platform: string): string => {
    const icons: Record<string, string> = {
      'LinkedIn': 'linkedin',
      'Twitter': 'twitter',
      'Facebook': 'facebook',
      'Instagram': 'instagram',
      'YouTube': 'youtube',
      'GitHub': 'github',
      'Reddit': 'reddit',
    };
    
    return icons[platform] || 'web';
  };
  
  // Helper function to get social media brand color
  const getSocialColor = (platform: string): string => {
    const colors: Record<string, string> = {
      'LinkedIn': '#0077B5',
      'Twitter': '#1DA1F2',
      'Facebook': '#4267B2',
      'Instagram': '#E1306C',
      'YouTube': '#FF0000',
      'GitHub': '#333333',
      'Reddit': '#FF4500',
    };
    
    return colors[platform] || COLORS.secondary;
  };
  
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
        <Text style={styles.headerTitle}>OSINT Results</Text>
        <View style={styles.headerRight} />
      </View>
      
      <View style={styles.queryContainer}>
        <Text style={styles.queryType}>
          {results.type === 'phone' ? 'Phone Number Search' : 'Person Search'}
        </Text>
        <Text style={styles.queryText}>
          {results.type === 'phone' ? results.data.phoneNumber : results.data.name}
        </Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {results.type === 'phone' ? renderPhoneResults() : renderPersonResults()}
        
        <Button
          title="New Search"
          onPress={() => navigation.goBack()}
          variant="outline"
          size="medium"
          buttonStyle={styles.newSearchButton}
        />
      </ScrollView>
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
  queryContainer: {
    backgroundColor: COLORS.card,
    padding: SIZES.base * 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    alignItems: 'center',
  },
  queryType: {
    ...FONTS.body2,
    color: COLORS.secondary,
    marginBottom: SIZES.base / 2,
  },
  queryText: {
    ...FONTS.h3,
    color: COLORS.text,
  },
  contentContainer: {
    padding: SIZES.padding,
    paddingBottom: SIZES.padding * 2,
  },
  resultContainer: {
    marginBottom: SIZES.padding,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.base * 2,
    marginBottom: SIZES.base * 2,
    ...SHADOWS.small,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base * 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: SIZES.base,
  },
  infoTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginLeft: SIZES.base,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: SIZES.base * 1.5,
  },
  infoLabel: {
    ...FONTS.body2,
    color: COLORS.secondary,
    width: 80,
  },
  infoValue: {
    ...FONTS.body1,
    color: COLORS.text,
    flex: 1,
  },
  multiValueContainer: {
    flex: 1,
  },
  sourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  sourceText: {
    ...FONTS.body2,
    color: COLORS.text,
    marginLeft: SIZES.base,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  profileText: {
    ...FONTS.body1,
    color: COLORS.text,
    flex: 1,
    marginLeft: SIZES.base,
  },
  disclaimerCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.base * 2,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
  },
  disclaimerTitle: {
    ...FONTS.h4,
    color: COLORS.secondary,
    marginBottom: SIZES.base,
  },
  disclaimerText: {
    ...FONTS.body2,
    color: COLORS.secondary,
  },
  newSearchButton: {
    marginTop: SIZES.padding,
  },
});

export default OSINTResultsScreen; 