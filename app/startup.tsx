import { PowmIcon } from '@/components';
import { PowmText } from '@/components/ui';
import { consumeIdentityVerification } from '@/sdk-extension';
import { Wallet } from '@/sdk-extension/structs';
import { powmColors } from '@/theme/powm-tokens';
import { loadCurrentWallet } from '@/wallet/service';
import { useWalletStatus } from '@/wallet/status';
import { hasWallet, isSecureStorageAvailable, updateWalletFile } from '@/wallet/storage';
import * as LocalAuthentication from 'expo-local-authentication';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, AppState, StatusBar, StyleSheet, View } from 'react-native';

const ERROR_MESSAGES = {
    STORAGE: {
        title: 'Secure Storage Not Available',
        messages: [
            'This device does not support secure storage, which is required for the Powm wallet.',
            'Please use a device with secure storage support.',
        ],
    },
    CONNECTION: {
        title: 'Connection Failed',
        messages: [
            'Unable to connect to the Powm server to verify wallet status.',
            'Please check your internet connection and restart the app.',
        ],
    },
    CONSUMPTION: {
        title: 'Verification Consumption Failed',
        messages: [
            'Unable to complete identity verification setup.',
            'Please restart the app and try again.',
        ],
    },
    AUTH: {
        title: 'Authentication Failed',
        messages: [
            'Unable to authenticate your identity.',
            'Please restart the app and try again.',
        ],
    },
    SECURITY: {
        title: 'Device Security Required',
        messages: [
            'Your device does not have a screen lock configured.',
            'Please set up a Biometrics, PIN, Pattern, or Password in your device settings to use this app.',
        ],
    },
};

type ErrorType = keyof typeof ERROR_MESSAGES;

export default function StartupScreen() {
    const router = useRouter();
    const { refreshWalletStatus } = useWalletStatus();

    // Animation refs
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;

    // Logic refs
    const hasNavigated = useRef(false);
    const needsAuth = useRef(false);
    const isStatusErrorRef = useRef(false);

    // Single source of truth for errors
    const [error, setError] = useState<ErrorType | null>(null);
    
    // SECURITY helper
    const checkSecurity = async () =>
        (await LocalAuthentication.getEnrolledLevelAsync()) !== LocalAuthentication.SecurityLevel.NONE;

    // Authentication helper
    const checkAuthentication = async (): Promise<boolean> => {
        let authenticated = false;

        while (!authenticated && !hasNavigated.current) {
            try {
                const result = await LocalAuthentication.authenticateAsync();

                if (result.success) {
                    authenticated = true;
                    needsAuth.current = false;
                } else if (result.error === 'user_cancel') {
                    // User cancelled, retry authentication loop
                    continue;
                } else if (result.error === 'system_cancel') {
                    // System cancelled (incoming call, app switched, etc.)
                    console.log('[Startup] Authentication cancelled by system, waiting for app focus');
                    needsAuth.current = true;
                    return false;
                } else {
                    // Other error, retry after delay
                    console.error('[Startup] Authentication failed:', result.error);
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
            } catch (authError: any) {
                // Handle activity lifecycle errors on Android
                console.warn('[Startup] Auth error (likely activity destroyed):', authError.message);
                needsAuth.current = true;
                return false;
            }
        }
        return authenticated;
    };

    // Consumption helper
    const checkVerificationConsumption = async (wallet: Wallet, currentStatus: any): Promise<boolean> => {
        if (currentStatus?.identityVerification !== 'accepted_awaiting_consumption') {
            return true; // No consumption needed
        }

        console.log('[Startup] Identity verification awaiting consumption, consuming...');
        try {
            const consumeResult = await consumeIdentityVerification(wallet);
            console.log('[Startup] Successfully consumed identity verification');

            // Update wallet with the new identity attributes
            wallet.identity_attributes = consumeResult.identity_attributes;
            await updateWalletFile(wallet);
            console.log('[Startup] Updated wallet saved with identity attributes');

            // Refresh status to get updated verification status
            const updatedStatus = await refreshWalletStatus();

            // Verify status is now completed
            if (!updatedStatus || updatedStatus.identityVerification !== 'completed') {
                console.error('[Startup] Expected verification status to be completed, but got:', updatedStatus?.identityVerification);
                return false;
            }

            console.log('[Startup] Identity verification completed successfully');
            return true;
        } catch (consumeError) {
            console.error('[Startup] Failed to consume identity verification:', consumeError);
            return false;
        }
    };

    useEffect(() => {
        const checkWallet = async () => {
            try {
                // Initial delay for splash/logo
                await new Promise(resolve => setTimeout(resolve, 1000));

                // 1. Check security
                if (!(await checkSecurity())) {
                    console.error('[Startup] Device security not enabled');
                    setError('SECURITY');
                    return;
                }

                // 2. Check Storage
                if (!(await isSecureStorageAvailable())) {
                    console.error('[Startup] Secure storage not available');
                    setError('STORAGE');
                    return;
                }

                // 3. Check Wallet Existence, navigate out otherwise
                if (!(await hasWallet())) {
                    if (!hasNavigated.current) {
                        hasNavigated.current = true;
                        router.replace('/onboarding'); // Navigate to onboarding if no wallet
                    }
                    return;
                }

                // 4. Authenticate (biometrics/pin)
                if (!(await checkAuthentication())) {
                    return;
                }

                // 5. Load Wallet from secure storage
                const wallet = await loadCurrentWallet(true);
                if (!wallet) {
                    console.error('[Startup] Failed to load wallet');
                    setError('STORAGE');
                    return;
                }
                console.log('[Startup] Wallet loaded:', wallet.id);

                // 6. Check Status with server
                let walletStatus;
                try {
                    walletStatus = await refreshWalletStatus();
                } catch (e) {
                    console.error('[Startup] Wallet status check failed:', e);
                    isStatusErrorRef.current = true;
                    setError('CONNECTION');
                    return;
                }

                // 7. Consume Verification if needed
                if (!(await checkVerificationConsumption(wallet, walletStatus))) {
                    setError('CONSUMPTION');
                    return;
                }

                // 8. Navigate outta here
                if (!hasNavigated.current) {
                    hasNavigated.current = true;
                    router.replace('/home');
                }

            } catch (err) {
                console.error('[Startup] Unhandled Error:', err);
                if (!isStatusErrorRef.current) {
                    setError('STORAGE');
                }
            }
        };

        checkWallet();

        // Listen for app state changes to retry authentication if needed
        const subscription = AppState.addEventListener('change', (nextAppState) => {
            if (nextAppState === 'active' && needsAuth.current && !hasNavigated.current) {
                setTimeout(() => {
                    needsAuth.current = false;
                    console.log('[Startup] App became active, retrying authentication');
                    checkWallet(); // Restart the check flow
                }, 300);
            }
        });

        // Animations
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
        ]).start();

        return () => subscription.remove();
    }, []);

    const renderError = () => {
        if (!error) return null;

        const { title, messages } = ERROR_MESSAGES[error];

        return (
            <View style={styles.errorContainer}>
                <PowmIcon name="powmLogo" size={80} color={powmColors.electricMain} />
                <PowmText variant="titleBold" style={styles.errorTitle}>
                    {title}
                </PowmText>
                {messages.map((msg, idx) => (
                    <PowmText key={idx} variant="text" style={styles.errorMessage}>
                        {msg}
                    </PowmText>
                ))}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={powmColors.mainBackground} />

            {error ? renderError() : (
                <Animated.View
                    style={[
                        styles.logoContainer,
                        {
                            opacity: fadeAnim,
                            transform: [{ scale: scaleAnim }],
                        },
                    ]}
                >
                    <PowmIcon name="powmLogo" size={120} color={powmColors.electricMain} />
                </Animated.View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: powmColors.mainBackground,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        gap: 20,
    },
    errorTitle: {
        color: powmColors.deletionRedHard,
        textAlign: 'center',
        marginTop: 20,
    },
    errorMessage: {
        color: powmColors.gray,
        textAlign: 'center',
        lineHeight: 24,
    },
});
