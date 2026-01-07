import {
    AnimatedEntry,
    BackgroundImage,
    GlassCard,
    PowmIcon,
    PowmText,
    Row
} from '@/components';
import { Notification, NotificationPanel } from '@/components/NotificationPanel';
import { ScannerCard } from '@/components/home/ScannerCard';
import { powmStyles } from '@/theme/powm-styles';
import { powmColors, powmRadii, powmSpacing } from '@/theme/powm-tokens';
import { getCurrentWallet } from '@/wallet/service';
import { useWalletStatus } from '@/wallet/status';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function HomeScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { status } = useWalletStatus();

    const wallet = getCurrentWallet();
    const firstName = wallet?.identity_attributes?.first_name?.value || wallet?.user_details?.first_name || 'User';

    const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: '1',
            title: 'Welcome to Powm',
            message: 'Secure your identity with Powm!',
            type: 'info',
            timestamp: new Date(),
            read: false,
        },
    ]);

    const handleMarkAllRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    const handleTestButton = () => {
        router.push('/verify-identity');
    };

    const handlePresetSelect = (attributes: string[], autoStart = false) => {
        setIsRequestModalOpen(false);
        router.push({
            pathname: '/request-identity',
            params: {
                attributes: JSON.stringify(attributes),
                autoStart: autoStart ? 'true' : 'false'
            }
        });
    };

    return (
        <BackgroundImage>
            <View style={styles.container}>

                <NotificationPanel
                    isOpen={isNotificationPanelOpen}
                    onClose={() => setIsNotificationPanelOpen(false)}
                    notifications={notifications}
                    onMarkAllRead={handleMarkAllRead}
                />

                <Modal
                    visible={isRequestModalOpen}
                    transparent
                    animationType="fade"
                    onRequestClose={() => {
                        setIsRequestModalOpen(false);
                    }}
                >
                    <View style={powmStyles.modalOverlay}>
                        <Pressable style={StyleSheet.absoluteFill} onPress={() => {
                            setIsRequestModalOpen(false);
                        }} />
                        <GlassCard style={powmStyles.modalContent}>
                            <PowmText variant="subtitle" align="center" style={{ marginBottom: powmSpacing.lg }}>
                                Request Identity
                            </PowmText>

                            <View style={{ gap: powmSpacing.md }}>
                                <TouchableOpacity
                                    style={styles.presetButton}
                                    onPress={() => handlePresetSelect(['first_name', 'last_name', 'date_of_birth'], true)}
                                >
                                    <View style={styles.presetIcon}>
                                        <PowmIcon name="id" size={20} color={powmColors.electricMain} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <PowmText variant="subtitleSemiBold" style={{ fontSize: 16 }}>Full Name + Age</PowmText>
                                        <PowmText variant="text" color={powmColors.inactive} style={{ fontSize: 12 }}>Name and Date of Birth</PowmText>
                                    </View>
                                    <PowmIcon name="chevron" size={16} color={powmColors.gray} />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.presetButton}
                                    onPress={() => handlePresetSelect(['age_over_18', 'age_over_21'], true)}
                                >
                                    <View style={styles.presetIcon}>
                                        <PowmIcon name="help" size={28} color={powmColors.electricMain} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <PowmText variant="subtitleSemiBold" style={{ fontSize: 16 }}>Age Verification</PowmText>
                                        <PowmText variant="text" color={powmColors.inactive} style={{ fontSize: 12 }}>Verify 18+ and 21+ status</PowmText>
                                    </View>
                                    <PowmIcon name="chevron" size={16} color={powmColors.gray} />
                                </TouchableOpacity>

                                <View style={styles.divider} />

                                <TouchableOpacity
                                    style={styles.presetButton}
                                    onPress={() => {
                                        setIsRequestModalOpen(false);
                                        router.push('/request-identity');
                                    }}
                                >
                                    <View style={[styles.presetIcon, { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
                                        <PowmIcon name="add" size={20} color={powmColors.white} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <PowmText variant="subtitleSemiBold" style={{ fontSize: 16 }}>Custom Request</PowmText>
                                        <PowmText variant="text" color={powmColors.inactive} style={{ fontSize: 12 }}>Select specific attributes</PowmText>
                                    </View>
                                    <PowmIcon name="chevron" size={16} color={powmColors.gray} />
                                </TouchableOpacity>
                            </View>
                        </GlassCard>
                    </View>
                </Modal>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={[
                        styles.content,
                        { paddingTop: insets.top + powmSpacing.xxl },
                    ]}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Powm Logo Header */}
                    <Row align="center" justify="space-between" style={styles.logoHeader}>
                        <Row align="center" gap={12}>
                            <PowmIcon name="powmLogo" size={48} color={powmColors.electricMain} />
                            <PowmText variant="subtitle" style={styles.logoText}>POWM</PowmText>
                        </Row>
                        <Pressable
                            style={styles.bellButton}
                            onPress={() => setIsNotificationPanelOpen(true)}
                        >
                            <PowmIcon name="bell" size={24} color={powmColors.white} />
                            {notifications.some((n) => !n.read) && (
                                <View style={styles.notificationDot} />
                            )}
                        </Pressable>
                    </Row>

                    {/* 1. Scanner Card */}
                    <AnimatedEntry index={0}>
                        <View style={{ marginBottom: powmSpacing.xxl * 1.5 }}>
                            <ScannerCard onPress={() => {
                                router.push('/scan');
                            }} />
                        </View>
                    </AnimatedEntry>

                    {/* Wallet-to-Wallet Identity Exchange */}
                    <AnimatedEntry index={1}>
                        <Pressable
                            onPress={() => setIsRequestModalOpen(true)}
                            style={({ pressed }) => [
                                styles.requestIdentityCard,
                                pressed && { opacity: 0.8 },
                            ]}
                        >
                            <View style={styles.requestIdentityBorder}>
                                <View style={styles.requestIdentityContent}>
                                    <View style={styles.requestIdentityIcon}>
                                        <PowmIcon name="id" size={32} color={powmColors.electricMain} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <PowmText variant="subtitleSemiBold" style={{ fontSize: 18, marginBottom: 4 }}>
                                            Request Someone's Identity
                                        </PowmText>
                                        <PowmText variant="text" color={powmColors.inactive} style={{ fontSize: 14 }}>
                                            Request identity information from others
                                        </PowmText>
                                    </View>
                                    <PowmIcon name="chevron" size={20} color={powmColors.electricMain} />
                                </View>
                            </View>
                        </Pressable>
                    </AnimatedEntry>

                    {/* Verification Status Button */}
                    {status.identityVerification !== 'completed' && (
                        <AnimatedEntry index={2}>
                            {(() => {
                                const verificationStatus = status.identityVerification;
                                let buttonColor: string = powmColors.orangeElectricMain;
                                let buttonTitle = 'Verify Your Identity';
                                let buttonSubtext = 'Complete setup to access all features';
                                let badgeText = 'REQUIRED';
                                let badgeColor = 'rgba(255, 154, 46, 0.3)';
                                let bgColor = 'rgba(255, 154, 46, 0.15)';

                                if (verificationStatus === 'processing' || verificationStatus === 'accepted_awaiting_consumption') {
                                    buttonTitle = 'Verifying Identity';
                                    buttonSubtext = "We're reviewing your identity";
                                    badgeText = 'IN PROGRESS';
                                    buttonColor = '#F5C842'  // Soft friendly yellow
                                    badgeColor = 'rgba(245, 200, 66, 0.0)'
                                    bgColor = 'rgba(245, 200, 66, 0.15)'
                                } else if (verificationStatus === 'rejected') {
                                    buttonColor = powmColors.deletionRedMain;
                                    buttonTitle = 'Verification Failed';
                                    buttonSubtext = 'Try verifying your identity again';
                                    badgeText = '';
                                    badgeColor = 'rgba(255, 69, 58, 0.3)';
                                    bgColor = 'rgba(255, 69, 58, 0.15)';
                                }

                                return (
                                    <Pressable
                                        onPress={handleTestButton}
                                        style={({ pressed }) => [
                                            {
                                                marginTop: powmSpacing.md,
                                                borderRadius: powmRadii.xl,
                                                overflow: 'hidden',
                                            },
                                            pressed && { opacity: 0.95, transform: [{ scale: 0.99 }] },
                                        ]}
                                    >
                                        <View style={[styles.requestIdentityBorder, { borderColor: badgeColor }]}>
                                            <View style={styles.requestIdentityContent}>
                                                <View style={[styles.requestIdentityIcon, { backgroundColor: bgColor }]}>
                                                    <PowmIcon name={verificationStatus === 'rejected' ? 'info' : 'verified'} size={32} color={buttonColor} />
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <Row align="center" style={{ gap: 8, marginBottom: 4 }}>
                                                        <PowmText variant="subtitleSemiBold" style={{ fontSize: 18 }}>
                                                            {buttonTitle}
                                                        </PowmText>
                                                        {badgeText && (
                                                            <View style={{
                                                                backgroundColor: bgColor,
                                                                paddingHorizontal: 8,
                                                                paddingVertical: 2,
                                                                borderRadius: 4,
                                                                borderWidth: 1,
                                                                borderColor: badgeColor,
                                                            }}>
                                                                <PowmText style={{
                                                                    color: buttonColor,
                                                                    fontSize: 10,
                                                                    fontWeight: '700',
                                                                    letterSpacing: 0.5
                                                                }}>
                                                                    {badgeText}
                                                                </PowmText>
                                                            </View>
                                                        )}
                                                    </Row>
                                                    <PowmText variant="text" color={powmColors.inactive} style={{ fontSize: 14 }}>
                                                        {buttonSubtext}
                                                    </PowmText>
                                                </View>
                                                <PowmIcon name="chevron" size={20} color={buttonColor} />
                                            </View>
                                        </View>
                                    </Pressable>
                                );
                            })()}
                        </AnimatedEntry>
                    )}

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
    logoHeader: {
        marginBottom: powmSpacing.xl,
        gap: 12,
    },
    logoText: {
        fontSize: 24,
        letterSpacing: 2,
        fontWeight: '700',
        color: powmColors.electricMain,
    },
    header: {
        marginBottom: powmSpacing.xl,
        height: 48,
    },
    bellButton: {
        width: 48,
        height: 48,
        borderRadius: powmRadii.full,
        backgroundColor: 'rgba(42, 40, 52, 0.8)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    notificationDot: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: powmColors.orangeElectricMain,
        borderWidth: 1,
        borderColor: 'rgba(42, 40, 52, 0.8)',
    },
    requestIdentityCard: {
        width: '100%',
        borderRadius: powmRadii.xl,
    },
    requestIdentityBorder: {
        borderRadius: powmRadii.xl,
        borderWidth: 1,
        borderColor: 'rgba(151, 71, 255, 0.3)',
        backgroundColor: 'rgba(42, 40, 52, 0.6)',
        overflow: 'hidden',
    },
    requestIdentityContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: powmSpacing.md,
        padding: powmSpacing.lg,
    },
    requestIdentityIcon: {
        width: 56,
        height: 56,
        borderRadius: powmRadii.lg,
        backgroundColor: 'rgba(151, 71, 255, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    presetButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: powmSpacing.md,
        borderRadius: powmRadii.md,
        gap: powmSpacing.md,
    },
    presetIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: powmColors.glass.border,
        width: '100%',
        opacity: 0.3,
        marginVertical: 4,
    },
});
