import { powmColors, powmSpacing } from '@/theme/powm-tokens';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { PowmIcon } from './PowmIcon';
import { PowmText } from './PowmText';
import { Row } from './Row';

interface ScreenHeaderProps {
  title: string;
  showBack?: boolean;
  rightAction?: React.ReactNode; 
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({ 
  title, 
  showBack = true,
  rightAction 
}) => {
  const router = useRouter();

  return (
    <Row align="center" style={styles.header}>
      {showBack ? (
        <Pressable 
          onPress={() => router.back()} 
          hitSlop={10} 
          style={styles.backButton}
        >
          <PowmIcon name="chevron" size={24} color={powmColors.white} style={{ transform: [{ rotate: '180deg' }] }} />
        </Pressable>
      ) : (
        <View style={styles.placeholder} />
      )}
      
      <PowmText variant="title" style={styles.title}>
        {title}
      </PowmText>
      
      {/* Balance the header: either show action or an empty spacer */}
      <View style={styles.rightContainer}>
        {rightAction || <View style={styles.placeholder} />}
      </View>
    </Row>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: powmSpacing.xl,
    height: 44,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
  },
  placeholder: {
    width: 40,
  },
  rightContainer: {
    minWidth: 40,
    alignItems: 'flex-end',
  },
  title: {
    flex: 1,
    textAlign: 'center',
  }
});