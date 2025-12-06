import { Column, PowmIcon, PowmText, Row } from '@/components/ui';
import { powmColors, powmSpacing } from '@/theme/powm-tokens';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, ImageBackground, Pressable, StyleSheet, View } from 'react-native';

interface TicketDetailModalProps {
  visible: boolean;
  onClose: () => void;
  ticket: { firstname?: string; lastname?: string; age?: string; country?: string } | null;
  ticketId: string;
}

export const TicketDetailModal: React.FC<TicketDetailModalProps> = ({ 
  visible, 
  onClose, 
  ticket, 
  ticketId 
}) => {
  const gradientShine = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(gradientShine, { toValue: 1, duration: 3000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(gradientShine, { toValue: 0, duration: 3000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ])
      ).start();
    }
  }, [visible]);

  if (!visible || !ticket) return null;

  return (
    <>
      <Pressable style={styles.overlay} onPress={onClose} />
      <View style={styles.container}>
        <ImageBackground
          source={require('@/assets/powm/illustrations/powm_draw.png')} // Check path
          style={styles.card}
          imageStyle={styles.cardImage}
          resizeMode="cover"
        >
          {/* Dark Base */}
          <LinearGradient
            colors={['#0f0718', '#1a1625', '#120b29']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[StyleSheet.absoluteFill, { opacity: 0.95 }]}
          />

          {/* Shine */}
          <Animated.View style={[StyleSheet.absoluteFill, { opacity: gradientShine }]}>
            <LinearGradient
              colors={['rgba(88, 28, 135, 0.1)', 'rgba(0, 0, 0, 0)', 'rgba(124, 58, 237, 0.15)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>

          <View style={styles.border} />

          <View style={styles.content}>
            <Column gap={powmSpacing.md}>
              <View>
                <PowmText variant="text" color={powmColors.inactive} style={{ letterSpacing: 1 }}>POWM ID TICKET</PowmText>
                <PowmText variant="title" style={styles.ticketId}>{ticketId}</PowmText>
                <PowmText variant="text" color="rgba(255,255,255,0.4)" style={{ marginTop: 2 }}>Expires in 24h</PowmText>
              </View>

              <View style={styles.divider} />

              <Row justify="space-between" align="center">
                <Column gap={4}>
                  <PowmText variant="text" color={powmColors.inactive}>Name</PowmText>
                  {ticket.firstname && <PowmText variant="subtitleSemiBold" style={{ fontSize: 22 }}>{ticket.firstname}</PowmText>}
                  {ticket.lastname && <PowmText variant="subtitle" style={{ fontSize: 18, color: '#ccc' }}>{ticket.lastname}</PowmText>}
                </Column>
                
                <View style={styles.qrWrapper}>
                   <View style={styles.qrCode}>
                     <PowmIcon name="qrcode" size={90} color={powmColors.mainBackground} />
                   </View>
                </View>
              </Row>
            </Column>
          </View>
        </ImageBackground>
        
        <Pressable onPress={onClose} style={styles.closeBtn}>
           <View style={styles.closeIcon}>
              <PowmIcon name="cross" size={20} color="rgba(255,255,255,0.5)" />
           </View>
        </Pressable>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.9)', zIndex: 998 },
  container: { position: 'absolute', top: '25%', left: powmSpacing.lg, right: powmSpacing.lg, zIndex: 999 },
  card: { borderRadius: 24, overflow: 'hidden', backgroundColor: '#0f0718', shadowColor: '#000', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.6, shadowRadius: 30, elevation: 20 },
  cardImage: { opacity: 0.4, transform: [{ translateX: -800 }, { translateY: -500 }, { scale: 0.4 }] },
  border: { ...StyleSheet.absoluteFillObject, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  content: { padding: 24, paddingBottom: 32 },
  ticketId: { fontSize: 26, marginTop: 4, letterSpacing: 2, color: '#fff' },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: 16 },
  qrWrapper: { padding: 8, backgroundColor: 'white', borderRadius: 16 },
  qrCode: { width: 90, height: 90, alignItems: 'center', justifyContent: 'center' },
  closeBtn: { alignItems: 'center', marginTop: 20 },
  closeIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' }
});