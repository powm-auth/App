import { powmColors } from '@/theme/powm-tokens';
import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { PowmIcon, PowmIconName } from './PowmIcon';
import { PowmText } from './PowmText';
import { Row } from './Row';

interface ListItemProps {
  title: string;
  subtitle?: string;
  icon?: PowmIconName;
  iconColor?: string;
  iconSize?: number;
  rightElement?: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  showChevron?: boolean;
  disabled?: boolean;
}

/**
 * Standard List Item Row.
 * Used in menus, settings, and lists.
 */
export const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  icon,
  iconColor = powmColors.electricMain,
  iconSize = 24,
  rightElement,
  onPress,
  style,
  showChevron = true,
  disabled = false,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && { backgroundColor: powmColors.glass.pressed },
        disabled && { opacity: 0.5 },
        style,
      ]}
      disabled={disabled || !onPress}
    >
      <Row gap={16} align="center">
        {icon && (
          <View style={styles.iconCircle}>
            <PowmIcon name={icon} size={iconSize} color={iconColor} />
          </View>
        )}

        <View style={styles.content}>
          <PowmText variant="subtitleSemiBold" style={styles.title}>
            {title}
          </PowmText>
          {subtitle && (
            <PowmText variant="text" color={powmColors.inactive} style={styles.subtitle}>
              {subtitle}
            </PowmText>
          )}
        </View>

        {rightElement}

        {showChevron && !rightElement && onPress && (
          <PowmIcon name="chevron" size={18} color={powmColors.inactive} />
        )}
      </Row>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: powmColors.glass.iconBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
});
