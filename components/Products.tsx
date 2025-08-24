import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, Image, Dimensions } from 'react-native';
import { useProducts, useSearchProducts, useProductsByCategory, useProductCategories } from '../hooks';
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

export function Products() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [limit, setLimit] = useState(10);

  // Fetch products with limit
  const { data: productsData, isLoading, error, refetch } = useProducts(limit, 0);
  
  // Search products
  const { data: searchData, isLoading: isSearching } = useSearchProducts(searchQuery, limit);
  
  // Products by category
  const { data: categoryData, isLoading: isCategoryLoading } = useProductsByCategory(selectedCategory, limit);
  
  // Categories
  const { data: categories, isLoading: isCategoriesLoading } = useProductCategories();

  // Determine which data to display
  const displayData = searchQuery ? searchData : selectedCategory ? categoryData : productsData;
  const isLoadingData = isLoading || isSearching || isCategoryLoading;

  // Debug logging
  React.useEffect(() => {
    if (displayData) {
      console.log('Display data:', displayData);
      if (displayData.products) {
        console.log('Products:', displayData.products);
      }
    }
  }, [displayData]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedCategory(''); // Clear category when searching
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery(''); // Clear search when selecting category
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
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
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <YStack space="$4">
        <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>
          Products from DummyJSON API
        </Text>

        {/* Search and Filters */}
        <Card padding="$4" backgroundColor="$gray1">
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
            Search & Filters
          </Text>
          
          <YStack space="$3">
            {/* Search Input */}
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChangeText={handleSearch}
              clearButtonMode="while-editing"
            />

            {/* Category Selector */}
            <Select
              value={selectedCategory}
              onValueChange={handleCategorySelect}
              disablePreventBodyScroll
            >
              <Select.Trigger
                backgroundColor="$gray2"
                borderColor="$gray6"
                placeholder="Select category..."
              >
                <Select.Value placeholder="Select category..." />
              </Select.Trigger>

              <Adapt when="sm" platform="touch">
                <Sheet
                  modal
                  dismissOnSnapToBottom
                  snapPoints={[50]}
                  position={0}
                  zIndex={200000}
                >
                  <Sheet.Frame>
                    <Sheet.ScrollView>
                      <Adapt.Contents />
                    </Sheet.ScrollView>
                  </Sheet.Frame>
                  <Sheet.Overlay />
                </Sheet>
              </Adapt>

              <Select.Content zIndex={200000}>
                <Select.ScrollUpButton />
                <Select.Viewport>
                  <Select.Group>
                    <Select.Label>Categories</Select.Label>
                    <Select.Item
                      key="all"
                      index={0}
                      value=""
                    >
                      <Select.ItemText>All Categories</Select.ItemText>
                    </Select.Item>
                    {categories?.map((category, index) => (
                      <Select.Item
                        key={category}
                        index={index + 1}
                        value={category}
                      >
                        <Select.ItemText>{safeText(category)}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Group>
                </Select.Viewport>
                <Select.ScrollDownButton />
              </Select.Content>
            </Select>

            {/* Limit Selector */}
            <XStack space="$2" alignItems="center">
              <Text>Limit:</Text>
              <Select
                value={limit.toString()}
                onValueChange={(value) => setLimit(parseInt(value))}
              >
                <Select.Trigger backgroundColor="$gray2" width={80}>
                  <Select.Value />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="5">5</Select.Item>
                  <Select.Item value="10">10</Select.Item>
                  <Select.Item value="20">20</Select.Item>
                  <Select.Item value="50">50</Select.Item>
                </Select.Content>
              </Select>
            </XStack>

            {/* Clear Filters Button */}
            {(searchQuery || selectedCategory) && (
              <TamaguiButton
                onPress={clearFilters}
                backgroundColor="$gray10"
                size="$2"
              >
                Clear Filters
              </TamaguiButton>
            )}
          </YStack>
        </Card>

        {/* Products Display */}
        <Card padding="$4" backgroundColor="$gray1">
          <XStack justifyContent="space-between" alignItems="center" marginBottom={16}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
              {searchQuery ? 'Search Results' : selectedCategory ? `${safeText(selectedCategory)} Products` : 'All Products'}
              {displayData && ` (${displayData.products?.length || 0}/${displayData.total || 0})`}
            </Text>
            <TamaguiButton onPress={() => refetch()} size="$3">
              Refresh
            </TamaguiButton>
          </XStack>

          {isLoadingData ? (
            <View style={{ alignItems: 'center', padding: 40 }}>
              <Spinner size="large" />
              <Text style={{ marginTop: 16 }}>Loading products...</Text>
            </View>
          ) : displayData?.products && displayData.products.length > 0 ? (
            <YStack space="$3">
              {displayData.products.map((product) => (
                <Card key={product.id} padding="$3" backgroundColor="$gray2">
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
              ))}
            </YStack>
          ) : (
            <View style={{ alignItems: 'center', padding: 40 }}>
              <Text style={{ fontSize: 16, color: '$gray11' }}>
                {searchQuery ? 'No products found for your search.' : 'No products available.'}
              </Text>
            </View>
          )}
        </Card>

        {/* API Info */}
        <Card padding="$4" backgroundColor="$blue1">
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>
            API Information
          </Text>
          <Text style={{ fontSize: 14, color: '$gray11' }}>
            Data fetched from: https://dummyjson.com/products
          </Text>
          <Text style={{ fontSize: 14, color: '$gray11' }}>
            Current limit: {limit} products
          </Text>
          {displayData && (
            <Text style={{ fontSize: 14, color: '$gray11' }}>
              Total available: {safeText(displayData.total)} products
            </Text>
          )}
        </Card>
      </YStack>
    </ScrollView>
  );
}
