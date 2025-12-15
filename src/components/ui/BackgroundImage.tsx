import { powmColors } from '@/theme/powm-tokens';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Animated, ImageBackground, ImageSourcePropType, ImageStyle, StyleSheet, ViewStyle } from 'react-native';

const AnimatedImageBackground = Animated.createAnimatedComponent(ImageBackground);

/**
 * BackgroundImage Component
 *
 * Powm gradient background image that gives the app its signature look.
 * Uses the powm_draw.png illustration as a repeating/covering background.
 *
 * @example
 * <BackgroundImage>
 *   <View>Your content</View>
 * </BackgroundImage>
 */

export interface BackgroundImageProps {
  children: React.ReactNode;
  style?: ViewStyle;
  imageStyle?: any; // Allow animated values
  gradient?: boolean;
  gradientOpacity?: number;
  source?: ImageSourcePropType;
}

export const BackgroundImage: React.FC<BackgroundImageProps> = ({
  children,
  style,
  imageStyle,
  gradient = true,
  gradientOpacity = 0.45,
  source
}) => {
  return (
    <AnimatedImageBackground
      source={source || require('@/assets/powm/illustrations/powm_draw.png')}
      style={[styles.background, style]}
      resizeMode="cover"
      imageStyle={[styles.image, imageStyle]}
    >
      {gradient && (
        <LinearGradient
          colors={[`rgba(0, 0, 0, ${gradientOpacity})`, powmColors.mainBackground]}
          locations={[0, 1]}
          style={styles.gradient}
        />
      )}
      {children}
    </AnimatedImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: powmColors.mainBackground,
  },
  image: {
    opacity: 1, // Very subtle opacity
    top: 'auto', // Position in lower portion of screen
    bottom: 'auto',
    left: 'auto',
    right: 'auto',
    transform: [
      { translateX: -1000 },
      { translateY: -500 }, // Move image up by 100 pixels
      { scale: 1 }, // Slight zoom in for better coverage
    ],
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
});
