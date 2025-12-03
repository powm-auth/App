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
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
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
}

const ProfileListItem = ({
  item,
  index,
  isLast,
}: {
  item: MenuItem;
  index: number;
  isLast: boolean;
}) => {
  const translateY = useRef(new Animated.Value(50)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 500,
        delay: index * 60,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        delay: index * 60,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <Pressable
        onPress={item.onPress}
        style={({ pressed }) => [
          styles.itemContainer,
          pressed && { backgroundColor: 'rgba(255,255,255,0.03)' },
        ]}
      >
        <Row gap={16} align="center" style={styles.itemInner}>
          <View style={styles.iconCircle}>
            <PowmIcon name={item.icon} size={24} color={powmColors.electricMain} />
          </View>
          <PowmText variant="subtitleSemiBold" style={{ fontSize: 16, flex: 1 }}>
            {item.label}
          </PowmText>
          <PowmIcon name="chevron" size={18} color={powmColors.inactive} />
        </Row>
      </Pressable>
      {!isLast && <View style={styles.separator} />}
    </Animated.View>
  );
};

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const menuSections: MenuSection[] = [
    {
      title: 'My informations',
      items: [
        {
          icon: 'face',
          label: 'Personal information',
          onPress: () => router.push('/personal-info'),
        },
        {
          icon: 'id',
          label: 'Identity documents',
          onPress: () => router.push('/identity-documents'),
        },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          icon: 'data',
          label: 'My data',
          onPress: () => router.push('/my-data'),
        },
        {
          icon: 'profile',
          label: 'Account',
          onPress: () => router.push('/account'),
        },
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
          icon: 'face',
          label: 'Help',
          onPress: () => router.push('/help'), // ✅ LINKED
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
          router.push('/');
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

                  <View style={styles.groupCard}>
                    {section.items.map((item, itemIndex) => (
                      <ProfileListItem
                        key={itemIndex}
                        item={item}
                        index={baseIndex + itemIndex}
                        isLast={itemIndex === section.items.length - 1}
                      />
                    ))}
                  </View>
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
  groupCard: {
    backgroundColor: 'rgba(30, 28, 40, 0.6)',
    borderRadius: powmRadii.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  itemContainer: {},
  itemInner: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginLeft: 76,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});