import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Button, Alert } from 'react-native';
import { useUsers, useCreateUser } from '../hooks';
import { YStack, XStack, Card, Input, Button as TamaguiButton, Spinner } from 'tamagui';

export function UserList() {
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserUsername, setNewUserUsername] = useState('');

  const { data: users, isLoading, error, refetch } = useUsers();
  const createUserMutation = useCreateUser();

  const handleCreateUser = () => {
    if (!newUserName || !newUserEmail || !newUserUsername) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    createUserMutation.mutate(
      {
        name: newUserName,
        email: newUserEmail,
        username: newUserUsername,
      },
      {
        onSuccess: () => {
          setNewUserName('');
          setNewUserEmail('');
          setNewUserUsername('');
          Alert.alert('Success', 'User created successfully!');
        },
        onError: (error) => {
          Alert.alert('Error', 'Failed to create user');
        },
      }
    );
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Spinner size="large" />
        <Text>Loading users...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error: {error.message}</Text>
        <TamaguiButton onPress={() => refetch()}>Retry</TamaguiButton>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <YStack space="$4">
        <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>
          TanStack Query Demo
        </Text>

        {/* Create User Form */}
        <Card padding="$4" backgroundColor="$gray1">
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
            Create New User
          </Text>
          <YStack space="$3">
            <Input
              placeholder="Name"
              value={newUserName}
              onChangeText={setNewUserName}
            />
            <Input
              placeholder="Email"
              value={newUserEmail}
              onChangeText={setNewUserEmail}
              keyboardType="email-address"
            />
            <Input
              placeholder="Username"
              value={newUserUsername}
              onChangeText={setNewUserUsername}
            />
            <TamaguiButton
              onPress={handleCreateUser}
              disabled={createUserMutation.isPending}
              backgroundColor="$blue10"
            >
              {createUserMutation.isPending ? (
                <XStack space="$2" alignItems="center">
                  <Spinner size="small" color="white" />
                  <Text style={{ color: 'white' }}>Creating...</Text>
                </XStack>
              ) : (
                <Text style={{ color: 'white' }}>Create User</Text>
              )}
            </TamaguiButton>
          </YStack>
        </Card>

        {/* Users List */}
        <Card padding="$4" backgroundColor="$gray1">
          <XStack justifyContent="space-between" alignItems="center" marginBottom={16}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
              Users ({users?.length || 0})
            </Text>
            <TamaguiButton onPress={() => refetch()} size="$3">
              Refresh
            </TamaguiButton>
          </XStack>

          <YStack space="$3">
            {users?.map((user) => (
              <Card key={user.id} padding="$3" backgroundColor="$gray2">
                <Text style={{ fontWeight: 'bold' }}>{user.name}</Text>
                <Text style={{ color: '$gray11' }}>@{user.username}</Text>
                <Text style={{ color: '$gray10' }}>{user.email}</Text>
              </Card>
            ))}
          </YStack>
        </Card>
      </YStack>
    </ScrollView>
  );
}
