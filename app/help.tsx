import {
    BackgroundImage,
    Column,
    PowmIcon,
    PowmText,
    Row,
} from '@/components/powm';
import { powmColors, powmRadii, powmSpacing } from '@/theme/powm-tokens';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Easing,
    LayoutAnimation,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    UIManager,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface FAQItemProps {
  question: string;
  answer: string;
  index: number;
}

const FAQItem = ({ question, answer, index }: FAQItemProps) => {
  const [expanded, setExpanded] = useState(false);
  
  // Entrance Animations
  const translateY = useRef(new Animated.Value(20)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  
  // Chevron Rotation Animation
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 500,
        delay: index * 80,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
    
    Animated.timing(rotateAnim, {
      toValue: expanded ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  return (
    <Animated.View style={[styles.faqCard, { opacity, transform: [{ translateY }] }]}>
      <Pressable onPress={toggleExpand} style={styles.questionRow}>
        <Row align="center" gap={12} style={{ flex: 1 }}>
          <View style={styles.dot} />
          <PowmText variant="subtitleSemiBold" style={{ flex: 1, fontSize: 15 }}>
            {question}
          </PowmText>
        </Row>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <PowmIcon name="chevron" size={20} color={powmColors.inactive} />
        </Animated.View>
      </Pressable>
      
      {expanded && (
        <View style={styles.answerContainer}>
          <PowmText variant="text" color={powmColors.inactive} style={styles.answerText}>
            {answer}
          </PowmText>
        </View>
      )}
    </Animated.View>
  );
};

export default function HelpScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const faqs = [
    {
      question: "What is Powm?",
      answer: "Powm is your secure digital identity wallet. It allows you to prove who you are (age, name, etc.) without revealing sensitive documents or unnecessary personal data to third parties."
    },
    {
      question: "How is my data stored?",
      answer: "Your data is stored locally on your device, encrypted with military-grade security. Powm servers do not hold your personal documents or identity information. You are the only owner of your data."
    },
    {
      question: "What is 'Double Anonymat'?",
      answer: "Double anonymity means that when you prove your identity to a service (like verifying age for Instagram), neither the service knows who you are (just that you are +18), nor does Powm know which service you are verifying with."
    },
    {
      question: "How do ID Tickets work?",
      answer: "ID Tickets are one-time-use secure proofs. You generate a ticket (e.g., 'Proof of Age'), and a third party scans it to verify the claim. Once used or expired (24h), the ticket becomes invalid."
    },
    {
      question: "What if I lose my phone?",
      answer: "Since data is stored locally, losing your phone means losing your data unless you have set up a recovery method. You can use your 'Crypto Codes' or an encrypted cloud backup to restore your identity on a new device."
    },
    {
      question: "Is my history shared?",
      answer: "No. Your activity history is stored strictly on your device for your own reference. You can delete it at any time from the History page."
    }
  ];

  return (
    <BackgroundImage>
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.content,
            { paddingTop: insets.top + powmSpacing.lg, paddingBottom: insets.bottom + powmSpacing.xl },
          ]}
        >
          {/* Header */}
          <Row align="center" style={styles.header}>
            <Pressable onPress={() => router.back()} hitSlop={10} style={styles.backButton}>
              <PowmIcon name="chevron" size={24} color={powmColors.white} style={{ transform: [{ rotate: '180deg' }] }} />
            </Pressable>
            <PowmText variant="title" style={{ flex: 1, textAlign: 'center', marginRight: 40 }}>
              Help & FAQ
            </PowmText>
          </Row>

          <Column gap={powmSpacing.md}>
            {faqs.map((item, index) => (
              <FAQItem 
                key={index} 
                question={item.question} 
                answer={item.answer} 
                index={index} 
              />
            ))}
          </Column>

          <View style={styles.footerNote}>
            <PowmText variant="text" color={powmColors.gray} align="center" style={{ fontSize: 12 }}>
              Still need help? Contact support at support@powm.com
            </PowmText>
          </View>

        </ScrollView>
      </View>
    </BackgroundImage>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  content: { paddingHorizontal: powmSpacing.lg },
  header: { marginBottom: powmSpacing.xl },
  backButton: {
    width: 40, height: 40,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
  },
  
  // FAQ Card
  faqCard: {
    backgroundColor: 'rgba(30, 28, 40, 0.6)',
    borderRadius: powmRadii.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  dot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: powmColors.electricMain,
  },
  answerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingLeft: 34, // Indent text to align with question text (skipping dot)
  },
  answerText: {
    lineHeight: 20,
    fontSize: 13,
  },
  
  footerNote: {
    marginTop: powmSpacing.xxl,
    opacity: 0.6,
  },
});