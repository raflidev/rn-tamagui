# API Integration with DummyJSON.com

This project now includes real API integration with [DummyJSON](https://dummyjson.com/) using TanStack Query for efficient data fetching and caching.

## 🚀 **API Endpoints Implemented**

### **Base URL**: `https://dummyjson.com/products`

### **1. Get Products with Limit**
```
GET /products?limit=10&skip=0
```
- **Purpose**: Fetch a paginated list of products
- **Parameters**:
  - `limit`: Number of products to return (default: 10)
  - `skip`: Number of products to skip (default: 0)
- **Response**: Products with pagination metadata

### **2. Get Product by ID**
```
GET /products/{id}
```
- **Purpose**: Fetch a single product by its ID
- **Parameters**: `id` (path parameter)
- **Response**: Single product details

### **3. Search Products**
```
GET /products/search?q={query}&limit={limit}
```
- **Purpose**: Search products by title or description
- **Parameters**:
  - `q`: Search query string
  - `limit`: Maximum results to return
- **Response**: Filtered products matching the search

### **4. Get Products by Category**
```
GET /products/category/{category}?limit={limit}
```
- **Purpose**: Fetch products from a specific category
- **Parameters**:
  - `category`: Category name (path parameter)
  - `limit`: Maximum results to return
- **Response**: Products in the specified category

### **5. Get All Categories**
```
GET /products/categories
```
- **Purpose**: Fetch all available product categories
- **Response**: Array of category names

## 📱 **Components Created**

### **1. Products Component**
- **Features**:
  - Fetch products with configurable limit
  - Search functionality
  - Category filtering
  - Product display with images and details
  - Error handling and loading states

### **2. ProductsInfinite Component**
- **Features**:
  - Infinite scroll pagination
  - Real-time search
  - Configurable page size
  - Smooth loading experience
  - FlatList optimization

## 🔧 **TanStack Query Hooks**

### **Core Hooks**
```typescript
// Basic products fetching
const { data, isLoading, error } = useProducts(limit, skip);

// Individual product
const { data: product } = useProduct(id);

// Search products
const { data: searchResults } = useSearchProducts(query, limit);

// Products by category
const { data: categoryProducts } = useProductsByCategory(category, limit);

// Infinite scroll
const { data, fetchNextPage, hasNextPage } = useInfiniteProducts(limit);

// Categories list
const { data: categories } = useProductCategories();
```

### **Query Keys Structure**
```typescript
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
```

## 📊 **Data Structure**

### **Product Interface**
```typescript
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
```

### **API Response Structure**
```typescript
interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}
```

## 🎯 **Key Features**

### **1. Automatic Caching**
- Products cached for 5 minutes (stale time)
- Cache garbage collection after 10 minutes
- Individual products cached longer (10 minutes stale, 20 minutes GC)

### **2. Smart Query Management**
- Queries only enabled when parameters are valid
- Automatic background refetching
- Optimized for mobile performance

### **3. Error Handling**
- Network error detection
- User-friendly error messages
- Retry functionality
- Graceful fallbacks

### **4. Search & Filtering**
- Real-time search with debouncing
- Category-based filtering
- Configurable result limits
- Clear filter options

### **5. Pagination**
- Configurable page sizes (5, 10, 20, 50)
- Skip-based pagination
- Infinite scroll support
- Load more functionality

## 🚀 **Usage Examples**

### **Basic Product Fetching**
```typescript
import { useProducts } from '../hooks';

function ProductList() {
  const { data, isLoading, error } = useProducts(10, 0);
  
  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <View>
      {data?.products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </View>
  );
}
```

### **Search Implementation**
```typescript
import { useSearchProducts } from '../hooks';

function SearchProducts() {
  const [query, setQuery] = useState('');
  const { data, isLoading } = useSearchProducts(query, 10);
  
  return (
    <View>
      <Input
        value={query}
        onChangeText={setQuery}
        placeholder="Search products..."
      />
      {isLoading ? (
        <Spinner />
      ) : (
        <ProductList products={data?.products || []} />
      )}
    </View>
  );
}
```

### **Infinite Scroll**
```typescript
import { useInfiniteProducts } from '../hooks';

function InfiniteProductList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteProducts(10);
  
  const allProducts = data?.pages.flatMap(page => page.products) || [];
  
  return (
    <FlatList
      data={allProducts}
      onEndReached={() => hasNextPage && fetchNextPage()}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetchingNextPage ? <Spinner /> : null
      }
    />
  );
}
```

## 🔒 **Security & Best Practices**

### **1. Input Validation**
- URL encoding for search queries
- Parameter sanitization
- Type-safe API calls

### **2. Error Boundaries**
- Network error handling
- Graceful degradation
- User feedback

### **3. Performance Optimization**
- Efficient caching strategies
- Background updates
- Minimal re-renders

## 📱 **Mobile Optimizations**

### **1. Network Handling**
- Optimized retry logic
- Background sync considerations
- Offline state management

### **2. UI/UX**
- Loading skeletons
- Smooth animations
- Touch-friendly interactions

### **3. Memory Management**
- Efficient image loading
- List virtualization
- Cache size limits

## 🧪 **Testing Considerations**

### **1. API Mocking**
- Mock responses for testing
- Network error simulation
- Loading state testing

### **2. Component Testing**
- Hook testing with React Testing Library
- Query client mocking
- Error boundary testing

## 🚀 **Next Steps**

### **1. Enhanced Features**
- Product image gallery
- Advanced filtering (price, rating, brand)
- Sorting options
- Wishlist functionality

### **2. Performance Improvements**
- Image lazy loading
- Virtual scrolling for large lists
- Background prefetching
- Offline support

### **3. Real API Integration**
- Replace DummyJSON with production API
- Authentication integration
- Real-time updates
- WebSocket support

---

This implementation provides a solid foundation for building production-ready e-commerce applications with TanStack Query and React Native.
