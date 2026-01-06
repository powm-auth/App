import {
    BackgroundImage,
    Button,
    LoadingOverlay,
    PowmIcon,
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
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function VerifyIdentityScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { refreshWalletStatus } = useWalletStatus();
    const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'cancelled'>('idle');

    useEffect(() => {
        // Start flow automatically when screen mounts
        startFlow();
    }, []);

    const startFlow = async () => {
        try {
            setStatus('processing');

            const wallet = getCurrentWallet();
            if (!wallet) {
                Alert.alert("Error", "Wallet not loaded");
                setStatus('cancelled');
                return;
            }

            const firstName = wallet.attributes.first_name?.value;
            const lastName = wallet.attributes.last_name?.value;
            const dob = wallet.attributes.date_of_birth?.value; // e.g., "1990-01-01"

            if (!firstName || !lastName || !dob) {
                Alert.alert("Missing Info", "First Name, Last Name, and Date of Birth are required to start verification.");
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
                    // We catch errors here so we don't fail the success screen if just the status update fails
                    try { await refreshWalletStatus(); } catch (e) { console.warn('Status refresh failed after verification', e); }
                    setStatus('success');
                } else if (result.url.includes('status=cancelled')) {
                    setStatus('cancelled');
                } else {
                    // Fallback
                    try { await refreshWalletStatus(); } catch (e) { console.warn('Status refresh failed after verification', e); }
                    setStatus('success');
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

                <View style={styles.container}>
                    <PowmText variant="title" align="center" style={{ marginBottom: powmSpacing.xl }}>
                        Verify Identity
                    </PowmText>

                    <LoadingOverlay visible={status === 'processing'} message="Verifying Identity..." />

                    {status === 'success' && (
                        <View style={styles.resultContainer}>
                            <View style={[styles.iconContainer, { marginBottom: powmSpacing.xxl }]}>
                                <PowmIcon name="check" size={64} color={powmColors.successGreen} />
                            </View>
                            <PowmText variant="title" align="center" style={{ marginBottom: powmSpacing.sm }}>
                                Verification Successful
                            </PowmText>
                            <PowmText variant="text" color={powmColors.inactive} align='center' style={{ marginBottom: powmSpacing.xxl * 1.5 }}>
                                Your identity has been successfully verified.
                            </PowmText>

                            <Button
                                title="Return to Home"
                                onPress={() => router.replace('/startup')}
                                style={styles.button}
                                variant="primary"
                            />
                        </View>
                    )}

                    {status === 'cancelled' && (
                        <View style={styles.resultContainer}>
                            <View style={[styles.iconContainer, { borderColor: powmColors.deletionRedMain }]}>
                                <PowmIcon name="cross" size={64} color={powmColors.deletionRedMain} />
                            </View>
                            <PowmText variant="title" align="center" style={{ marginBottom: powmSpacing.sm }}>
                                Verification Cancelled
                            </PowmText>
                            <PowmText variant="text" color={powmColors.inactive} align='center' style={{ marginBottom: powmSpacing.xl }}>
                                The verification process was incomplete or cancelled.
                            </PowmText>

                            <View style={{ gap: powmSpacing.md, width: '100%' }}>
                                <Button
                                    title="Try Again"
                                    onPress={startFlow}
                                    variant="primary"
                                />
                                <Button
                                    title="Return to Home"
                                    onPress={() => router.replace('/startup')}
                                    variant="secondary"
                                />
                            </View>
                        </View>
                    )}
                </View>
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
