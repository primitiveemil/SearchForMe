import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const COLORS = {
  primary: '#4B68FF',
  secondary: '#FF744B',
  background: '#FFFFFF',
  card: '#F8F8F8',
  text: '#1A1A1A',
  border: '#E0E0E0',
  notification: '#FF4B4B',
  success: '#4BFF7E',
  error: '#FF4B4B',
  warning: '#FFD84B',
  inactive: '#C5C5C5',
  white: '#FFFFFF',
  black: '#000000',
};

export const SIZES = {
  // Global sizes
  base: 8,
  font: 14,
  radius: 12,
  padding: 24,

  // Font sizes
  h1: 30,
  h2: 22,
  h3: 18,
  h4: 16,
  body1: 14,
  body2: 12,
  small: 10,

  // App dimensions
  width,
  height,
};

export const FONTS = {
  h1: { fontFamily: 'System', fontSize: SIZES.h1, fontWeight: '700' },
  h2: { fontFamily: 'System', fontSize: SIZES.h2, fontWeight: '700' },
  h3: { fontFamily: 'System', fontSize: SIZES.h3, fontWeight: '700' },
  h4: { fontFamily: 'System', fontSize: SIZES.h4, fontWeight: '700' },
  body1: { fontFamily: 'System', fontSize: SIZES.body1, fontWeight: '400' },
  body2: { fontFamily: 'System', fontSize: SIZES.body2, fontWeight: '400' },
  small: { fontFamily: 'System', fontSize: SIZES.small, fontWeight: '400' },
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

export default { COLORS, SIZES, FONTS, SHADOWS }; 