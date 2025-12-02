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

const MENU_SECTIONS: MenuSection[] = [
  {
    title: 'My informations',
    items: [
      {
        icon: 'face',
        label: 'Personnal informations',
        onPress: () => console.log('Personal info'),
      },
      {
        icon: 'id',
        label: 'Identity documents',
        onPress: () => console.log('Identity documents'),
      },
    ],
  },
  {
    title: 'Account',
    items: [
      {
        icon: 'data',
        label: 'My data',
        onPress: () => console.log('My data'),
      },
      {
        icon: 'profile',
        label: 'Account',
        onPress: () => console.log('Account'),
      },
      {
        icon: 'bell',
        label: 'Notifications',
        onPress: () => console.log('Notifications'),
      },
    ],
  },
  {
    title: 'Support',
    items: [
      {
        icon: 'face', // Using face as placeholder for help if needed
        label: 'Help',
        onPress: () => console.log('Help'),
      },
    ],
  },
];

// Animated List Item Component
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
        delay: index * 60, // Stagger delay
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
          {/* Icon Circle */}
          <View style={styles.iconCircle}>
            <PowmIcon name={item.icon} size={24} color={powmColors.electricMain} />
          </View>

          {/* Label */}
          <PowmText variant="subtitleSemiBold" style={{ fontSize: 16, flex: 1 }}>
            {item.label}
          </PowmText>

          {/* Chevron */}
          <PowmIcon name="chevron" size={18} color={powmColors.inactive} />
        </Row>
      </Pressable>
      {/* Separator if not last */}
      {!isLast && <View style={styles.separator} />}
    </Animated.View>
  );
};

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Swipe gesture
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
          {/* Header */}
          <PowmText variant="title" style={styles.header}>
            Profile
          </PowmText>

          {/* Menu Sections */}
          <Column gap={powmSpacing.xl}>
            {MENU_SECTIONS.map((section, sectionIndex) => {
              // Calculate a base index for animation delay so items flow sequentially across sections
              const baseIndex = MENU_SECTIONS.slice(0, sectionIndex).reduce(
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
    backgroundColor: 'rgba(30, 28, 40, 0.6)', // Matches History card
    borderRadius: powmRadii.xl, // Matches History radius (24)
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  itemContainer: {
    // Touchable area
  },
  itemInner: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginLeft: 76, // 16 (padding) + 44 (icon) + 16 (gap)
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