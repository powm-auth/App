import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
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
 * History/Activity Screen
 *
 * Shows user's activity history including:
 * - Scanned tickets
 * - Third-party verifications
 * - Delete mode for removing history items
 */

interface ActivityItem {
  id: string;
  name: string;
  timestamp: string;
  date: string;
  type: 'trusted' | 'anonymous';
  iconColor: string;
}

const MOCK_ACTIVITY: ActivityItem[] = [
  {
    id: '1',
    name: 'Instagram',
    timestamp: '18h36',
    date: '17/08/2024',
    type: 'trusted',
    iconColor: powmColors.electricMain,
  },
  {
    id: '2',
    name: 'Youtube',
    timestamp: '18h36',
    date: '17/08/2024',
    type: 'trusted',
    iconColor: powmColors.electricMain,
  },
  {
    id: '3',
    name: 'Instagram',
    timestamp: '18h36',
    date: '17/08/2024',
    type: 'trusted',
    iconColor: powmColors.electricMain,
  },
  {
    id: '4',
    name: 'Tabac.fr',
    timestamp: '18h36',
    date: '17/08/2024',
    type: 'trusted',
    iconColor: powmColors.electricMain,
  },
  {
    id: '5',
    name: 'Harry H',
    timestamp: '18h36',
    date: '17/08/2024',
    type: 'anonymous',
    iconColor: '#B8860B',
  },
  {
    id: '6',
    name: 'Pornhub',
    timestamp: '18h36',
    date: '17/08/2024',
    type: 'trusted',
    iconColor: powmColors.electricMain,
  },
  {
    id: '7',
    name: 'TikTok',
    timestamp: '18h36',
    date: '17/08/2024',
    type: 'trusted',
    iconColor: powmColors.electricMain,
  },
];

export default function HistoryScreen() {
  const [deleteMode, setDeleteMode] = useState(false);
  const insets = useSafeAreaInsets();

  return (
    <BackgroundImage>
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.content, { paddingTop: insets.top + powmSpacing.lg }]}
        >
        {/* Header */}
        <PowmText variant="title" style={styles.header}>
          Activity
        </PowmText>

        {/* Delete Activity Button */}
        {deleteMode && (
          <Pressable
            style={styles.deleteButton}
            onPress={() => setDeleteMode(false)}
          >
            <Row gap={powmSpacing.sm} align="center" justify="center">
              <PowmIcon name="cross" size={20} color={powmColors.white} />
              <PowmText variant="subtitleSemiBold">Delete activity</PowmText>
            </Row>
          </Pressable>
        )}

        {!deleteMode && (
          <Pressable
            style={styles.toggleDeleteButton}
            onPress={() => setDeleteMode(true)}
          >
            <PowmText variant="text" color={powmColors.electricMain}>
              Enable delete mode
            </PowmText>
          </Pressable>
        )}

        {/* Activity List */}
        <Column gap={powmSpacing.xs} style={styles.activityList}>
          {MOCK_ACTIVITY.map((item) => (
            <Card key={item.id} style={styles.activityCard} variant="alt">
              <Row gap={powmSpacing.base} align="center" justify="space-between">
                {/* Icon and Name */}
                <Row gap={powmSpacing.base} align="center" flex={1}>
                  <View style={[styles.activityIcon, { backgroundColor: item.iconColor }]}>
                    <PowmIcon name="face" size={24} color={powmColors.white} />
                  </View>
                  <Column flex={1} gap={powmSpacing.xs}>
                    <PowmText variant="subtitleSemiBold">{item.name}</PowmText>
                    <PowmText variant="text" color={powmColors.inactive}>
                      {item.timestamp} {item.date}
                    </PowmText>
                    {item.type === 'anonymous' && item.name === 'Harry H' && (
                      <PowmText variant="text" color={powmColors.inactive} style={styles.checkText}>
                        Harry H checked your Name and Age on this ticket
                        XXXXXXX XXXXX
                      </PowmText>
                    )}
                  </Column>
                </Row>

                {/* Badge */}
                <View
                  style={[
                    styles.badge,
                    item.type === 'trusted'
                      ? styles.badgeTrusted
                      : styles.badgeAnonymous,
                  ]}
                >
                  <PowmText
                    variant="text"
                    color={powmColors.white}
                    style={styles.badgeText}
                  >
                    {item.type === 'trusted' ? 'Trusted by Powm' : 'Anonymous'}
                  </PowmText>
                </View>
              </Row>
            </Card>
          ))}
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
    marginBottom: powmSpacing.lg,
  },
  deleteButton: {
    backgroundColor: powmColors.deletionRedHard,
    borderRadius: powmRadii.md,
    paddingVertical: powmSpacing.base,
    paddingHorizontal: powmSpacing.lg,
    marginBottom: powmSpacing.lg,
  },
  toggleDeleteButton: {
    alignSelf: 'flex-end',
    marginBottom: powmSpacing.md,
  },
  activityList: {
    marginBottom: powmSpacing.xxl,
  },
  activityCard: {
    padding: 13,
    backgroundColor: powmColors.rowBackground,
  },
  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: powmRadii.full, // Circular icons
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: powmRadii.sm,
  },
  badgeTrusted: {
    backgroundColor: powmColors.activeElectricFade,
  },
  badgeAnonymous: {
    backgroundColor: '#B8860B',
  },
  badgeText: {
    fontSize: 10,
  },
  checkText: {
    marginTop: 4,
    fontSize: 10,
  },
});
