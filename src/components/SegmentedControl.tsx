import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '../utils/theme';

interface SegmentOption {
  key: string;
  label: string;
}

interface SegmentedControlProps {
  options: SegmentOption[];
  selectedKey: string;
  onSelect: (key: string) => void;
}

const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  selectedKey,
  onSelect,
}) => {
  const getSelectedIndex = () => {
    return options.findIndex(option => option.key === selectedKey);
  };

  return (
    <View style={styles.container}>
      <View style={styles.segmentedControl}>
        {options.map((option, index) => {
          const isSelected = option.key === selectedKey;
          
          return (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.option,
                isSelected && styles.selectedOption,
                index === 0 && styles.firstOption,
                index === options.length - 1 && styles.lastOption,
              ]}
              onPress={() => onSelect(option.key)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.optionText,
                  isSelected && styles.selectedOptionText,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SIZES.base * 2,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  option: {
    flex: 1,
    paddingVertical: SIZES.base * 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedOption: {
    backgroundColor: COLORS.primary,
  },
  firstOption: {
    borderTopLeftRadius: SIZES.radius,
    borderBottomLeftRadius: SIZES.radius,
  },
  lastOption: {
    borderTopRightRadius: SIZES.radius,
    borderBottomRightRadius: SIZES.radius,
  },
  optionText: {
    ...FONTS.body1,
    color: COLORS.text,
  },
  selectedOptionText: {
    color: COLORS.white,
    fontWeight: '600',
  },
});

export default SegmentedControl; 