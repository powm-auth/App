import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Rect, G } from 'react-native-svg';
import { powmColors } from '@/theme/powm-tokens';

/**
 * PowmIcon Component
 *
 * SVG icon component for Powm.
 * For now using simple placeholder shapes.
 * TODO: Convert actual SVG files from assets/powm/icons/
 *
 * @example
 * <PowmIcon name="home" size={24} color={powmColors.electricMain} />
 */

export type PowmIconName =
  | 'home'
  | 'profile'
  | 'clock'
  | 'qrcode'
  | 'bell'
  | 'add'
  | 'check'
  | 'cross'
  | 'verified'
  | 'id'
  | 'face'
  | 'data'
  | 'flag'
  | 'location'
  | 'gender'
  | 'candle'
  | 'powmLogo'
  | 'chevron';

export interface PowmIconProps {
  name: PowmIconName;
  size?: number;
  color?: string;
  style?: any;
}

export const PowmIcon: React.FC<PowmIconProps> = ({
  name,
  size = 24,
  color = powmColors.white,
  style,
}) => {
  // Simple icon placeholders using basic SVG shapes
  // These are temporary - replace with actual SVG paths from assets
  const renderIcon = () => {
    switch (name) {
      case 'home':
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path
              d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M9 22V12h6v10"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        );

      case 'profile':
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth="2" />
            <Path
              d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </Svg>
        );

      case 'clock':
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
            <Path
              d="M12 6v6l4 2"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </Svg>
        );

      case 'qrcode':
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Rect x="3" y="3" width="8" height="8" stroke={color} strokeWidth="2" />
            <Rect x="3" y="13" width="8" height="8" stroke={color} strokeWidth="2" />
            <Rect x="13" y="3" width="8" height="8" stroke={color} strokeWidth="2" />
            <Rect x="16" y="16" width="2" height="2" fill={color} />
            <Rect x="13" y="19" width="2" height="2" fill={color} />
            <Rect x="19" y="13" width="2" height="2" fill={color} />
          </Svg>
        );

      case 'bell':
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path
              d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <Path
              d="M13.73 21a2 2 0 0 1-3.46 0"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </Svg>
        );

      case 'add':
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 5v14M5 12h14"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </Svg>
        );

      case 'check':
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path
              d="M20 6L9 17l-5-5"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        );

      case 'cross':
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path
              d="M18 6L6 18M6 6l12 12"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </Svg>
        );

      case 'verified':
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z"
              fill={color}
            />
          </Svg>
        );

      case 'face':
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
            <Circle cx="9" cy="10" r="1.5" fill={color} />
            <Circle cx="15" cy="10" r="1.5" fill={color} />
            <Path
              d="M8 15c1 1 2.5 2 4 2s3-1 4-2"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </Svg>
        );

      case 'id':
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Rect
              x="2"
              y="6"
              width="20"
              height="12"
              rx="2"
              stroke={color}
              strokeWidth="2"
            />
            <Circle cx="8" cy="12" r="2" stroke={color} strokeWidth="2" />
            <Path d="M14 10h4M14 14h4" stroke={color} strokeWidth="2" strokeLinecap="round" />
          </Svg>
        );

      case 'data':
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Rect x="3" y="3" width="7" height="7" stroke={color} strokeWidth="2" />
            <Rect x="14" y="3" width="7" height="7" stroke={color} strokeWidth="2" />
            <Rect x="3" y="14" width="7" height="7" stroke={color} strokeWidth="2" />
            <Rect x="14" y="14" width="7" height="7" stroke={color} strokeWidth="2" />
          </Svg>
        );

      case 'chevron':
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path
              d="M9 18l6-6-6-6"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        );

      default:
        // Fallback: colored circle with first letter
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24">
            <Circle cx="12" cy="12" r="10" fill={color} opacity="0.2" />
            <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none" />
          </Svg>
        );
    }
  };

  return <View style={style}>{renderIcon()}</View>;
};

const styles = StyleSheet.create({});
