import {
    BackgroundImage,
    Column,
    PowmIcon,
    PowmIconName,
    PowmText,
    Row,
} from '@/components/powm';
import { powmColors, powmRadii, powmSpacing } from '@/theme/powm-tokens';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Easing,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    UIManager,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Animated Stat Card Component
const StatCard = ({ label, value, icon, index }: { label: string; value: string; icon: PowmIconName; index: number }) => {
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

  return (
    <Animated.View style={[styles.statCard, { opacity, transform: [{ translateY }] }]}>
      <View style={styles.statIcon}>
        <PowmIcon name={icon} size={20} color={powmColors.electricMain} />
      </View>
      <Column>
        <PowmText variant="subtitleSemiBold" style={{ fontSize: 20 }}>{value}</PowmText>
        <PowmText variant="text" color={powmColors.inactive} style={{ fontSize: 12 }}>{label}</PowmText>
      </Column>
    </Animated.View>
  );
};

export default function MyDataScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [isBackupLoading, setIsBackupLoading] = useState(false);

  const handleBackup = () => {
    setIsBackupLoading(true);
    // Simulate upload
    setTimeout(() => {
      setIsBackupLoading(false);
      Alert.alert("Success", "Your encrypted data has been safely uploaded to Powm servers.");
    }, 2000);
  };

  const handleDeleteAll = () => {
    Alert.alert(
      "Delete Everything?",
      "This action is irreversible. All your documents, history, and keys will be wiped from this device.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: () => {
            console.log("Deleting all data...");
            router.replace('/'); 
          }
        }
      ]
    );
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
              My Data
            </PowmText>
          </Row>

          {/* Dashboard Stats */}
          <Row gap={12} style={styles.statsContainer}>
            <StatCard label="Documents" value="3" icon="id" index={0} />
            <StatCard label="Validations" value="12" icon="check" index={1} />
            <StatCard label="Trust Score" value="High" icon="verified" index={2} />
          </Row>

          <View style={styles.sectionSpacer} />

          {/* Recovery Section */}
          <Column gap={powmSpacing.md}>
            <PowmText variant="subtitle" style={styles.sectionTitle}>Recovery & Backup</PowmText>
            
            <View style={styles.cardGroup}>
              {/* Crypto Codes */}
              <Pressable style={styles.actionRow} onPress={() => Alert.alert("Crypto Codes", "A-1234-B-5678-C-9012")}>
                <Row align="center" gap={16}>
                  <View style={[styles.iconCircle, { backgroundColor: 'rgba(255, 154, 46, 0.15)' }]}>
                    <PowmIcon name="data" size={22} color={powmColors.orangeElectricMain} />
                  </View>
                  <Column flex={1}>
                    <PowmText variant="subtitleSemiBold">Crypto Codes</PowmText>
                    <PowmText variant="text" color={powmColors.inactive} style={{ fontSize: 12 }}>
                      View your recovery phrase
                    </PowmText>
                  </Column>
                  <PowmIcon name="chevron" size={16} color={powmColors.inactive} />
                </Row>
              </Pressable>

              <View style={styles.separator} />

              {/* Cloud Backup */}
              <Pressable style={styles.actionRow} onPress={handleBackup}>
                <Row align="center" gap={16}>
                  <View style={[styles.iconCircle, { backgroundColor: 'rgba(96, 107, 226, 0.15)' }]}>
                    {isBackupLoading ? (
                      <PowmIcon name="clock" size={22} color={powmColors.electricMain} />
                    ) : (
                      <PowmIcon name="data" size={22} color={powmColors.electricMain} />
                    )}
                  </View>
                  <Column flex={1}>
                    <PowmText variant="subtitleSemiBold">Encrypted Backup</PowmText>
                    <PowmText variant="text" color={powmColors.inactive} style={{ fontSize: 12 }}>
                      {isBackupLoading ? "Uploading..." : "Upload save to Powm servers"}
                    </PowmText>
                  </Column>
                  <PowmIcon name="chevron" size={16} color={powmColors.inactive} />
                </Row>
              </Pressable>
            </View>
          </Column>

          <View style={styles.sectionSpacer} />

          {/* Danger Zone */}
          <Column gap={powmSpacing.md}>
            <PowmText variant="subtitle" style={[styles.sectionTitle, { color: powmColors.deletionRedHard }]}>Danger Zone</PowmText>
            
            <Pressable style={styles.dangerCard} onPress={handleDeleteAll}>
              <LinearGradient
                colors={['rgba(255, 69, 58, 0.1)', 'rgba(255, 69, 58, 0.05)']}
                style={StyleSheet.absoluteFill}
              />
              <Row align="center" gap={16}>
                <View style={[styles.iconCircle, { backgroundColor: 'rgba(255, 69, 58, 0.2)' }]}>
                  <PowmIcon name="cross" size={22} color={powmColors.deletionRedHard} />
                </View>
                <Column flex={1}>
                  <PowmText variant="subtitleSemiBold" color={powmColors.deletionRedHard}>Delete Everything</PowmText>
                  <PowmText variant="text" color={powmColors.inactive} style={{ fontSize: 12 }}>
                    Wipe all data from this device
                  </PowmText>
                </Column>
              </Row>
            </Pressable>
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
  header: { marginBottom: powmSpacing.xl },
  backButton: {
    width: 40, height: 40,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
  },
  
  // Stats
  statsContainer: { marginBottom: powmSpacing.lg },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(30, 28, 40, 0.6)',
    borderRadius: powmRadii.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  statIcon: { marginBottom: 8, opacity: 0.8 },
  
  // Sections
  sectionSpacer: { height: 32 },
  sectionTitle: { marginLeft: 4, marginBottom: 8, fontSize: 14, textTransform: 'uppercase', letterSpacing: 1, opacity: 0.8 },
  
  // Card Group (Recovery)
  cardGroup: {
    backgroundColor: 'rgba(30, 28, 40, 0.6)',
    borderRadius: powmRadii.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
  },
  actionRow: {
    padding: 16,
    // active opacity handled by pressable default on some systems, can add style if needed
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginLeft: 72, // Icon width + gap
  },
  iconCircle: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
  },

  // Danger Zone
  dangerCard: {
    borderRadius: powmRadii.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 69, 58, 0.3)',
    overflow: 'hidden',
    padding: 16,
  },
});