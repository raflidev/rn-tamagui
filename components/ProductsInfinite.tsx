import React, { useState } from 'react';
import { View, Text, ScrollView, Image, Dimensions, FlatList } from 'react-native';
import { useInfiniteProducts, useSearchProducts, useProductCategories } from '../hooks';
import { YStack, XStack, Card, Input, Button as TamaguiButton, Spinner, Select, Adapt, Sheet } from 'tamagui';

const { width } = Dimensions.get('window');

// Helper function to safely render text
const safeText = (value: any): string => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  if (typeof value === 'boolean') return value.toString();
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') {
    console.warn('Attempting to render object as text:', value);
    return JSON.stringify(value);
  }
  return String(value);
};

export function ProductsInfinite() {
  const [searchQuery, setSearchQuery] = useState('');
  const [limit, setLimit] = useState(10);

  // Infinite products query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch,
  } = useInfiniteProducts(limit);

  // Search products
  const { data: searchData, isLoading: isSearching } = useSearchProducts(searchQuery, limit);
  
  // Categories
  const { data: categories } = useProductCategories();

  // Determine which data to display
  const displayData = searchQuery ? searchData : data;
  const isLoadingData = isLoading || isSearching;

  // Flatten all pages for infinite scroll
  const allProducts = data?.pages.flatMap(page => page.products) || [];
  const searchProducts = searchData?.products || [];

  // Debug logging
  React.useEffect(() => {
    if (displayData) {
      console.log('Display data:', displayData);
      if ('products' in displayData && displayData.products) {
        console.log('Products:', displayData.products);
      }
    }
  }, [displayData]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage && !searchQuery) {
      fetchNextPage();
    }
  };

  const renderProduct = ({ item: product }: { item: any }) => (
    <Card key={product.id} padding="$3" backgroundColor="$gray2" marginBottom="$2">
      <XStack space="$3">
        {/* Product Image */}
        <Image
          source={{ uri: product.thumbnail }}
          style={{
            width: 80,
            height: 80,
            borderRadius: 8,
            backgroundColor: '$gray3',
          }}
          resizeMode="cover"
        />
        
        {/* Product Details */}
        <YStack flex={1} space="$2">
          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
            {safeText(product.title)}
          </Text>
          <Text style={{ color: '$gray11', fontSize: 14 }} numberOfLines={2}>
            {safeText(product.description)}
          </Text>
          
          <XStack space="$3" alignItems="center">
            <Text style={{ fontWeight: 'bold', color: '$green10' }}>
              ${safeText(product.price)}
            </Text>
            {product.discountPercentage > 0 && (
              <Text style={{ color: '$red10', fontSize: 12 }}>
                -{safeText(product.discountPercentage)}%
              </Text>
            )}
          </XStack>
          
          <XStack space="$3" alignItems="center">
            <Text style={{ color: '$gray10', fontSize: 12 }}>
              ⭐ {safeText(product.rating)}
            </Text>
            <Text style={{ color: '$gray10', fontSize: 12 }}>
              Stock: {safeText(product.stock)}
            </Text>
            <Text style={{ color: '$gray10', fontSize: 12 }}>
              {safeText(product.brand)}
            </Text>
          </XStack>
          
          <Text style={{ color: '$blue10', fontSize: 12, textTransform: 'capitalize' }}>
            {safeText(product.category)}
          </Text>
        </YStack>
      </XStack>
    </Card>
  );

  const renderFooter = () => {
    if (!hasNextPage || searchQuery) return null;
    
    return (
      <YStack alignItems="center" padding="$4">
        {isFetchingNextPage ? (
          <XStack space="$2" alignItems="center">
            <Spinner size="small" />
            <Text>Loading more products...</Text>
          </XStack>
        ) : (
          <TamaguiButton
            onPress={handleLoadMore}
            backgroundColor="$orange10"
            size="$2"
          >
            Load More Products
          </TamaguiButton>
        )}
      </YStack>
    );
  };

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
        <Text style={{ fontSize: 18, textAlign: 'center', marginBottom: 16 }}>
          Error: {error.message}
        </Text>
        <TamaguiButton onPress={() => refetch()} backgroundColor="$red10">
          Retry
        </TamaguiButton>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <Card padding="$3" backgroundColor="$blue1" marginBottom="$2">
        <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 }}>
          Products with Infinite Scroll
        </Text>
        
        <YStack space="$3">
          {/* Search Input */}
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={handleSearch}
            clearButtonMode="while-editing"
          />

          {/* Limit Selector */}
          <XStack space="$2" alignItems="center" justifyContent="center">
            <Text>Products per page:</Text>
            <Select
              value={limit.toString()}
              onValueChange={(value) => setLimit(parseInt(value))}
            >
              <Select.Trigger backgroundColor="$gray2" width={80}>
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="5" index={0}>5</Select.Item>
                <Select.Item value="10" index={1}>10</Select.Item>
                <Select.Item value="20" index={2}>20</Select.Item>
                <Select.Item value="50" index={3}>50</Select.Item>
              </Select.Content>
            </Select>
          </XStack>
        </YStack>
      </Card>

      {/* Products List */}
      {isLoadingData ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Spinner size="large" />
          <Text style={{ marginTop: 16 }}>Loading products...</Text>
        </View>
      ) : (
        <FlatList
          data={searchQuery ? searchProducts : allProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 16 }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', padding: 40 }}>
              <Text style={{ fontSize: 16, color: '$gray11' }}>
                {searchQuery ? 'No products found for your search.' : 'No products available.'}
              </Text>
            </View>
          }
          ListHeaderComponent={
            <Card padding="$3" backgroundColor="$gray1" marginBottom="$3">
              <XStack justifyContent="space-between" alignItems="center">
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                  {searchQuery ? 'Search Results' : 'All Products'}
                  {displayData && 'products' in displayData && ` (${displayData.products?.length || 0} shown)`}
                </Text>
                <TamaguiButton onPress={() => refetch()} size="$2">
                  Refresh
                </TamaguiButton>
              </XStack>
              
              {!searchQuery && data && (
                <Text style={{ fontSize: 12, color: '$gray11', marginTop: 8 }}>
                  Total available: {safeText(data.pages[0]?.total || 0)} products
                </Text>
              )}
            </Card>
          }
        />
      )}

      {/* API Info */}
      <Card padding="$3" backgroundColor="$blue1" margin="$2">
        <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 4 }}>
          API: https://dummyjson.com/products
        </Text>
        <Text style={{ fontSize: 12, color: '$gray11' }}>
          Current limit: {limit} • {searchQuery ? 'Search mode' : 'Infinite scroll mode'}
        </Text>
      </Card>
    </View>
  );
}
