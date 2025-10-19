import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

/**
 * Row Component
 *
 * Horizontal flexbox container.
 * Simple wrapper for consistent row layouts.
 *
 * @example
 * <Row gap={8} align="center">
 *   <Icon />
 *   <Text>Label</Text>
 * </Row>
 */

export interface RowProps {
  children: React.ReactNode;
  gap?: number;
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
  style?: ViewStyle;
  flex?: number;
}

export const Row: React.FC<RowProps> = ({
  children,
  gap = 0,
  align = 'flex-start',
  justify = 'flex-start',
  style,
  flex,
}) => {
  const rowStyle: ViewStyle = {
    ...styles.base,
    gap,
    alignItems: align,
    justifyContent: justify,
    ...(flex !== undefined && { flex }),
    ...(style as ViewStyle),
  };

  return <View style={rowStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
  },
});
