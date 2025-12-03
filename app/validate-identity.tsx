import {
    BackgroundImage,
    Column,
    PowmIcon,
    PowmText,
    Row,
} from '@/components/powm';
import { powmColors, powmRadii, powmSpacing } from '@/theme/powm-tokens';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ValidateIdentityScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // ✅ CORRECT FIX:
  // Using dismissAll() closes all open modals (Validate + Scan) at once
  // and returns you to the root screen (Home) without keeping the "popup" frame.
  const handleReturnHome = () => {
    router.dismissAll();
  };

  return (
    <BackgroundImage>
      <View style={[styles.container, { paddingTop: insets.top + powmSpacing.xl, paddingBottom: insets.bottom + powmSpacing.lg }]}>
        
        <View style={styles.content}>
          {/* Header / Title Section */}
          <Column gap={powmSpacing.sm} style={styles.headerSection}>
             <PowmText variant="title" align="center">
              Instagram wants to{'\n'}know if you're <PowmText variant="title" color={powmColors.electricMain}>+18</PowmText>
            </PowmText>
          </Column>

          <View style={styles.spacer} />

          {/* Question Section */}
          <Column gap={powmSpacing.md}>
            <PowmText variant="subtitle" style={{ fontSize: 20 }}>Do you accept ?</PowmText>
            
            <PowmText variant="text" color={powmColors.inactive} style={styles.descriptionText}>
              Powm will not have any information or a way to link you to this check or this company. Powm respects the <PowmText variant="text" color={powmColors.electricMain}>double anonymat</PowmText>.
            </PowmText>

            <PowmText variant="text" color={powmColors.inactive} style={styles.descriptionText}>
              This is a one shot Identity ticket, it will be used one time by this company and impossible for them to link this information to your identity.
            </PowmText>
            
            <PowmText variant="text" color={powmColors.gray} style={[styles.descriptionText, { marginTop: powmSpacing.sm }]}>
              Do you accept to anonymously provide a Yes or No +18 proof to Instagram ?
            </PowmText>
          </Column>

          <View style={styles.spacer} />

          {/* Action Buttons */}
          <Row gap={powmSpacing.md} style={styles.buttonRow}>
            {/* NO Button */}
            <Pressable 
              style={[styles.button, styles.buttonSecondary]} 
              onPress={handleReturnHome}
            >
              <Row gap={8} align="center">
                <PowmIcon name="cross" size={18} color={powmColors.white} />
                <PowmText variant="subtitleSemiBold">No</PowmText>
              </Row>
            </Pressable>

            {/* YES Button */}
            <Pressable 
              style={[styles.button, styles.buttonPrimary]} 
              onPress={() => {
                console.log("Identity Validated");
                // Add validation logic here if needed
                handleReturnHome();
              }}
            >
              <Row gap={8} align="center">
                <PowmIcon name="check" size={18} color={powmColors.white} />
                <PowmText variant="subtitleSemiBold">Yes</PowmText>
              </Row>
            </Pressable>
          </Row>
        </View>

      </View>
    </BackgroundImage>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: powmSpacing.xl,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerSection: {
    marginTop: powmSpacing.xl,
    alignItems: 'center',
  },
  spacer: {
    flex: 1,
  },
  descriptionText: {
    lineHeight: 20,
  },
  buttonRow: {
    marginBottom: powmSpacing.lg,
  },
  button: {
    flex: 1,
    height: 56,
    borderRadius: powmRadii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSecondary: {
    backgroundColor: powmColors.mainBackgroundAlt,
  },
  buttonPrimary: {
    backgroundColor: powmColors.electricFade,
    borderWidth: 1,
    borderColor: powmColors.electricMain,
  },
});