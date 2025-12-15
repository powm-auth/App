import { powmColors } from '@/theme/powm-tokens';
import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { ListItem } from '../ui/ListItem';
import { PowmIcon } from '../ui/PowmIcon';
import { PowmText } from '../ui/PowmText';

export interface ActivityItem {
  id: string;
  name: string;
  time: string;
  dateLabel: string;
  type: 'trusted' | 'anonymous';
  iconColor: string;
  result?: 'accepted' | 'rejected';
  attributes_requested: string[];
}

interface HistoryItemProps {
  item: ActivityItem;
  isEditing: boolean;
  onDelete: (id: string) => void;
  onPress: (item: ActivityItem) => void;
  isLast?: boolean;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({
  item,
  isEditing,
  onDelete,
  onPress,
  isLast
}) => {
  const deleteScale = useRef(new Animated.Value(0)).current;

  // Animate the delete button appearance
  useEffect(() => {
    Animated.spring(deleteScale, {
      toValue: isEditing ? 1 : 0,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  }, [isEditing]);

  // Define the Right Element (Badge OR Delete Button)
  const RightElement = (
    <View style={styles.rightContainer}>
      {isEditing ? (
        <Pressable onPress={() => onDelete(item.id)} hitSlop={10}>
          <Animated.View style={{ transform: [{ scale: deleteScale }] }}>
            <View style={styles.deleteActionCircle}>
              <PowmIcon name="cross" size={14} color={powmColors.white} />
            </View>
          </Animated.View>
        </Pressable>
      ) : (
        <PowmText variant="text" color={powmColors.inactive} style={{ fontSize: 12 }}>
          {item.time}
        </PowmText>
      )}
    </View>
  );

  const isRejected = item.result === 'rejected';
  const isAnonymousIdOnly = item.attributes_requested?.length === 1 && item.attributes_requested[0] === 'anonymous_id';
  const subtitleText = isRejected
    ? 'Request rejected'
    : (isAnonymousIdOnly ? 'Anonymous ID provided' : 'Identity provided');

  return (
    <View style={{ opacity: isRejected ? 0.5 : 1 }}>
      <ListItem
        title={item.name}
        subtitle={subtitleText}
        icon={item.type === 'anonymous' ? 'face' : 'powmLogo'}
        iconColor={item.iconColor}
        rightElement={RightElement}
        showChevron={false}
        onPress={isEditing ? undefined : () => onPress(item)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  rightContainer: {
    minWidth: 50,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  deleteActionCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: powmColors.deletionRedHard,
    alignItems: 'center',
    justifyContent: 'center',
  },
});