import {
  AnimatedEntry,
  BackgroundImage,
  Button,
  GlassCard,
  PowmText,
  ScreenHeader
} from '@/components';
import { loadWallet } from '@/services/wallet-storage';
import { powmColors, powmSpacing } from '@/theme/powm-tokens';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const InfoItem = ({ label, value, index }: { label: string; value: string; index: number }) => {
  return (
    <AnimatedEntry index={index} slideDistance={20}>
      <View style={styles.infoItem}>
        <PowmText variant="text" color={powmColors.inactive} style={{ fontSize: 13, marginBottom: 4, textTransform: 'capitalize' }}>
          {label.replace(/_/g, ' ')}
        </PowmText>
        <PowmText variant="subtitleSemiBold" style={{ fontSize: 16 }}>
          {value}
        </PowmText>
      </View>
    </AnimatedEntry>
  );
};

export default function PersonalInfoScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [attributes, setAttributes] = useState<Record<string, { value: string; salt: string }> | null>(null);

  useEffect(() => {
    loadWallet().then(wallet => {
      if (wallet) {
        setAttributes(wallet.attributes);
      }
    });
  }, []);

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
          <ScreenHeader title="Identity" />

          <PowmText variant="text" color={powmColors.inactive} align="center" style={{ marginBottom: powmSpacing.xl }}>
            Information extracted from your documents
          </PowmText>

          {attributes && Object.keys(attributes).length > 0 ? (
            <GlassCard style={{ marginBottom: powmSpacing.xl }}>
              {Object.entries(attributes).map(([key, data], index) => (
                <React.Fragment key={key}>
                  <InfoItem label={key} value={data.value} index={index} />
                  {index < Object.keys(attributes).length - 1 && <View style={styles.separator} />}
                </React.Fragment>
              ))}
            </GlassCard>
          ) : (
            <GlassCard style={{ marginBottom: powmSpacing.xl, alignItems: 'center', padding: powmSpacing.xl }}>
              <PowmText variant="text" color={powmColors.inactive}>
                No identity attributes found.
              </PowmText>
            </GlassCard>
          )}

          <Button
            title="Scan new document"
            icon="qrcode"
            onPress={() => router.push('/scan-document')}
          />

        </ScrollView>
      </View>
    </BackgroundImage>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  content: { paddingHorizontal: powmSpacing.lg },
  infoItem: {
    paddingVertical: 12,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
});
