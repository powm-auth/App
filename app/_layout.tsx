import { FootBar } from '@/components/powm';
import { powmColors } from '@/theme/powm-tokens';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <View style={styles.container}>
        <View style={styles.content}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: {
                backgroundColor: powmColors.mainBackground,
              },
              gestureEnabled: false,
              animation: 'fade', // Default fade for smooth page transitions
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="history" />
            <Stack.Screen name="profile" />
            
            {/* ✅ FIXED: 'fullScreenModal' prevents the "popup card" scaling effect on Home */}
            <Stack.Screen 
              name="scan" 
              options={{
                presentation: 'fullScreenModal',
                gestureEnabled: false,
                animation: 'fade', // Fade in the camera for a premium feel
              }}
            />
            
            {/* Modals */}
            <Stack.Screen
              name="create-ticket"
              options={{
                animation: 'slide_from_bottom',
                presentation: 'modal',
                gestureEnabled: true,
              }}
            />
            <Stack.Screen
              name="validate-identity"
              options={{
                animation: 'slide_from_bottom',
                presentation: 'modal', // Sheet style over the camera/home
                gestureEnabled: true,
              }}
            />
          </Stack>
        </View>
        
        {/* Footer sits outside the stack */}
        <FootBar />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: powmColors.mainBackground,
    flexDirection: 'column',
  },
  content: {
    flex: 1, 
  },
});