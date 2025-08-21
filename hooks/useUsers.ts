import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface User {
  id: number;
  name: string;
  email: string;
  username: string;
}

// Mock API functions
const fetchUsers = async (): Promise<User[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return [
    { id: 1, name: 'John Doe', email: 'john@example.com', username: 'johndoe' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', username: 'janesmith' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', username: 'bobjohnson' },
  ];
};

const createUser = async (userData: Omit<User, 'id'>): Promise<User> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    id: Math.floor(Math.random() * 1000) + 4,
    ...userData,
  };
};

// Query keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: string) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
};

// Hooks
export const useUsers = () => {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: fetchUsers,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createUser,
    onSuccess: (newUser) => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      
      // Optionally update the cache directly
      queryClient.setQueryData(userKeys.lists(), (oldData: User[] | undefined) => {
        if (oldData) {
          return [...oldData, newUser];
        }
        return [newUser];
      });
    },
  });
};

export const useUser = (id: number) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: async () => {
      const users = await fetchUsers();
      const user = users.find(u => u.id === id);
      if (!user) throw new Error('User not found');
      return user;
    },
    enabled: !!id,
  });
};
