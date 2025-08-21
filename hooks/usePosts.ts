import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface PostsResponse {
  posts: Post[];
  total: number;
  hasMore: boolean;
}

// Mock API functions
const fetchPosts = async (page: number, limit: number = 10): Promise<PostsResponse> => {
  // Simulate API call with pagination
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const allPosts: Post[] = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    title: `Post ${i + 1}`,
    body: `This is the body of post ${i + 1}. It contains some sample content to demonstrate the functionality.`,
    userId: Math.floor(Math.random() * 10) + 1,
  }));

  const start = (page - 1) * limit;
  const end = start + limit;
  const posts = allPosts.slice(start, end);
  
  return {
    posts,
    total: allPosts.length,
    hasMore: end < allPosts.length,
  };
};

const createPost = async (postData: Omit<Post, 'id'>): Promise<Post> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return {
    id: Math.floor(Math.random() * 10000) + 100,
    ...postData,
  };
};

const updatePost = async (id: number, updates: Partial<Post>): Promise<Post> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    id,
    title: updates.title || 'Updated Post',
    body: updates.body || 'Updated body',
    userId: updates.userId || 1,
  };
};

const deletePost = async (id: number): Promise<void> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 400));
};

// Query keys
export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (filters: string) => [...postKeys.lists(), { filters }] as const,
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (id: number) => [...postKeys.details(), id] as const,
  infinite: () => [...postKeys.all, 'infinite'] as const,
};

// Hooks
export const useInfinitePosts = () => {
  return useInfiniteQuery({
    queryKey: postKeys.infinite(),
    queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createPost,
    onMutate: async (newPost) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: postKeys.infinite() });
      
      // Snapshot the previous value
      const previousPosts = queryClient.getQueryData(postKeys.infinite());
      
      // Optimistically update to the new value
      queryClient.setQueryData(postKeys.infinite(), (old: any) => {
        if (!old) return old;
        
        const newPages = [...old.pages];
        if (newPages.length > 0) {
          newPages[0] = {
            ...newPages[0],
            posts: [newPost, ...newPages[0].posts],
            total: newPages[0].total + 1,
          };
        }
        
        return {
          ...old,
          pages: newPages,
        };
      });
      
      // Return a context object with the snapshotted value
      return { previousPosts };
    },
    onError: (err, newPost, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousPosts) {
        queryClient.setQueryData(postKeys.infinite(), context.previousPosts);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: postKeys.infinite() });
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<Post> }) =>
      updatePost(id, updates),
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: postKeys.infinite() });
      
      const previousPosts = queryClient.getQueryData(postKeys.infinite());
      
      // Optimistically update
      queryClient.setQueryData(postKeys.infinite(), (old: any) => {
        if (!old) return old;
        
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            posts: page.posts.map((post: Post) =>
              post.id === id ? { ...post, ...updates } : post
            ),
          })),
        };
      });
      
      return { previousPosts };
    },
    onError: (err, variables, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(postKeys.infinite(), context.previousPosts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.infinite() });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deletePost,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: postKeys.infinite() });
      
      const previousPosts = queryClient.getQueryData(postKeys.infinite());
      
      // Optimistically remove the post
      queryClient.setQueryData(postKeys.infinite(), (old: any) => {
        if (!old) return old;
        
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            posts: page.posts.filter((post: Post) => post.id !== id),
            total: page.total - 1,
          })),
        };
      });
      
      return { previousPosts };
    },
    onError: (err, id, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(postKeys.infinite(), context.previousPosts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.infinite() });
    },
  });
};
