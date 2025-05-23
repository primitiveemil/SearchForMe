import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '../utils/theme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  loading = false,
  variant = 'primary',
  size = 'medium',
  buttonStyle,
  textStyle,
  ...props
}) => {
  const getButtonStyles = () => {
    let style: ViewStyle = { ...styles.button };

    // Variant styles
    if (variant === 'primary') {
      style = { ...style, ...styles.primaryButton };
    } else if (variant === 'secondary') {
      style = { ...style, ...styles.secondaryButton };
    } else if (variant === 'outline') {
      style = { ...style, ...styles.outlineButton };
    }

    // Size styles
    if (size === 'small') {
      style = { ...style, ...styles.smallButton };
    } else if (size === 'large') {
      style = { ...style, ...styles.largeButton };
    }

    // Disabled state
    if (props.disabled) {
      style = { ...style, ...styles.disabledButton };
    }

    return style;
  };

  const getTextStyles = () => {
    let style = { ...styles.buttonText };

    if (variant === 'primary') {
      style = { ...style, ...styles.primaryText };
    } else if (variant === 'secondary') {
      style = { ...style, ...styles.secondaryText };
    } else if (variant === 'outline') {
      style = { ...style, ...styles.outlineText };
    }

    if (size === 'small') {
      style = { ...style, ...styles.smallText };
    } else if (size === 'large') {
      style = { ...style, ...styles.largeText };
    }

    if (props.disabled) {
      style = { ...style, ...styles.disabledText };
    }

    return style;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyles(), buttonStyle]}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? COLORS.primary : COLORS.white}
          size="small"
        />
      ) : (
        <Text style={[getTextStyles(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    ...SHADOWS.medium,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: COLORS.secondary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
    ...SHADOWS.small,
  },
  smallButton: {
    paddingVertical: SIZES.base,
  },
  largeButton: {
    paddingVertical: SIZES.base * 2.5,
  },
  disabledButton: {
    backgroundColor: COLORS.inactive,
    borderColor: COLORS.inactive,
  },
  buttonText: {
    ...FONTS.body1,
    fontWeight: '600',
  },
  primaryText: {
    color: COLORS.white,
  },
  secondaryText: {
    color: COLORS.white,
  },
  outlineText: {
    color: COLORS.primary,
  },
  smallText: {
    ...FONTS.body2,
  },
  largeText: {
    ...FONTS.h3,
  },
  disabledText: {
    color: COLORS.white,
  },
});

export default Button; 