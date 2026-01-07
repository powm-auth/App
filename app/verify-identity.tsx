import {
    BackgroundImage,
    Button,
    LoadingOverlay,
    PowmIcon,
    PowmIconName,
    PowmText,
    ScreenHeader
} from '@/components';
import { startIdentityVerification } from '@/sdk-extension';
import { powmColors, powmSpacing } from '@/theme/powm-tokens';
import { getCurrentWallet } from '@/wallet/service';
import { useWalletStatus } from '@/wallet/status';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type StatusState = 'idle' | 'processing' | 'success' | 'cancelled' | 'in_progress' | 'rejected' | 'completed';

interface StatusConfig {
    icon: PowmIconName;
    iconColor: string;
    borderColor?: string;
    title: string;
    message: string;
    showTryAgain?: boolean;
}

const STATUS_CONFIGS: Record<Exclude<StatusState, 'idle' | 'processing'>, StatusConfig> = {
    in_progress: {
        icon: 'verified',
        iconColor: '#FFD60A',
        borderColor: '#FFD60A',
        title: 'Verification In Progress',
        message: 'Your identity verification is currently being processed. This could take up to 48 hours.',
    },
    completed: {
        icon: 'check',
        iconColor: powmColors.successGreen,
        borderColor: powmColors.successGreen,
        title: 'Already Verified',
        message: 'Your identity is already verified. You have full access to all features.',
    },
    rejected: {
        icon: 'cross',
        iconColor: powmColors.deletionRedMain,
        borderColor: powmColors.deletionRedMain,
        title: 'Verification Rejected',
        message: 'Your previous verification attempt was rejected. Please try again with valid identity documents.',
        showTryAgain: true,
    },
    success: {
        icon: 'check',
        iconColor: powmColors.successGreen,
        borderColor: powmColors.successGreen,
        title: 'Verification Successful',
        message: 'Your identity has been successfully verified.',
    },
    cancelled: {
        icon: 'cross',
        iconColor: powmColors.deletionRedMain,
        borderColor: powmColors.deletionRedMain,
        title: 'Verification Cancelled',
        message: 'The verification process was incomplete or cancelled.',
        showTryAgain: true,
    },
};

const StatusCard: React.FC<{ config: StatusConfig; onTryAgain: () => void; onReturnHome: () => void }> = ({ config, onTryAgain, onReturnHome }) => (
    <View style={styles.resultContainer}>
        <View style={[styles.iconContainer, { borderColor: config.borderColor || config.iconColor, marginBottom: powmSpacing.xxl }]}>
            <PowmIcon name={config.icon} size={64} color={config.iconColor} />
        </View>
        <PowmText variant="title" align="center" style={{ marginBottom: powmSpacing.sm }}>
            {config.title}
        </PowmText>
        <PowmText variant="text" color={powmColors.inactive} align='center' style={{ marginBottom: powmSpacing.xxl * 1.5 }}>
            {config.message}
        </PowmText>

        {config.showTryAgain ? (
            <View style={{ gap: powmSpacing.md, width: '100%' }}>
                <Button title="Try Again" onPress={onTryAgain} variant="primary" />
                <Button title="Return to Home" onPress={onReturnHome} variant="secondary" />
            </View>
        ) : (
            <Button title="Return to Home" onPress={onReturnHome} style={styles.button} variant="primary" />
        )}
    </View>
);

export default function VerifyIdentityScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { status: walletStatus, refreshWalletStatus } = useWalletStatus();
    const [status, setStatus] = useState<StatusState>('idle');
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Fade in animation
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
        }).start();

        // Check current verification status first
        checkStatusAndStart();
    }, []);

    const checkStatusAndStart = async () => {
        // Refresh status to get latest from server
        try {
            await refreshWalletStatus();
        } catch (e) {
            console.warn('Failed to refresh status', e);
        }

        const verificationStatus = walletStatus.identityVerification;

        // Handle each status case
        if (verificationStatus === 'completed') {
            setStatus('completed');
            return;
        } else if (verificationStatus === 'processing' || verificationStatus === 'accepted_awaiting_consumption') {
            setStatus('in_progress');
            return;
        } else if (verificationStatus === 'rejected') {
            setStatus('rejected');
            return;
        }

        // If not_started, start the flow
        startFlow();
    };

    const startFlow = async () => {
        try {
            setStatus('processing');

            const wallet = getCurrentWallet();
            if (!wallet) {
                setStatus('cancelled');
                return;
            }

            const firstName = wallet.identity_attributes?.first_name?.value || wallet.user_details?.first_name;
            const lastName = wallet.identity_attributes?.last_name?.value || wallet.user_details?.last_name;
            const dob = wallet.identity_attributes?.date_of_birth?.value || wallet.user_details?.date_of_birth; // e.g., "1990-01-01"

            if (!firstName || !lastName || !dob) {
                setStatus('cancelled');
                return;
            }

            // Using Expo Linking to get schemes
            const redirectUrl = Linking.createURL('verify-identity');
            const successUrl = `${redirectUrl}?status=success`;
            const cancelUrl = `${redirectUrl}?status=cancelled`;

            const response = await startIdentityVerification(
                wallet,
                firstName,
                lastName,
                dob,
                successUrl,
                cancelUrl
            );

            const result = await WebBrowser.openAuthSessionAsync(
                response.redirect_url,
                redirectUrl,
                {
                    preferEphemeralSession: true,
                }
            );

            if (result.type === 'success' && result.url) {
                if (result.url.includes('status=success')) {
                    // Update global wallet status immediately
                    try { await refreshWalletStatus(); } catch (e) { console.warn('Status refresh failed after verification', e); }
                    // Navigate directly to startup without showing success screen
                    router.replace('/startup');
                    return;
                } else if (result.url.includes('status=cancelled')) {
                    setStatus('cancelled');
                } else {
                    // Fallback - treat as success
                    try { await refreshWalletStatus(); } catch (e) { console.warn('Status refresh failed after verification', e); }
                    router.replace('/startup');
                    return;
                }
            } else if (result.type === 'cancel' || result.type === 'dismiss') {
                setStatus('cancelled');
            }
        } catch (error) {
            console.error(error);
            setStatus('cancelled');
        }
    };

    return (
        <BackgroundImage>
            <View style={{ flex: 1, paddingTop: insets.top }}>
                <ScreenHeader title="" showBack={false} />

                <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
                    <PowmText variant="title" align="center" style={{ marginBottom: powmSpacing.xl }}>
                        Verify Identity
                    </PowmText>

                    <LoadingOverlay visible={status === 'processing'} message="Verifying Identity..." />

                    {status !== 'idle' && status !== 'processing' && STATUS_CONFIGS[status] && (
                        <StatusCard
                            config={STATUS_CONFIGS[status]}
                            onTryAgain={startFlow}
                            onReturnHome={() => router.replace('/startup')}
                        />
                    )}
                </Animated.View>
            </View>
        </BackgroundImage>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: powmSpacing.lg,
        paddingTop: powmSpacing.xxl,
    },
    resultContainer: {
        alignItems: 'center',
        padding: powmSpacing.xl,
        backgroundColor: powmColors.glass.background,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: powmColors.glass.border,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: powmSpacing.xl,
        borderWidth: 1,
        borderColor: powmColors.successGreen,
    },
    button: {
        width: '100%',
    }
});
