import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  PowmText,
  PowmIcon,
  Card,
  Row,
  Column,
  FootBar,
  BackgroundImage,
} from '@/components/powm';
import { powmColors, powmSpacing, powmRadii } from '@/theme/powm-tokens';

/**
 * Home Screen
 *
 * Main landing page of Powm app.
 * Features:
 * - QR Code Scanner section
 * - ID Tickets list
 * - Navigation to scanning/creating tickets
 */
export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <BackgroundImage>
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.content, { paddingTop: insets.top + powmSpacing.lg }]}
        >
        {/* Header with Welcome and Bell */}
        <Row justify="space-between" align="center" style={styles.header}>
          <PowmText variant="title">Welcome</PowmText>
          <Pressable style={styles.bellButton}>
            <PowmIcon name="bell" size={24} color={powmColors.white} />
          </Pressable>
        </Row>

        {/* QR Code Scanner Card */}
        <Card style={styles.qrCard}>
          <Column gap={powmSpacing.md}>
            <PowmText variant="text" color={powmColors.inactive}>
              Prove your age or identity
            </PowmText>
            <PowmText variant="subtitle">QRcode Scanner</PowmText>
            <PowmText variant="text" color={powmColors.inactive}>
              Website requests you to scan to prove your age to access.
            </PowmText>

            {/* QR Code Icon */}
            <View style={styles.qrIconContainer}>
              <View style={styles.qrIcon}>
                <PowmIcon name="qrcode" size={80} color={powmColors.gray} />
              </View>
            </View>
          </Column>
        </Card>

        {/* ID Tickets Section */}
        <Column gap={powmSpacing.sm} style={styles.ticketsSection}>
          <PowmText variant="subtitle">ID Tickets</PowmText>

          {/* Scan an ID Ticket */}
          <Card
            onPress={() => console.log('Scan ID Ticket')}
            style={styles.ticketCard}
          >
            <Row gap={powmSpacing.base} align="center">
              <View style={[styles.ticketIcon, { backgroundColor: powmColors.activeElectricMain }]}>
                <PowmIcon name="qrcode" size={24} color={powmColors.white} />
              </View>
              <Column flex={1}>
                <PowmText variant="subtitleSemiBold">Scan an ID Ticket</PowmText>
                <PowmText variant="text" color={powmColors.inactive}>
                  Check info from a QRCode
                </PowmText>
              </Column>
            </Row>
          </Card>

          {/* Name Ticket */}
          <Card
            onPress={() => console.log('Name ticket')}
            style={styles.ticketCard}
          >
            <Row gap={powmSpacing.base} align="center" justify="space-between">
              <Row gap={powmSpacing.base} align="center" flex={1}>
                <View style={[styles.ticketIcon, { backgroundColor: powmColors.electricMain }]}>
                  <PowmIcon name="face" size={24} color={powmColors.white} />
                </View>
                <Column flex={1}>
                  <PowmText variant="subtitleSemiBold">Name</PowmText>
                  <PowmText variant="text" color={powmColors.inactive}>
                    First and Lastname Proof
                  </PowmText>
                </Column>
              </Row>
              <Row gap={4} align="center">
                <PowmText variant="text" color={powmColors.activeElectricMain}>
                  see
                </PowmText>
                <PowmIcon name="qrcode" size={14} color={powmColors.activeElectricMain} />
              </Row>
            </Row>
          </Card>

          {/* Create an ID Ticket */}
          <Card
            onPress={() => console.log('Create ID Ticket')}
            style={styles.ticketCard}
          >
            <Row gap={powmSpacing.base} align="center">
              <View style={[styles.ticketIcon, { backgroundColor: '#B8860B' }]}>
                <PowmIcon name="add" size={24} color={powmColors.white} />
              </View>
              <Column flex={1}>
                <PowmText variant="subtitleSemiBold">Create an ID Ticket</PowmText>
                <PowmText variant="text" color={powmColors.inactive}>
                  Prove your identity to someone
                </PowmText>
              </Column>
            </Row>
          </Card>
        </Column>
        </ScrollView>

        {/* Bottom Navigation */}
        <FootBar />
      </View>
    </BackgroundImage>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: powmSpacing.lg,
    paddingBottom: powmSpacing.xxl,
  },
  header: {
    marginBottom: powmSpacing.xl,
  },
  bellButton: {
    width: 48,
    height: 48,
    borderRadius: powmRadii.full,
    backgroundColor: powmColors.mainBackgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCard: {
    marginBottom: powmSpacing.xl,
  },
  qrIconContainer: {
    alignItems: 'center',
    marginTop: powmSpacing.base,
  },
  qrIcon: {
    width: 120,
    height: 120,
    borderRadius: powmRadii.full,
    backgroundColor: powmColors.mainBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ticketsSection: {
    marginBottom: powmSpacing.xxl,
  },
  ticketCard: {
    padding: powmSpacing.base,
  },
  ticketIcon: {
    width: 48,
    height: 48,
    borderRadius: powmRadii.full, // Circular icons
    alignItems: 'center',
    justifyContent: 'center',
  },
  seeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
