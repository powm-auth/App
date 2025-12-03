import {
    BackgroundImage,
    Column,
    PowmIcon,
    PowmText,
    Row
} from '@/components/powm';
import { powmColors, powmRadii, powmSpacing } from '@/theme/powm-tokens';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Clipboard,
    Easing,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Types for account state
type AccountState = 'Secured' | 'Breached' | 'Not Used';

const DetailCard = ({ 
  label, 
  value, 
  description, 
  index 
}: { 
  label: string; 
  value: string; 
  description?: string;
  index: number 
}) => {
  const translateY = useRef(new Animated.Value(20)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 500,
        delay: index * 100,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleCopy = () => {
    Clipboard.setString(value);
    Alert.alert("Copied", `${label} copied to clipboard.`);
  };

  return (
    <Animated.View style={[styles.detailCard, { opacity, transform: [{ translateY }] }]}>
      <Pressable onPress={handleCopy}>
        <Column gap={4}>
          <PowmText variant="text" color={powmColors.inactive} style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
            {label}
          </PowmText>
          <PowmText variant="subtitleSemiBold" style={{ fontSize: 16, fontFamily: 'monospace' }}>
            {value}
          </PowmText>
          {description && (
            <PowmText variant="text" color="rgba(255,255,255,0.4)" style={{ fontSize: 11, marginTop: 4 }}>
              {description}
            </PowmText>
          )}
        </Column>
        <View style={styles.copyIcon}>
          <PowmIcon name="data" size={16} color={powmColors.electricMain} />
        </View>
      </Pressable>
    </Animated.View>
  );
};

export default function AccountScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  // Default state as requested
  const [accountState, setAccountState] = useState<AccountState>('Secured');

  const getStatusColor = (state: AccountState) => {
    switch (state) {
      case 'Secured': return powmColors.activeElectricMain; // Green-ish/Cyan
      case 'Breached': return powmColors.deletionRedHard;
      case 'Not Used': return powmColors.gray;
      default: return powmColors.electricMain;
    }
  };

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
              Account
            </PowmText>
          </Row>

          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={[powmColors.electricMain, 'rgba(20, 18, 28, 0)']}
                style={styles.avatarGradient}
              >
                <View style={styles.avatarInner}>
                  <PowmIcon name="profile" size={64} color="rgba(255,255,255,0.8)" />
                </View>
              </LinearGradient>
            </View>
            <PowmText variant="title" style={{ marginTop: 16 }}>Anonymous User</PowmText>
            <PowmText variant="text" color={powmColors.inactive}>Visible as "Anonymous" to services</PowmText>
          </View>

          <View style={styles.divider} />

          {/* Account Status */}
          <View style={[styles.statusCard, { borderColor: getStatusColor(accountState) + '40' }]}>
            <Row align="center" gap={16}>
              <View style={[styles.statusIcon, { backgroundColor: getStatusColor(accountState) + '20' }]}>
                <PowmIcon 
                  name={accountState === 'Secured' ? 'verified' : accountState === 'Breached' ? 'cross' : 'clock'} 
                  size={24} 
                  color={getStatusColor(accountState)} 
                />
              </View>
              <Column>
                <PowmText variant="text" color={powmColors.inactive} style={{ fontSize: 12 }}>Account State</PowmText>
                <PowmText variant="subtitleSemiBold" style={{ color: getStatusColor(accountState) }}>
                  {accountState}
                </PowmText>
              </Column>
            </Row>
          </View>

          <View style={styles.sectionSpacer} />

          {/* Identification Data */}
          <Column gap={powmSpacing.md}>
            <PowmText variant="subtitle" style={styles.sectionTitle}>Identification</PowmText>
            
            <DetailCard 
              index={0}
              label="Powm ID" 
              value="8f7a-9b2c-4d1e-0f3a" 
              description="The only identifier Powm knows about you."
            />
            
            <DetailCard 
              index={1}
              label="Device ID" 
              value="iPhone15,3-A1B2-C3D4" 
              description="Linked strictly to this hardware."
            />
          </Column>

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
  
  // Profile
  profileSection: { alignItems: 'center', marginVertical: powmSpacing.xl },
  avatarContainer: {
    width: 120, height: 120,
    borderRadius: 60,
    padding: 3, // Border width
    overflow: 'hidden',
  },
  avatarGradient: {
    flex: 1, borderRadius: 60, padding: 3,
  },
  avatarInner: {
    flex: 1, backgroundColor: powmColors.mainBackground, borderRadius: 60,
    alignItems: 'center', justifyContent: 'center',
  },
  
  divider: {
    height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginBottom: powmSpacing.xl,
  },

  // Status
  statusCard: {
    backgroundColor: 'rgba(30, 28, 40, 0.6)',
    borderRadius: powmRadii.xl,
    padding: 16,
    borderWidth: 1,
  },
  statusIcon: {
    width: 48, height: 48, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center',
  },

  sectionSpacer: { height: 32 },
  sectionTitle: { marginLeft: 4, marginBottom: 8, fontSize: 14, textTransform: 'uppercase', letterSpacing: 1, opacity: 0.8 },

  // Details
  detailCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: powmRadii.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    position: 'relative',
  },
  copyIcon: {
    position: 'absolute',
    right: 0, top: 0,
    padding: 16,
    opacity: 0.5,
  },
});