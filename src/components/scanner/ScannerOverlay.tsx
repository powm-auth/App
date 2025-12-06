import React from 'react';
import { StyleSheet, View } from 'react-native';

interface ScannerOverlayProps {
  windowSize: number;
  windowHeight?: number; // Optional, defaults to square if not provided
  children?: React.ReactNode; // For the laser or corners
  topContent?: React.ReactNode;
  bottomContent?: React.ReactNode;
}

export const ScannerOverlay: React.FC<ScannerOverlayProps> = ({ 
  windowSize, 
  windowHeight, 
  children,
  topContent,
  bottomContent
}) => {
  const height = windowHeight || windowSize;

  return (
    <View style={StyleSheet.absoluteFill}>
      <View style={styles.mask} />
      
      <View style={styles.centerRow}>
        <View style={styles.mask} />
        <View style={{ width: windowSize, height: height }}>
          {children}
        </View>
        <View style={styles.mask} />
      </View>

      <View style={styles.maskBottom}>
        {bottomContent}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mask: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)' }, // Use token here ideally
  centerRow: { flexDirection: 'row' },
  maskBottom: { flex: 1.2, backgroundColor: 'rgba(0, 0, 0, 0.7)', alignItems: 'center' }
});