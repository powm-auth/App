import {
    BackgroundImage,
    Column,
    PowmIcon,
    PowmIconName,
    PowmText,
    Row,
} from '@/components/powm';
import { powmColors, powmRadii, powmSpacing } from '@/theme/powm-tokens';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    LayoutAnimation,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    UIManager,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Document {
  id: string;
  type: string;
  status: 'Used' | 'Revoked';
  icon: PowmIconName;
}

export default function IdentityDocumentsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const [documents, setDocuments] = useState<Document[]>([
    { id: '1', type: 'Identity Card', status: 'Used', icon: 'id' },
    { id: '2', type: 'Passport', status: 'Used', icon: 'flag' }, // Using 'flag' as passport placeholder
    { id: '3', type: 'Driving License', status: 'Used', icon: 'data' },
  ]);

  const handleRevoke = (id: string) => {
    Alert.alert(
      "Revoke Document",
      "Are you sure you want to revoke this document? It will no longer be used for proofs.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Revoke", 
          style: "destructive", 
          onPress: () => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setDocuments(prev => prev.filter(doc => doc.id !== id));
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
              Documents
            </PowmText>
          </Row>

          <View style={styles.listContainer}>
            {documents.map((doc) => (
              <View key={doc.id} style={styles.docCard}>
                <Row align="center" gap={16}>
                  <View style={styles.iconCircle}>
                    <PowmIcon name={doc.icon} size={24} color={powmColors.electricMain} />
                  </View>
                  <Column flex={1} gap={2}>
                    <PowmText variant="subtitleSemiBold">{doc.type}</PowmText>
                    <Row align="center" gap={6}>
                      <View style={styles.activeDot} />
                      <PowmText variant="text" color={powmColors.inactive} style={{ fontSize: 12 }}>
                        {doc.status}
                      </PowmText>
                    </Row>
                  </Column>
                  <Pressable 
                    onPress={() => handleRevoke(doc.id)}
                    style={styles.revokeButton}
                  >
                    <PowmText variant="text" style={{ fontSize: 12, color: powmColors.deletionRedHard, fontWeight: '600' }}>
                      Revoke
                    </PowmText>
                  </Pressable>
                </Row>
              </View>
            ))}
            
            {documents.length === 0 && (
              <View style={styles.emptyState}>
                <PowmText variant="text" color={powmColors.gray}>No documents found.</PowmText>
              </View>
            )}
          </View>

          {/* Privacy Disclaimer */}
          <View style={styles.disclaimerContainer}>
            <PowmIcon name="check" size={32} color={powmColors.electricMain} style={{ marginBottom: 12, opacity: 0.8 }} />
            <PowmText variant="text" color={powmColors.gray} align="center" style={styles.disclaimerText}>
              Powm doesn't store your documents. We just store an authentication proof on your side on your mobile phone, completely encrypted.
            </PowmText>
          </View>

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
  listContainer: { gap: powmSpacing.md, marginBottom: powmSpacing.xxl },
  docCard: {
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
  activeDot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: powmColors.activeElectricMain,
  },
  revokeButton: {
    paddingHorizontal: 12, paddingVertical: 6,
    backgroundColor: 'rgba(255, 69, 58, 0.1)',
    borderRadius: 12,
  },
  emptyState: { padding: 20, alignItems: 'center' },
  disclaimerContainer: {
    marginTop: 'auto',
    padding: 24,
    backgroundColor: 'rgba(160, 107, 255, 0.05)',
    borderRadius: powmRadii.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(160, 107, 255, 0.1)',
  },
  disclaimerText: {
    lineHeight: 20,
    fontSize: 13,
  },
});