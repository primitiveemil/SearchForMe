import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { COLORS, FONTS, SIZES } from '../utils/theme';

interface FormInputProps extends TextInputProps {
  label: string;
  error?: string;
  required?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  required = false,
  ...props
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      <TextInput
        style={[styles.input, error && styles.inputError, props.multiline && styles.multilineInput]}
        placeholderTextColor={COLORS.inactive}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.base * 2,
  },
  label: {
    ...FONTS.body2,
    color: COLORS.text,
    marginBottom: SIZES.base,
  },
  required: {
    color: COLORS.error,
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.base * 2,
    paddingVertical: SIZES.base * 1.5,
    ...FONTS.body1,
    color: COLORS.text,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  multilineInput: {
    minHeight: SIZES.base * 10,
    textAlignVertical: 'top',
    paddingTop: SIZES.base * 1.5,
  },
  errorText: {
    ...FONTS.small,
    color: COLORS.error,
    marginTop: SIZES.base,
  },
});

export default FormInput; 