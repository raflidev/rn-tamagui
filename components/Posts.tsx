import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { useInfinitePosts, useCreatePost, useUpdatePost, useDeletePost } from '../hooks';
import { YStack, XStack, Card, Input, Button as TamaguiButton, Spinner, TextArea } from 'tamagui';

export function Posts() {
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostBody, setNewPostBody] = useState('');
  const [editingPost, setEditingPost] = useState<{ id: number; title: string; body: string } | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch,
  } = useInfinitePosts();

  const createPostMutation = useCreatePost();
  const updatePostMutation = useUpdatePost();
  const deletePostMutation = useDeletePost();

  const handleCreatePost = () => {
    if (!newPostTitle || !newPostBody) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    createPostMutation.mutate(
      {
        title: newPostTitle,
        body: newPostBody,
        userId: 1,
      },
      {
        onSuccess: () => {
          setNewPostTitle('');
          setNewPostBody('');
          Alert.alert('Success', 'Post created successfully!');
        },
        onError: () => {
          Alert.alert('Error', 'Failed to create post');
        },
      }
    );
  };

  const handleUpdatePost = () => {
    if (!editingPost) return;

    updatePostMutation.mutate(
      {
        id: editingPost.id,
        updates: {
          title: editingPost.title,
          body: editingPost.body,
        },
      },
      {
        onSuccess: () => {
          setEditingPost(null);
          Alert.alert('Success', 'Post updated successfully!');
        },
        onError: () => {
          Alert.alert('Error', 'Failed to update post');
        },
      }
    );
  };

  const handleDeletePost = (id: number) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this post?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deletePostMutation.mutate(id, {
              onSuccess: () => {
                Alert.alert('Success', 'Post deleted successfully!');
              },
              onError: () => {
                Alert.alert('Error', 'Failed to delete post');
              },
            });
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Spinner size="large" />
        <Text>Loading posts...</Text>
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

  const allPosts = data?.pages.flatMap(page => page.posts) || [];

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <YStack space="$4">
        <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>
          Posts with Infinite Query
        </Text>

        {/* Create Post Form */}
        <Card padding="$4" backgroundColor="$gray1">
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
            Create New Post
          </Text>
          <YStack space="$3">
            <Input
              placeholder="Title"
              value={newPostTitle}
              onChangeText={setNewPostTitle}
            />
            <TextArea
              placeholder="Body"
              value={newPostBody}
              onChangeText={setNewPostBody}
              numberOfLines={3}
            />
            <TamaguiButton
              onPress={handleCreatePost}
              disabled={createPostMutation.isPending}
              backgroundColor="$green10"
            >
              {createPostMutation.isPending ? (
                <XStack space="$2" alignItems="center">
                  <Spinner size="small" color="white" />
                  <Text style={{ color: 'white' }}>Creating...</Text>
                </XStack>
              ) : (
                <Text style={{ color: 'white' }}>Create Post</Text>
              )}
            </TamaguiButton>
          </YStack>
        </Card>

        {/* Posts List */}
        <Card padding="$4" backgroundColor="$gray1">
          <XStack justifyContent="space-between" alignItems="center" marginBottom={16}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
              Posts ({allPosts.length})
            </Text>
            <TamaguiButton onPress={() => refetch()} size="$3">
              Refresh
            </TamaguiButton>
          </XStack>

          <YStack space="$3">
            {allPosts.map((post) => (
              <Card key={post.id} padding="$3" backgroundColor="$gray2">
                {editingPost?.id === post.id ? (
                  <YStack space="$2">
                    <Input
                      value={editingPost.title}
                      onChangeText={(text) => setEditingPost({ ...editingPost, title: text })}
                    />
                    <TextArea
                      value={editingPost.body}
                      onChangeText={(text) => setEditingPost({ ...editingPost, body: text })}
                      numberOfLines={2}
                    />
                    <XStack space="$2">
                      <TamaguiButton
                        onPress={handleUpdatePost}
                        disabled={updatePostMutation.isPending}
                        size="$2"
                        backgroundColor="$blue10"
                      >
                        {updatePostMutation.isPending ? 'Saving...' : 'Save'}
                      </TamaguiButton>
                      <TamaguiButton
                        onPress={() => setEditingPost(null)}
                        size="$2"
                        backgroundColor="$gray10"
                      >
                        Cancel
                      </TamaguiButton>
                    </XStack>
                  </YStack>
                ) : (
                  <YStack space="$2">
                    <Text style={{ fontWeight: 'bold' }}>{post.title}</Text>
                    <Text style={{ color: '$gray11' }}>{post.body}</Text>
                    <Text style={{ color: '$gray10', fontSize: 12 }}>
                      User ID: {post.userId}
                    </Text>
                    <XStack space="$2">
                      <TamaguiButton
                        onPress={() => setEditingPost({ id: post.id, title: post.title, body: post.body })}
                        size="$2"
                        backgroundColor="$blue10"
                      >
                        Edit
                      </TamaguiButton>
                      <TamaguiButton
                        onPress={() => handleDeletePost(post.id)}
                        size="$2"
                        backgroundColor="$red10"
                      >
                        Delete
                      </TamaguiButton>
                    </XStack>
                  </YStack>
                )}
              </Card>
            ))}
          </YStack>

          {/* Load More Button */}
          {hasNextPage && (
            <YStack alignItems="center" marginTop="$4">
              <TamaguiButton
                onPress={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                backgroundColor="$orange10"
              >
                {isFetchingNextPage ? (
                  <XStack space="$2" alignItems="center">
                    <Spinner size="small" color="white" />
                    <Text style={{ color: 'white' }}>Loading more...</Text>
                  </XStack>
                ) : (
                  <Text style={{ color: 'white' }}>Load More</Text>
                )}
              </TamaguiButton>
            </YStack>
          )}
        </Card>
      </YStack>
    </ScrollView>
  );
}
