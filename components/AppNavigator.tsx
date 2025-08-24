import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { YStack, XStack, Button as TamaguiButton, Card } from 'tamagui';
import { UserList } from './UserList';
import { Posts } from './Posts';
import { Products } from './Products';
import { ProductsInfinite } from './ProductsInfinite';
import { GroceryApp } from './GroceryApp';
import ProductApp from './ProductApp';

type Screen = 'grocery' | 'users' | 'posts' | 'products' | 'productsInfinite';

export function AppNavigator() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('grocery');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'grocery':
        return <GroceryApp />;
      case 'users':
        return <UserList />;
      case 'posts':
        return <Posts />;
      case 'products':
        return <Products />;
      case 'productsInfinite':
        return <ProductsInfinite />;
      default:
        return <GroceryApp />;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Navigation Header */}
      {/* <Card padding="$3" backgroundColor="$blue1" marginBottom="$2">
        <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 }}>
          App Examples
        </Text>
        <YStack space="$2">
          <XStack space="$2" justifyContent="center" flexWrap="wrap">
            <TamaguiButton
              onPress={() => setCurrentScreen('grocery')}
              backgroundColor={currentScreen === 'grocery' ? '$blue10' : '$gray10'}
              color={currentScreen === 'grocery' ? 'white' : 'black'}
              size="$2"
            >
              🛒 Grocery App
            </TamaguiButton>
            <TamaguiButton
              onPress={() => setCurrentScreen('products')}
              backgroundColor={currentScreen === 'products' ? '$blue10' : '$gray10'}
              color={currentScreen === 'products' ? 'white' : 'black'}
              size="$2"
            >
              📱 Products (API)
            </TamaguiButton>
            <TamaguiButton
              onPress={() => setCurrentScreen('productsInfinite')}
              backgroundColor={currentScreen === 'productsInfinite' ? '$blue10' : '$gray10'}
              color={currentScreen === 'productsInfinite' ? 'white' : 'black'}
              size="$2"
            >
              ♾️ Products (Infinite)
            </TamaguiButton>
          </XStack>
          <XStack space="$2" justifyContent="center" flexWrap="wrap">
            <TamaguiButton
              onPress={() => setCurrentScreen('users')}
              backgroundColor={currentScreen === 'users' ? '$blue10' : '$gray10'}
              color={currentScreen === 'users' ? 'white' : 'black'}
              size="$2"
            >
              👥 Users (Basic)
            </TamaguiButton>
            <TamaguiButton
              onPress={() => setCurrentScreen('posts')}
              backgroundColor={currentScreen === 'posts' ? '$blue10' : '$gray10'}
              color={currentScreen === 'posts' ? 'white' : 'black'}
              size="$2"
            >
              📝 Posts (Advanced)
            </TamaguiButton>
          </XStack>
        </YStack>
      </Card> */}

      {/* Screen Content */}
      {/* {renderScreen()} */}
      {/* <GroceryApp /> */}
      <ProductApp />
    </View>
  );
}
