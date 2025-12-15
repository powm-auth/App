import { StyleSheet } from 'react-native';
import { powmSpacing } from './powm-spacing';

export const powmStyles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: powmSpacing.xl,
        backgroundColor: 'rgba(0,0,0,0.85)',
    },
    modalContent: {
        width: '100%',
        maxWidth: 340,
        padding: powmSpacing.xl,
        backgroundColor: 'rgba(30, 28, 40, 0.95)',
    },
});
