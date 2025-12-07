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
}

interface HistoryItemProps {
  item: ActivityItem;
  isEditing: boolean;
  onDelete: (id: string) => void;
  isLast?: boolean;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({ 
  item, 
  isEditing, 
  onDelete,
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
        <View style={[
          styles.statusBadge, 
          { backgroundColor: item.type === 'trusted' ? 'rgba(96, 107, 226, 0.15)' : 'rgba(184, 134, 11, 0.15)' }
        ]}>
          <PowmText 
            variant="text" 
            style={{ 
              fontSize: 10, 
              color: item.type === 'trusted' ? powmColors.activeElectricMain : '#B8860B',
              fontWeight: '600'
            }}
          >
            {item.type === 'trusted' ? 'Trusted' : 'Anonymous'}
          </PowmText>
        </View>
      )}
    </View>
  );

  return (
    <ListItem
      title={item.name}
      subtitle={`${item.type === 'anonymous' ? 'Anonymous check' : 'Identity verified'} • ${item.time}`}
      icon={item.type === 'anonymous' ? 'face' : 'powmLogo'}
      iconColor={item.iconColor}
      rightElement={RightElement}
      showChevron={isLast}
      // Disable default press effect if not editing (or add expand logic here if needed)
      onPress={isEditing ? undefined : () => {}} 
    />
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