import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Button, YStack, Paragraph, H2 } from 'tamagui';

export function MainApp() {
  return (
    <View style={styles.container}>
      <YStack f={1} ai="center" jc="center" gap="$3" p="$4">
        <H2>Hello Tamagui 🚀</H2>
        <Paragraph theme="alt1">This is powered by Tamagui.</Paragraph>
        <Button>Click me</Button>
      </YStack>
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
});
