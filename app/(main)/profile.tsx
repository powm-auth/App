import {
  AnimatedEntry,
  BackgroundImage,
  Column,
  GlassCard,
  ListItem,
  PowmIcon,
  PowmIconName,
  PowmText,
  Row,
} from '@/components';
import { powmColors, powmSpacing } from '@/theme/powm-tokens';
import { loadWallet } from '@/wallet/storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface MenuSection {
  title: string;
  items: MenuItem[];
}

interface MenuItem {
  icon: PowmIconName;
  label: string;
  onPress: () => void;
  iconSize?: number;
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [identity, setIdentity] = useState<{ first: string; last: string } | null>(null);

  useEffect(() => {
    loadWallet().then((w) => {
      if (w?.attributes) {
        setIdentity({
          first: w.attributes.first_name?.value || 'User',
          last: w.attributes.last_name?.value || '',
        });
      }
    });
  }, []);

  const menuSections: MenuSection[] = [
    {
      title: 'Security & Data',
      items: [
        {
          icon: 'data',
          label: 'Wallet Data',
          onPress: () => router.push('/my-data'),
        },
      ],
    },
    {
      title: 'Application',
      items: [
        {
          icon: 'bell',
          label: 'Notifications',
          onPress: () => router.push('/notifications'),
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: 'help',
          label: 'Help',
          onPress: () => router.push('/help'),
          iconSize: 36,
        },
      ],
    },
  ];

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_evt, gesture) => {
        const { dx, dy } = gesture;
        return Math.abs(dx) > 20 && Math.abs(dy) < 10;
      },
      onPanResponderRelease: (_evt, gesture) => {
        const { dx } = gesture;
        if (dx < -50) {
          router.push('/home');
        }
      },
    })
  ).current;

  return (
    <BackgroundImage>
      <View style={styles.container} {...panResponder.panHandlers}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.content,
            { paddingTop: insets.top + powmSpacing.lg },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <PowmText variant="title" style={styles.header}>
            Profile
          </PowmText>

          <Column gap={powmSpacing.xl}>
            {/* Hero Identity Card */}
            <Pressable onPress={() => router.push('/personal-info')}>
              <GlassCard style={styles.identityCard}>
                <Row style={{ alignItems: 'center', gap: powmSpacing.md }}>
                  <View style={styles.avatarContainer}>
                    <PowmText variant="title" style={{ fontSize: 24 }}>
                      {identity?.first?.[0] || '?'}
                    </PowmText>
                  </View>
                  <Column style={{ flex: 1, gap: 2 }}>
                    <PowmText variant="subtitleSemiBold" style={{ fontSize: 18 }}>
                      {identity ? `${identity.first} ${identity.last?.[0]}.` : 'Loading...'}
                    </PowmText>
                    <PowmText variant="text" color={powmColors.inactive} style={{ fontSize: 13 }}>
                      My Digital ID
                    </PowmText>
                  </Column>
                  <PowmIcon name="chevron" size={20} color={powmColors.inactive} />
                </Row>
              </GlassCard>
            </Pressable>

            {menuSections.map((section, sectionIndex) => {
              const baseIndex = menuSections.slice(0, sectionIndex).reduce(
                (acc, s) => acc + s.items.length,
                0
              );

              return (
                <View key={sectionIndex} style={styles.groupContainer}>
                  <PowmText
                    variant="subtitleSemiBold"
                    color={powmColors.gray}
                    style={styles.groupTitle}
                  >
                    {section.title}
                  </PowmText>

                  <GlassCard padding={0}>
                    {section.items.map((item, itemIndex) => (
                      <AnimatedEntry
                        key={itemIndex}
                        index={baseIndex + itemIndex}
                        slideDistance={30}
                      >
                        <View>
                          <ListItem
                            title={item.label}
                            icon={item.icon}
                            iconSize={item.iconSize}
                            onPress={item.onPress}
                            showChevron
                          />
                          {itemIndex < section.items.length - 1 && (
                            <View style={styles.separator} />
                          )}
                        </View>
                      </AnimatedEntry>
                    ))}
                  </GlassCard>
                </View>
              );
            })}
          </Column>

          <View style={{ height: 100 }} />
        </ScrollView>
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
  },
  header: {
    marginBottom: powmSpacing.lg,
    marginLeft: 4,
  },
  groupContainer: {
    gap: powmSpacing.sm,
  },
  groupTitle: {
    fontSize: 14,
    marginLeft: 6,
    opacity: 0.7,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginLeft: 76,
  },
  identityCard: {
    padding: powmSpacing.lg,
    marginBottom: powmSpacing.xs,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
});
