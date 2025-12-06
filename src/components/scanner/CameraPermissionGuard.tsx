import { PowmIcon, PowmText } from '@/components';
import { powmColors, powmRadii, powmSpacing } from '@/theme/powm-tokens';
import { useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CameraPermissionGuardProps {
  children: React.ReactNode;
}

export const CameraPermissionGuard: React.FC<CameraPermissionGuardProps> = ({ children }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <PowmText variant="subtitle" align="center" style={styles.text}>
          We need your permission to use the camera
        </PowmText>
        <Pressable style={styles.button} onPress={requestPermission}>
           <PowmText variant="subtitleSemiBold">Grant Permission</PowmText>
        </Pressable>
        <Pressable 
          style={[styles.close, { top: insets.top + 16 }]} 
          onPress={() => router.back()}
        >
          <PowmIcon name="cross" size={24} color={powmColors.white} />
        </Pressable>
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: powmColors.mainBackground, justifyContent: 'center', alignItems: 'center' },
  text: { marginBottom: powmSpacing.md },
  button: { backgroundColor: powmColors.electricMain, padding: powmSpacing.md, borderRadius: powmRadii.md },
  close: { position: 'absolute', left: 24, padding: 8 }
});