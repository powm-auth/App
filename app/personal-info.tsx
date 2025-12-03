import {
    BackgroundImage,
    PowmIcon,
    PowmText,
    Row
} from '@/components/powm';
import { powmColors, powmRadii, powmSpacing } from '@/theme/powm-tokens';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Easing,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const InfoItem = ({ label, value, index }: { label: string; value: string; index: number }) => {
  const translateY = useRef(new Animated.Value(20)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 500,
        delay: index * 80,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.infoItem, { opacity, transform: [{ translateY }] }]}>
      <PowmText variant="text" color={powmColors.inactive} style={{ fontSize: 13, marginBottom: 4 }}>
        {label}
      </PowmText>
      <PowmText variant="subtitleSemiBold" style={{ fontSize: 16 }}>
        {value}
      </PowmText>
    </Animated.View>
  );
};

export default function PersonalInfoScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const userInfo = [
    { label: 'First Name', value: 'John' },
    { label: 'Last Name', value: 'Doe' },
    { label: 'Date of Birth', value: '12 / 05 / 1990' },
    { label: 'Nationality', value: 'French' },
    { label: 'Address', value: '123 Avenue des Champs-Élysées, Paris' },
  ];

  return (
    <BackgroundImage>
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.content,
            { paddingTop: insets.top + powmSpacing.lg, paddingBottom: insets.bottom + powmSpacing.xl },
          ]}
        >
          {/* Header */}
          <Row align="center" style={styles.header}>
            <Pressable onPress={() => router.back()} hitSlop={10} style={styles.backButton}>
              <PowmIcon name="chevron" size={24} color={powmColors.white} style={{ transform: [{ rotate: '180deg' }] }} />
            </Pressable>
            <PowmText variant="title" style={{ flex: 1, textAlign: 'center', marginRight: 40 }}>
              Personal Info
            </PowmText>
          </Row>

          <PowmText variant="text" color={powmColors.inactive} align="center" style={{ marginBottom: powmSpacing.xl }}>
            Information extracted from your documents
          </PowmText>

          {/* Info Card */}
          <View style={styles.cardContainer}>
            {userInfo.map((item, index) => (
              <React.Fragment key={item.label}>
                <InfoItem label={item.label} value={item.value} index={index} />
                {index < userInfo.length - 1 && <View style={styles.separator} />}
              </React.Fragment>
            ))}
          </View>

          {/* Scan / Update Button */}
          <Pressable 
            style={styles.scanButton}
            onPress={() => router.push('/scan-document')}
          >
            <Row gap={12} align="center">
              <PowmIcon name="qrcode" size={20} color={powmColors.white} />
              <PowmText variant="subtitleSemiBold">Scan new document</PowmText>
            </Row>
          </Pressable>

        </ScrollView>
      </View>
    </BackgroundImage>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  content: { paddingHorizontal: powmSpacing.lg },
  header: { marginBottom: powmSpacing.md },
  backButton: {
    width: 40, height: 40,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
  },
  cardContainer: {
    backgroundColor: 'rgba(30, 28, 40, 0.6)',
    borderRadius: powmRadii.xl,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: powmSpacing.xl,
  },
  infoItem: {
    paddingVertical: 12,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  scanButton: {
    height: 56,
    backgroundColor: powmColors.electricFade,
    borderRadius: powmRadii.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(160, 107, 255, 0.3)',
  },
});