import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

// API functions
const fetchProducts = async (limit: number = 10, skip: number = 0): Promise<ProductsResponse> => {
  const response = await fetch(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

const fetchProductById = async (id: number): Promise<Product> => {
  const response = await fetch(`https://dummyjson.com/products/${id}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch product: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

const searchProducts = async (query: string, limit: number = 10): Promise<ProductsResponse> => {
  const response = await fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(query)}&limit=${limit}`);
  
  if (!response.ok) {
    throw new Error(`Failed to search products: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

const getProductsByCategory = async (category: string, limit: number = 10): Promise<ProductsResponse> => {
  const response = await fetch(`https://dummyjson.com/products/category/${encodeURIComponent(category)}?limit=${limit}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch products by category: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

// Query keys
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: { limit: number; skip: number }) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
  search: (query: string) => [...productKeys.all, 'search', query] as const,
  category: (category: string) => [...productKeys.all, 'category', category] as const,
  infinite: () => [...productKeys.all, 'infinite'] as const,
};

// Hooks
export const useProducts = (limit: number = 10, skip: number = 0) => {
  return useQuery({
    queryKey: productKeys.list({ limit, skip }),
    queryFn: () => fetchProducts(limit, skip),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => fetchProductById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 20, // 20 minutes
  });
};

export const useSearchProducts = (query: string, limit: number = 10) => {
  return useQuery({
    queryKey: productKeys.search(query),
    queryFn: () => searchProducts(query, limit),
    enabled: !!query.trim(),
    staleTime: 1000 * 60 * 2, // 2 minutes for search results
    gcTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useProductsByCategory = (category: string, limit: number = 10) => {
  return useQuery({
    queryKey: productKeys.category(category),
    queryFn: () => getProductsByCategory(category, limit),
    enabled: !!category,
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 20, // 20 minutes
  });
};

export const useInfiniteProducts = (limit: number = 10) => {
  return useInfiniteQuery({
    queryKey: productKeys.infinite(),
    queryFn: ({ pageParam = 0 }) => fetchProducts(limit, pageParam),
    getNextPageParam: (lastPage) => {
      const nextSkip = lastPage.skip + lastPage.limit;
      return nextSkip < lastPage.total ? nextSkip : undefined;
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Utility function to get all categories
export const useProductCategories = () => {
  return useQuery({
    queryKey: ['products', 'categories'],
    queryFn: async () => {
      const response = await fetch('https://dummyjson.com/products/categories');
      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
      }
      return response.json() as Promise<string[]>;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes (categories don't change often)
    gcTime: 1000 * 60 * 60, // 1 hour
  });
};
