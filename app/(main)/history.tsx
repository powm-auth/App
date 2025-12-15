import {
  AnimatedEntry,
  BackgroundImage,
  GlassCard,
  PowmText,
  Row,
} from '@/components';
import { HistoryDetailModal } from '@/components/history/HistoryDetailModal';
import { ActivityItem, HistoryItem } from '@/components/history/HistoryItem';
import { clearHistory, deleteHistoryItem, loadHistory } from '@/history/storage';
import { powmColors, powmSpacing } from '@/theme/powm-tokens';
import { useFocusEffect, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useCallback, useRef, useState } from 'react';
import {
  Alert,
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

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const AVATAR_COLORS = [
  powmColors.electricMain,
  powmColors.orangeElectricMain,
  powmColors.successGreen,
  '#9B51E0', // Purple
  '#EB5757', // Red/Pink
  '#2D9CDB', // Light Blue
  '#F2994A', // Orange
  '#219653', // Green
];

const getAvatarColor = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
};

export default function HistoryScreen() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ActivityItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const insets = useSafeAreaInsets();
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      const fetchHistory = async () => {
        const history = await loadHistory();
        const formattedHistory: ActivityItem[] = history.map(item => {
          const date = new Date(item.timestamp);
          const today = new Date();
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);

          let dateLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          if (date.toDateString() === today.toDateString()) {
            dateLabel = 'Today';
          } else if (date.toDateString() === yesterday.toDateString()) {
            dateLabel = 'Yesterday';
          }

          return {
            id: item.id,
            name: item.requester_display_name || (item.requester_type === 'wallet' ? 'Private Wallet' : 'Unknown App'),
            time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
            dateLabel,
            type: item.requester_type === 'wallet' ? 'anonymous' : 'trusted',
            iconColor: getAvatarColor(item.requester_id),
            result: item.result,
            attributes_requested: item.attributes_requested
          };
        });
        setActivities(formattedHistory);
      };
      fetchHistory();
    }, [])
  );

  // Group activities
  const groupedActivities = activities.reduce((acc, item) => {
    if (!acc[item.dateLabel]) acc[item.dateLabel] = [];
    acc[item.dateLabel].push(item);
    return acc;
  }, {} as Record<string, ActivityItem[]>);

  const toggleEditMode = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsEditing(!isEditing);
  };

  const handleDeleteItem = async (id: string) => {
    const hasAcknowledged = await SecureStore.getItemAsync('powm_history_delete_warning_ack');

    const performDelete = async () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
      await deleteHistoryItem(id);
      setActivities(prev => prev.filter(i => i.id !== id));
      setSelectedItem(null);
    };

    if (!hasAcknowledged) {
      Alert.alert(
        'Delete History Item',
        'This action cannot be undone because your history is stored locally on your device.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              await SecureStore.setItemAsync('powm_history_delete_warning_ack', 'true');
              await performDelete();
            }
          }
        ]
      );
    } else {
      await performDelete();
    }
  };

  const handleClearAll = async () => {
    Alert.alert(
      'Clear All History',
      'Are you sure you want to delete all history? This cannot be undone as data is stored locally.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
            await clearHistory();
            setActivities([]);
            setIsEditing(false);
          }
        }
      ]
    );
  };

  // Swipe Back Gesture
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

  // Header Action Button (Edit / Done)
  const HeaderAction = activities.length > 0 ? (
    <Pressable onPress={toggleEditMode} style={styles.editButton} hitSlop={10}>
      <PowmText
        variant="text"
        color={isEditing ? powmColors.electricMain : powmColors.gray}
        style={{ fontWeight: '600', fontSize: 13 }}
      >
        {isEditing ? 'Done' : 'Edit'}
      </PowmText>
    </Pressable>
  ) : null;

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
          {/* Header - Matching index.tsx style */}
          <Row justify="space-between" align="center" style={styles.header}>
            <PowmText variant="title">History</PowmText>
            {/* Show Edit Button or Spacer to maintain layout */}
            {HeaderAction || <View style={{ width: 48, height: 48 }} />}
          </Row>

          {/* Empty State */}
          {activities.length === 0 && (
            <AnimatedEntry>
              <View style={styles.emptyState}>
                <PowmText variant="subtitle" color={powmColors.gray}>No activity yet</PowmText>
                <PowmText variant="text" color={powmColors.inactive} align="center" style={{ marginTop: 8 }}>
                  Your verification history will appear here.
                </PowmText>
              </View>
            </AnimatedEntry>
          )}

          {/* Clear All Option */}
          {isEditing && activities.length > 0 && (
            <Pressable onPress={handleClearAll} style={styles.clearAllContainer}>
              <PowmText variant="text" color={powmColors.deletionRedHard} style={{ fontWeight: 'bold' }}>
                Clear all history
              </PowmText>
            </Pressable>
          )}

          {/* Grouped List */}
          <View style={styles.listContainer}>
            {Object.entries(groupedActivities).map(([dateLabel, items], groupIndex) => (
              <AnimatedEntry key={dateLabel} index={groupIndex}>
                <View style={styles.groupContainer}>
                  <PowmText variant="subtitleSemiBold" color={powmColors.gray} style={styles.groupTitle}>
                    {dateLabel}
                  </PowmText>

                  {/* Using GlassCard as the Group Container (Revolut Style) */}
                  <GlassCard padding={0}>
                    {items.map((item, index) => (
                      <HistoryItem
                        key={item.id}
                        item={item}
                        isEditing={isEditing}
                        onDelete={handleDeleteItem}
                        onPress={setSelectedItem}
                        isLast={index === items.length - 1}
                      />
                    ))}
                  </GlassCard>
                </View>
              </AnimatedEntry>
            ))}
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        <HistoryDetailModal
          visible={!!selectedItem}
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onDelete={handleDeleteItem}
        />
      </View>
    </BackgroundImage>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  content: { paddingHorizontal: powmSpacing.lg },
  header: {
    marginBottom: powmSpacing.xl, // Updated to XL to match index.tsx
    height: 48, // Updated to 48 to match index.tsx
  },
  editButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
  },
  listContainer: { gap: powmSpacing.xl },
  groupContainer: { gap: powmSpacing.sm },
  groupTitle: {
    fontSize: 14,
    marginLeft: 6,
    opacity: 0.7,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
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
