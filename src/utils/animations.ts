import { Animated, Easing } from 'react-native';

/**
 * Creates a spring animation
 * @param value - Animated value to animate
 * @param toValue - Target value
 * @param useNativeDriver - Whether to use native driver
 * @param callback - Callback after animation completes
 */
export const spring = (
  value: Animated.Value,
  toValue: number,
  useNativeDriver: boolean = true,
  callback?: () => void
) => {
  return Animated.spring(value, {
    toValue,
    useNativeDriver,
    friction: 8,
    tension: 40,
  }).start(callback);
};

/**
 * Creates a timing animation
 * @param value - Animated value to animate
 * @param toValue - Target value
 * @param duration - Animation duration
 * @param useNativeDriver - Whether to use native driver
 * @param callback - Callback after animation completes
 */
export const timing = (
  value: Animated.Value,
  toValue: number,
  duration: number = 300,
  useNativeDriver: boolean = true,
  callback?: () => void
) => {
  return Animated.timing(value, {
    toValue,
    duration,
    easing: Easing.inOut(Easing.ease),
    useNativeDriver,
  }).start(callback);
};

/**
 * Creates a loop animation
 * @param value - Animated value to animate
 * @param config - Loop animation configuration
 */
export const loop = (
  value: Animated.Value,
  config: {
    toValue: number;
    duration: number;
    easing?: Easing.Function;
    useNativeDriver?: boolean;
  }
) => {
  const { toValue, duration, easing = Easing.linear, useNativeDriver = true } = config;
  
  value.setValue(0);
  
  return Animated.loop(
    Animated.timing(value, {
      toValue,
      duration,
      easing,
      useNativeDriver,
    })
  ).start();
};

/**
 * Creates a pulse animation
 * @param value - Animated value to animate
 * @param config - Pulse animation configuration
 */
export const pulse = (
  value: Animated.Value,
  config: {
    minValue: number;
    maxValue: number;
    duration: number;
    useNativeDriver?: boolean;
  }
) => {
  const { minValue, maxValue, duration, useNativeDriver = true } = config;
  
  value.setValue(minValue);
  
  return Animated.loop(
    Animated.sequence([
      Animated.timing(value, {
        toValue: maxValue,
        duration: duration / 2,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver,
      }),
      Animated.timing(value, {
        toValue: minValue,
        duration: duration / 2,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver,
      }),
    ])
  ).start();
}; 