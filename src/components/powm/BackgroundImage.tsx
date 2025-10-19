import React from 'react';
import { ImageBackground, StyleSheet, ViewStyle } from 'react-native';
import { powmColors } from '@/theme/powm-tokens';

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
}

export const BackgroundImage: React.FC<BackgroundImageProps> = ({ children, style }) => {
  return (
    <ImageBackground
      source={require('@/assets/powm/illustrations/powm_draw.png')}
      style={[styles.background, style]}
      resizeMode="cover"
      imageStyle={styles.image}
    >
      {children}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: powmColors.mainBackground,
  },
  image: {
    opacity: 0.6, // Adjust opacity so text remains readable
  },
});
