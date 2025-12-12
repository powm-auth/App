import {
    AnimatedEntry,
    BackgroundImage,
    Button,
    Column,
    GlassCard,
    PowmIcon,
    PowmText,
    Row
} from '@/components';
import { Notification, NotificationPanel } from '@/components/NotificationPanel';
import { ScannerCard } from '@/components/home/ScannerCard';
import { createWalletChallenge, getCurrentWallet, pollChallenge } from '@/services/wallet-service';
import { powmColors, powmRadii, powmSpacing } from '@/theme/powm-tokens';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function HomeScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const wallet = getCurrentWallet();
    const firstName = wallet?.attributes?.first_name?.value || 'User';

    const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: '1',
            title: 'Welcome to Powm',
            message: 'Secure your identity with our new encrypted tickets.',
            type: 'info',
            timestamp: new Date(),
            read: false,
        },
    ]);

    const [challengeId, setChallengeId] = useState<string | null>(null);
    const [status, setStatus] = useState<string>('idle'); // idle, creating, polling, accepted, rejected
    const [identityData, setIdentityData] = useState<any>(null);

    const handleMarkAllRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    const handleCreateChallenge = async () => {
        const wallet = getCurrentWallet();
        if (!wallet) return;

        setStatus('creating');
        try {
            // Request basic attributes
            const attributes = ['first_name', 'last_name'];
            const { challengeId, privateKey } = await createWalletChallenge(wallet, attributes);

            setChallengeId(challengeId);
            setStatus('polling');

            // Start polling
            try {
                const identity = await pollChallenge(challengeId, privateKey, (s) => {
                    if (s === 'accepted') setStatus('accepted');
                    else if (s === 'rejected') setStatus('rejected');
                });
                setIdentityData(identity);
                setStatus('accepted');
            } catch (e) {
                console.error(e);
                setStatus('rejected');
            }
        } catch (e) {
            console.error(e);
            setStatus('idle');
        }
    };

    const handleReset = () => {
        setChallengeId(null);
        setStatus('idle');
        setIdentityData(null);
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

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={[
                        styles.content,
                        { paddingTop: insets.top + powmSpacing.lg },
                    ]}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <Row justify="space-between" align="center" style={styles.header}>
                        <PowmText variant="title">Welcome {firstName}!</PowmText>
                        <View style={{ width: 48, height: 48 }} />
                    </Row>

                    {/* 1. Scanner Card */}
                    <AnimatedEntry index={0}>
                        <View style={{ marginBottom: powmSpacing.xl }}>
                            <ScannerCard onPress={() => {
                                router.push('/scan');
                            }} />
                        </View>
                    </AnimatedEntry>

                    {/* Wallet-to-Wallet Identity Exchange */}
                    <AnimatedEntry index={1}>
                        <Column gap={powmSpacing.md} style={{ alignItems: 'center' }}>
                            {!challengeId ? (
                                <Button
                                    title={status === 'creating' ? "Creating..." : "Request Identity"}
                                    onPress={handleCreateChallenge}
                                    disabled={status === 'creating'}
                                    style={{ width: '100%' }}
                                />
                            ) : (
                                <GlassCard padding={powmSpacing.lg} style={{ alignItems: 'center', width: '100%' }}>
                                    <PowmText variant="subtitle" align="center" style={{ marginBottom: powmSpacing.md }}>
                                        Scan to Prove Identity
                                    </PowmText>

                                    <View style={{ padding: powmSpacing.md, backgroundColor: 'white', borderRadius: powmRadii.md }}>
                                        <QRCode
                                            value={`powm://${challengeId}`}
                                            size={200}
                                        />
                                    </View>

                                    <View style={{ marginTop: powmSpacing.md, width: '100%', alignItems: 'center' }}>
                                        {status === 'polling' && (
                                            <Row gap={8} align="center">
                                                <ActivityIndicator color={powmColors.electricMain} />
                                                <PowmText variant="text">Waiting for scan...</PowmText>
                                            </Row>
                                        )}
                                        {status === 'accepted' && (
                                            <Column align="center" gap={4} style={{ width: '100%' }}>
                                                <PowmIcon name="check" color={powmColors.success} size={32} />
                                                <PowmText variant="subtitle" color={powmColors.success}>Identity Verified!</PowmText>
                                                {identityData && (
                                                    <PowmText variant="text" align="center">
                                                        {identityData.first_name} {identityData.last_name}
                                                    </PowmText>
                                                )}
                                                <Button
                                                    title="Reset"
                                                    variant="secondary"
                                                    onPress={handleReset}
                                                    style={{ marginTop: powmSpacing.md, width: '100%' }}
                                                />
                                            </Column>
                                        )}
                                        {status === 'rejected' && (
                                            <Column align="center" gap={4} style={{ width: '100%' }}>
                                                <PowmIcon name="close" color={powmColors.error} size={32} />
                                                <PowmText variant="subtitle" color={powmColors.error}>Rejected or Failed</PowmText>
                                                <Button
                                                    title="Try Again"
                                                    variant="secondary"
                                                    onPress={handleReset}
                                                    style={{ marginTop: powmSpacing.md, width: '100%' }}
                                                />
                                            </Column>
                                        )}
                                    </View>
                                </GlassCard>
                            )}
                        </Column>
                    </AnimatedEntry>

                    <View style={{ height: 100 }} />
                </ScrollView>

                {/* Bell Button */}
                <Pressable
                    style={[styles.bellButton, { top: insets.top + powmSpacing.lg }]}
                    onPress={() => setIsNotificationPanelOpen(true)}
                >
                    <PowmIcon name="bell" size={24} color={powmColors.white} />
                    {notifications.some((n) => !n.read) && (
                        <View style={styles.notificationDot} />
                    )}
                </Pressable>

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
        marginBottom: powmSpacing.xl,
        height: 48,
    },
    bellButton: {
        position: 'absolute',
        right: powmSpacing.lg,
        width: 48,
        height: 48,
        borderRadius: powmRadii.full,
        backgroundColor: 'rgba(42, 40, 52, 0.8)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
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
    ticketsSection: {
        marginBottom: powmSpacing.xxl,
    },
    createIconContainer: {
        width: 48,
        height: 48,
        borderRadius: powmRadii.full,
        backgroundColor: 'rgba(255, 154, 46, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
