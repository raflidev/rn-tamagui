import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { YStack, XStack, Button as TamaguiButton, Card } from 'tamagui';
import { UserList } from './UserList';
import { Posts } from './Posts';

type Screen = 'users' | 'posts';

export function AppNavigator() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('users');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'users':
        return <UserList />;
      case 'posts':
        return <Posts />;
      default:
        return <UserList />;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Navigation Header */}
      <Card padding="$3" backgroundColor="$blue1" marginBottom="$2">
        <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 }}>
          TanStack Query Examples
        </Text>
        <XStack space="$2" justifyContent="center">
          <TamaguiButton
            onPress={() => setCurrentScreen('users')}
            backgroundColor={currentScreen === 'users' ? '$blue10' : '$gray10'}
            color={currentScreen === 'users' ? 'white' : 'black'}
          >
            Users (Basic)
          </TamaguiButton>
          <TamaguiButton
            onPress={() => setCurrentScreen('posts')}
            backgroundColor={currentScreen === 'posts' ? '$blue10' : '$gray10'}
            color={currentScreen === 'posts' ? 'white' : 'black'}
          >
            Posts (Advanced)
          </TamaguiButton>
        </XStack>
      </Card>

      {/* Screen Content */}
      {renderScreen()}
    </View>
  );
}
