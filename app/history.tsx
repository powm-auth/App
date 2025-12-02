import {
  BackgroundImage,
  Column,
  PowmIcon,
  PowmText,
  Row,
} from '@/components/powm';
import { powmColors, powmRadii, powmSpacing } from '@/theme/powm-tokens';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  LayoutAnimation,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  UIManager,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface ActivityItem {
  id: string;
  name: string;
  time: string;
  dateLabel: string;
  type: 'trusted' | 'anonymous';
  iconColor: string;
}

const MOCK_ACTIVITY: ActivityItem[] = [
  { id: '1', name: 'Instagram', time: '18:36', dateLabel: 'Today', type: 'trusted', iconColor: powmColors.activeElectricMain },
  { id: '2', name: 'Youtube', time: '16:20', dateLabel: 'Today', type: 'trusted', iconColor: '#FF0000' },
  { id: '5', name: 'Harry H', time: '14:05', dateLabel: 'Today', type: 'anonymous', iconColor: '#B8860B' },
  { id: '3', name: 'Tabac.fr', time: '09:12', dateLabel: 'Yesterday', type: 'trusted', iconColor: powmColors.orangeElectricMain },
  { id: '4', name: 'Pornhub', time: '23:45', dateLabel: 'Yesterday', type: 'trusted', iconColor: powmColors.activeElectricMain },
  { id: '7', name: 'TikTok', time: '20:30', dateLabel: 'Aug 15', type: 'trusted', iconColor: '#000000' },
];

const HistoryListItem = ({ 
  item, 
  index, 
  isEditing, 
  onDelete 
}: { 
  item: ActivityItem; 
  index: number; 
  isEditing: boolean;
  onDelete: (id: string) => void;
}) => {
  const translateY = useRef(new Animated.Value(50)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const deleteScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 500,
        delay: index * 80,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    Animated.spring(deleteScale, {
      toValue: isEditing ? 1 : 0,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  }, [isEditing]);

  return (
    <Animated.View style={[styles.itemContainer, { opacity, transform: [{ translateY }] }]}>
      <View style={styles.itemInner}>
        {/* Left: Icon (Larger) */}
        <View style={[styles.iconCircle, { backgroundColor: 'rgba(255,255,255,0.07)' }]}>
          <PowmIcon 
            name={item.type === 'anonymous' ? 'face' : 'powmLogo'} 
            size={24} // Increased from 22
            color={item.iconColor} 
          />
        </View>

        {/* Center: Info */}
        <Column flex={1} justify="center" gap={4}>
          <PowmText variant="subtitleSemiBold" style={{ fontSize: 16 }}>{item.name}</PowmText> 
          <PowmText variant="text" color={powmColors.inactive} style={{ fontSize: 13 }}>
            {item.type === 'anonymous' ? 'Anonymous check' : 'Identity verified'} • {item.time}
          </PowmText>
        </Column>

        {/* Right: Badge or Delete Button */}
        <View style={styles.itemRight}>
          {isEditing ? (
            <Pressable onPress={() => onDelete(item.id)} hitSlop={10}>
              <Animated.View style={{ transform: [{ scale: deleteScale }] }}>
                <View style={styles.deleteActionCircle}>
                  <PowmIcon name="cross" size={16} color={powmColors.white} />
                </View>
              </Animated.View>
            </Pressable>
          ) : (
            <View style={[
              styles.statusBadge, 
              { backgroundColor: item.type === 'trusted' ? 'rgba(96, 107, 226, 0.15)' : 'rgba(184, 134, 11, 0.15)' }
            ]}>
              <PowmText 
                variant="text" 
                style={{ 
                  fontSize: 11, 
                  color: item.type === 'trusted' ? powmColors.activeElectricMain : '#B8860B',
                  fontWeight: '600'
                }}
              >
                {item.type === 'trusted' ? 'Trusted' : 'Anon'}
              </PowmText>
            </View>
          )}
        </View>
      </View>
    </Animated.View>
  );
};

export default function HistoryScreen() {
  const [activities, setActivities] = useState<ActivityItem[]>(MOCK_ACTIVITY);
  const [isEditing, setIsEditing] = useState(false);
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const groupedActivities = activities.reduce((acc, item) => {
    if (!acc[item.dateLabel]) acc[item.dateLabel] = [];
    acc[item.dateLabel].push(item);
    return acc;
  }, {} as Record<string, ActivityItem[]>);

  const toggleEditMode = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsEditing(!isEditing);
  };

  const handleDeleteItem = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    setActivities(prev => prev.filter(i => i.id !== id));
  };

  const handleClearAll = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    setActivities([]);
    setIsEditing(false);
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_evt, gesture) => {
        return Math.abs(gesture.dx) > 30 && Math.abs(gesture.dy) < 20;
      },
      onPanResponderRelease: (_evt, gesture) => {
        if (gesture.dx > 50) {
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
          contentContainerStyle={[styles.content, { paddingTop: insets.top + powmSpacing.lg }]}
          showsVerticalScrollIndicator={false}
        >
          <Row justify="space-between" align="center" style={styles.header}>
            <PowmText variant="title">History</PowmText>
            {activities.length > 0 && (
              <Pressable onPress={toggleEditMode} style={styles.headerAction} hitSlop={10}>
                <PowmText 
                  variant="text" 
                  color={isEditing ? powmColors.electricMain : powmColors.gray}
                  style={{ fontWeight: '600', fontSize: 13 }}
                >
                  {isEditing ? 'Done' : 'Edit'}
                </PowmText>
              </Pressable>
            )}
          </Row>

          {activities.length === 0 && (
            <Animated.View style={styles.emptyState}>
              <PowmIcon name="clock" size={56} color={powmColors.inactive} style={{ opacity: 0.5, marginBottom: 16 }} />
              <PowmText variant="subtitle" color={powmColors.gray}>No activity yet</PowmText>
              <PowmText variant="text" color={powmColors.inactive} align="center" style={{ marginTop: 8 }}>
                Your verification history will appear here.
              </PowmText>
            </Animated.View>
          )}

          {isEditing && activities.length > 0 && (
            <Pressable onPress={handleClearAll} style={styles.clearAllContainer}>
               <PowmText variant="text" color={powmColors.deletionRedHard} style={{ fontWeight: 'bold' }}>
                 Clear all history
               </PowmText>
            </Pressable>
          )}

          <View style={styles.listContainer}>
            {Object.entries(groupedActivities).map(([dateLabel, items], groupIndex) => (
              <View key={dateLabel} style={styles.groupContainer}>
                <PowmText variant="subtitleSemiBold" color={powmColors.gray} style={styles.groupTitle}>
                  {dateLabel}
                </PowmText>
                
                <View style={styles.groupCard}>
                  {items.map((item, index) => (
                    <React.Fragment key={item.id}>
                      {index > 0 && <View style={styles.separator} />}
                      <HistoryListItem 
                        item={item} 
                        index={(groupIndex * 5) + index}
                        isEditing={isEditing}
                        onDelete={handleDeleteItem}
                      />
                    </React.Fragment>
                  ))}
                </View>
              </View>
            ))}
          </View>

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
    height: 44,
  },
  headerAction: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
  },
  listContainer: {
    gap: powmSpacing.xl,
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16, // Increased vertical padding
    paddingHorizontal: 16,
    gap: 16, // Increased gap
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginLeft: 76, // 16 (padding) + 44 (icon) + 16 (gap) = 76
  },
  iconCircle: {
    width: 44, // Increased from 36
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    minWidth: 50,
  },
  statusBadge: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  deleteActionCircle: {
    width: 32, // Larger touch target
    height: 32,
    borderRadius: 16,
    backgroundColor: powmColors.deletionRedHard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearAllContainer: {
    alignItems: 'center',
    marginBottom: powmSpacing.md,
    padding: 8,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
    opacity: 0.8,
  },
});