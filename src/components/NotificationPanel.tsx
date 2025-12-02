import { PowmText } from '@/components/powm';
import { powmColors, powmRadii, powmSpacing } from '@/theme/powm-tokens';
import { Bell, CheckCircle, Shield, X } from 'lucide-react-native'; // npm install lucide-react-native
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    Modal,
    Pressable,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const PANEL_WIDTH = width * 0.85; // Max width similar to the web "max-w-sm"

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  timestamp: Date;
  read: boolean;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAllRead: () => void;
}

export function NotificationPanel({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
}: NotificationPanelProps) {
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(PANEL_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Handle Animations
  useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: PANEL_WIDTH,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOpen]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} color={powmColors.electricMain} />;
      case 'warning':
        return <Shield size={20} color={powmColors.orangeElectricMain} />;
      default:
        return <Bell size={20} color={powmColors.gray} />;
    }
  };

  // If we are closed and animation is finished, don't render content to save resources
  // (Optional: can be handled by Modal 'visible' prop from parent, but handled here for animation flow)
  if (!isOpen && slideAnim === new Animated.Value(PANEL_WIDTH)) return null;

  return (
    <Modal
      transparent
      visible={isOpen}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Backdrop */}
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>

        {/* Sliding Panel */}
        <Animated.View
          style={[
            styles.panel,
            {
              paddingTop: insets.top,
              paddingBottom: insets.bottom,
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <PowmText variant="subtitle">Notifications</PowmText>
            <View style={styles.headerActions}>
              {notifications.some((n) => !n.read) && (
                <TouchableOpacity onPress={onMarkAllRead} style={styles.markReadBtn}>
                   <PowmText variant="text" style={{ fontSize: 12 }}>Mark all read</PowmText>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <X size={24} color={powmColors.white} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.divider} />

          {/* List */}
          <View style={styles.listContainer}>
            {notifications.length === 0 ? (
              <View style={styles.emptyState}>
                <Bell size={48} color={powmColors.inactive} style={{ opacity: 0.3, marginBottom: 12 }} />
                <PowmText variant="text" color={powmColors.inactive}>No notifications yet</PowmText>
              </View>
            ) : (
              notifications.map((notification) => (
                <View
                  key={notification.id}
                  style={[
                    styles.notificationItem,
                    !notification.read && styles.unreadItem,
                  ]}
                >
                  <View style={styles.row}>
                    <View style={styles.iconContainer}>
                        {getIcon(notification.type)}
                    </View>
                    <View style={styles.textContainer}>
                      <PowmText variant="subtitleSemiBold" style={{ fontSize: 14 }}>
                        {notification.title}
                      </PowmText>
                      <PowmText variant="text" color={powmColors.inactive} style={{ fontSize: 13, marginTop: 2 }}>
                        {notification.message}
                      </PowmText>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 9999,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)', // Glass/Blur effect approximation
  },
  panel: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: PANEL_WIDTH,
    backgroundColor: powmColors.rowBackground, // Assuming dark theme background
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: powmSpacing.lg,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: powmSpacing.sm,
  },
  markReadBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  closeBtn: {
    padding: 4,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  listContainer: {
    flex: 1,
    padding: powmSpacing.lg,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationItem: {
    padding: powmSpacing.md,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: powmRadii.md,
    marginBottom: powmSpacing.sm,
  },
  unreadItem: {
    borderLeftWidth: 3,
    borderLeftColor: powmColors.electricMain,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  row: {
    flexDirection: 'row',
    gap: powmSpacing.sm,
  },
  iconContainer: {
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
});