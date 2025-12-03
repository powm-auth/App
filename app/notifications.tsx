import {
    BackgroundImage,
    Column,
    PowmIcon,
    PowmText,
    Row,
} from '@/components/powm';
import { powmColors, powmRadii, powmSpacing } from '@/theme/powm-tokens';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  // Notification State (Mock)
  const [isEnabled, setIsEnabled] = useState(true);

  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

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
              Notifications
            </PowmText>
          </Row>

          {/* Notification Settings */}
          <View style={styles.settingCard}>
            <Row align="center" justify="space-between">
              <Row gap={16} align="center">
                <View style={styles.iconCircle}>
                  <PowmIcon name="bell" size={24} color={powmColors.electricMain} />
                </View>
                <Column gap={2}>
                  <PowmText variant="subtitleSemiBold">Push Notifications</PowmText>
                  <PowmText variant="text" color={powmColors.inactive} style={{ fontSize: 12 }}>
                    Receive alerts about your activity
                  </PowmText>
                </Column>
              </Row>
              
              <Switch
                trackColor={{ false: '#3e3e3e', true: powmColors.electricFade }}
                thumbColor={isEnabled ? powmColors.electricMain : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
              />
            </Row>
          </View>

          <PowmText variant="text" color={powmColors.inactive} style={{ marginTop: 16, fontSize: 12, paddingHorizontal: 4 }}>
            Turning this off will disable all push notifications from Powm, including verification requests.
          </PowmText>

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
  settingCard: {
    backgroundColor: 'rgba(30, 28, 40, 0.6)',
    borderRadius: powmRadii.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  iconCircle: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.07)',
    alignItems: 'center', justifyContent: 'center',
  },
});