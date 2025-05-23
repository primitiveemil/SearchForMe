import { useState } from 'react';
import { ValidationError } from '../types';

type ValidationRule<T> = {
  isValid: (value: any, formData: T) => boolean;
  message: string;
};

type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule<T>[];
};

export const useFormValidation = <T extends Record<string, any>>(
  initialData: T,
  validationRules: ValidationRules<T>
) => {
  const [formData, setFormData] = useState<T>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const validateField = (fieldName: keyof T): boolean => {
    const fieldRules = validationRules[fieldName];

    if (!fieldRules) return true;

    for (const rule of fieldRules) {
      if (!rule.isValid(formData[fieldName], formData)) {
        setErrors(prev => ({ ...prev, [fieldName]: rule.message }));
        return false;
      }
    }

    // Clear error if field is valid
    setErrors(prev => ({ ...prev, [fieldName]: undefined }));
    return true;
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors: Partial<Record<keyof T, string>> = {};

    // Validate each field with rules
    for (const fieldName in validationRules) {
      const fieldRules = validationRules[fieldName as keyof T];
      
      if (!fieldRules) continue;
      
      for (const rule of fieldRules) {
        if (!rule.isValid(formData[fieldName as keyof T], formData)) {
          newErrors[fieldName as keyof T] = rule.message;
          isValid = false;
          break;
        }
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (fieldName: keyof T, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [fieldName]: value };
      return newData;
    });
    
    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: undefined }));
    }
  };

  const resetForm = () => {
    setFormData(initialData);
    setErrors({});
  };

  return {
    formData,
    errors,
    setFormData,
    handleInputChange,
    validateField,
    validateForm,
    resetForm,
  };
};

export default useFormValidation; 