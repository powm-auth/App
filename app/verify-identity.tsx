import {
    BackgroundImage,
    Button,
    LoadingOverlay,
    PowmIcon,
    PowmText,
    ScreenHeader
} from '@/components';
import { powmColors, powmSpacing } from '@/theme/powm-tokens';
import { useWalletStatus } from '@/wallet/status';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
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
            const result = await WebBrowser.openAuthSessionAsync(
                'https://flow.complycube.com/test_ZmE5OTNlZWQ0ODQ3YWQyMmVjYmI2Nzg3MTZmMmU3OWZhYjMzOWNlYmM2ZjZiZDgyMWYwZGExMGRlZTRkMTA2ZjYwODllYWQ3ZmIxMGU0OTdhN2ViMTkwZTU0YTMzMTExM2E2M2ZiZGNlNjAwNjY3YWRkOGUxZWZkOGZlMjFmNWMyNzEzNzA4YTdlYThjMGRkMGIzNTA1ZDQ4MmM1NWQ2NTJkNGFhYWI1ZjFkYzZmMGEwZjk3MzAyMzZjYmI5Yjc5NWU3ZTg0MGY0YzRkODZjOTk4YjYwOGM3MzllNGMwM2I3MGVjZmI3YjZhZDVlNjAwODE4YzRkZTE1ZWNjNGFmNzNmYmFmYzJhNDkxMmMwMWRkMDI1MjA1ZGZkOTY0MTEzNzRmZTNhNDc3ZTBmMDNmZjM2ZTEzZmNlMzIyMjQ0MmI3MGI2NWQyMGViNGFjYTdlZTY4OWMzYjQxYWY3ZTM1Yjg4ODk1MzYzMjUyYWNiZjA2MTdlMGQzNjU5NTZmYmFkNjQ2ODI1Yjg3MTA1MDJiYzQzN2NiMjIyOWNmZDI3NzQ=?theme=dark',
                'app://',
                {
                    preferEphemeralSession: true,
                }
            );

            if (result.type === 'success' && result.url) {
                if (result.url.includes('success')) {
                    // Update global wallet status immediately
                    // We catch errors here so we don't fail the success screen if just the status update fails
                    try { await refreshWalletStatus(); } catch (e) { console.warn('Status refresh failed after verification', e); }
                    setStatus('success');
                } else if (result.url.includes('cancelled')) {
                    setStatus('cancelled');
                } else {
                    // Default fallback if URL param logic isn't perfect
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
                            <View style={styles.iconContainer}>
                                <PowmIcon name="check" size={64} color={powmColors.successGreen} />
                            </View>
                            <PowmText variant="title" align="center" style={{ marginBottom: powmSpacing.sm }}>
                                Verification Successful
                            </PowmText>
                            <PowmText variant="text" color={powmColors.inactive} align='center' style={{ marginBottom: powmSpacing.xl }}>
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
