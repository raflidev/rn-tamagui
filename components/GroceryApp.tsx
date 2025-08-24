import React, { useState } from 'react';
import { View, Text, ScrollView, Image, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { 
  YStack, 
  XStack, 
  Card, 
  Input, 
  Button, 
  Spinner, 
  Sheet,
  Adapt,
  Select,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  Label,
  Separator,
  H1,
  H2,
  H3,
  Paragraph,
  Avatar,
  ListItem,
  Switch,
  RadioGroup,
  Checkbox,
  Progress
} from 'tamagui';

const { width } = Dimensions.get('window');

// Mock data for the grocery app
const categories = [
  { id: 1, icon: '🏷️', label: 'Deals', color: '#FFD700' },
  { id: 2, icon: '🔄', label: 'Reorder', color: '#32CD32' },
  { id: 3, icon: '🥑', label: 'Produce', color: '#FFD700' },
  { id: 4, icon: '🥛', label: 'Dairy', color: '#DEB887' },
  { id: 5, icon: '🍞', label: 'Bake', color: '#DEB887' },
  { id: 6, icon: '🥩', label: 'Meat', color: '#FF6B6B' },
  { id: 7, icon: '🥤', label: 'Beverages', color: '#4ECDC4' },
];

const hotDeals = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400',
    title: 'Unlimited Free Delivery →',
    subtitle: 'Get your favorite meals delivered without extra fees',
    backgroundColor: '#4CAF50',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=400',
    title: '15% Off For First',
    subtitle: 'Use FIRST code to your first order',
    backgroundColor: '#FF9800',
  },
];

const filters = [
  { id: 1, label: 'Featured', active: true },
  { id: 2, label: 'New & Popular', active: false },
  { id: 3, label: "Let's Grill", active: false },
  { id: 4, label: 'Snacks', active: false },
  { id: 5, label: 'Organic', active: false },
];

const products = [
  {
    id: 1,
    name: 'Whole Wheat Sandwich Bread',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200',
    price: 3.49,
    weight: '750g',
    rating: 5.0,
    reviews: 210,
    category: 'Bake',
    inStock: true,
  },
  {
    id: 2,
    name: 'Cinnamon & Apple Oatmeal',
    image: 'https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=200',
    price: 3.99,
    originalPrice: 4.49,
    weight: '450g',
    rating: 4.8,
    reviews: 3120,
    category: 'Breakfast',
    inStock: true,
  },
  {
    id: 3,
    name: 'Barbecue Corn Chip',
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=200',
    price: 3.49,
    weight: '180g',
    rating: 4.5,
    reviews: 890,
    category: 'Snacks',
    inStock: true,
  },
  {
    id: 4,
    name: 'Fresh Organic Bananas',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200',
    price: 2.99,
    weight: '1kg',
    rating: 4.9,
    reviews: 1560,
    category: 'Produce',
    inStock: true,
  },
  {
    id: 5,
    name: 'Greek Yogurt',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200',
    price: 4.99,
    weight: '500g',
    rating: 4.7,
    reviews: 890,
    category: 'Dairy',
    inStock: true,
  },
];

const paymentMethods = [
  { id: 'card', label: 'Credit/Debit Card', icon: '💳' },
  { id: 'paypal', label: 'PayPal', icon: '📱' },
  { id: 'apple', label: 'Apple Pay', icon: '🍎' },
  { id: 'google', label: 'Google Pay', icon: '🤖' },
];

export function GroceryApp() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCart, setShowCart] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [deliveryAddress, setDeliveryAddress] = useState('30220 Baltimore');
  const [deliveryTime, setDeliveryTime] = useState('30-45 min');
  const [orderProgress, setOrderProgress] = useState(0);
  const [isOrdering, setIsOrdering] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const addToCart = (product: any) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    setToastMessage(`${product.name} added to your cart`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item => 
        item.id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getDeliveryFee = () => {
    return getCartTotal() > 50 ? 0 : 4.99;
  };

  const getTotalWithTax = () => {
    const subtotal = getCartTotal();
    const delivery = getDeliveryFee();
    const tax = subtotal * 0.08; // 8% tax
    return subtotal + delivery + tax;
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart first');
      return;
    }
    setShowPayment(true);
  };

  const handlePayment = () => {
    setIsOrdering(true);
    setOrderProgress(0);
    
    // Simulate order progress
    const interval = setInterval(() => {
      setOrderProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsOrdering(false);
          setShowPayment(false);
          setCart([]);
          Alert.alert(
            'Order Successful! 🎉',
            'Your order has been placed and will be delivered soon!',
            [{ text: 'OK' }]
          );
          return 0;
        }
        return prev + 20;
      });
    }, 1000);
  };

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <View style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Status Bar Placeholder */}
        <View style={{ height: 44, backgroundColor: '#F8F9FA' }} />
        
        {/* Header Section */}
        <View style={{ padding: 16, backgroundColor: '#F8F9FA' }}>
          {/* Delivery Address & Points */}
          <XStack justifyContent="space-between" alignItems="center" marginBottom={16}>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#333' }}>
                Delivering to {deliveryAddress}
              </Text>
              <Text style={{ fontSize: 16, marginLeft: 4 }}>▼</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#4CAF50' }}>
              890 Points
            </Text>
          </XStack>

          {/* Search Bar */}
          <View style={{ 
            backgroundColor: 'white', 
            borderRadius: 12, 
            paddingHorizontal: 16, 
            paddingVertical: 12,
            flexDirection: 'row',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}>
            <Text style={{ fontSize: 18, marginRight: 12 }}>🔍</Text>
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              borderWidth={0}
              backgroundColor="transparent"
              flex={1}
              fontSize={16}
            />
          </View>
        </View>

        {/* Categories */}
        <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <XStack space={16}>
              <TouchableOpacity 
                style={{ alignItems: 'center' }}
                onPress={() => setSelectedCategory('all')}
              >
                <View style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: selectedCategory === 'all' ? '#4CAF50' : '#E0E0E0',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 8,
                }}>
                  <Text style={{ fontSize: 24 }}>🏪</Text>
                </View>
                <Text style={{ 
                  fontSize: 12, 
                  fontWeight: '500', 
                  color: selectedCategory === 'all' ? '#4CAF50' : '#333' 
                }}>
                  All
                </Text>
              </TouchableOpacity>
              {categories.map((category) => (
                <TouchableOpacity 
                  key={category.id} 
                  style={{ alignItems: 'center' }}
                  onPress={() => setSelectedCategory(category.label)}
                >
                  <View style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    backgroundColor: category.color,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 8,
                  }}>
                    <Text style={{ fontSize: 24 }}>{category.icon}</Text>
                  </View>
                  <Text style={{ 
                    fontSize: 12, 
                    fontWeight: '500', 
                    color: '#333' 
                  }}>
                    {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </XStack>
          </ScrollView>
        </View>

        {/* Hot This Week Section */}
        <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
          <H2 marginBottom={16}>Hot this week!</H2>
          <XStack space={12}>
            {hotDeals.map((deal) => (
              <Card
                key={deal.id}
                flex={1}
                padding={0}
                borderRadius={16}
                overflow="hidden"
                shadowColor="#000"
                shadowOffset={{ width: 0, height: 4 }}
                shadowOpacity={0.1}
                shadowRadius={8}
                elevation={5}
              >
                <Image
                  source={{ uri: deal.image }}
                  style={{
                    width: '100%',
                    height: 120,
                    backgroundColor: deal.backgroundColor,
                  }}
                  resizeMode="cover"
                />
                <View style={{ padding: 12 }}>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 4, color: '#333' }}>
                    {deal.title}
                  </Text>
                  <Text style={{ fontSize: 12, color: '#666', lineHeight: 16 }}>
                    {deal.subtitle}
                  </Text>
                </View>
              </Card>
            ))}
          </XStack>
        </View>

        {/* Best For You Section */}
        <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
          <H2 marginBottom={16}>Best for you</H2>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <XStack space={12}>
              {filters.map((filter) => (
                <TouchableOpacity
                  key={filter.id}
                  style={{
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 20,
                    backgroundColor: filter.active ? '#E8F5E8' : '#F0F0F0',
                    borderWidth: 1,
                    borderColor: filter.active ? '#4CAF50' : 'transparent',
                  }}
                >
                  <Text style={{
                    fontSize: 14,
                    fontWeight: '500',
                    color: filter.active ? '#4CAF50' : '#666',
                  }}>
                    {filter.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </XStack>
          </ScrollView>
        </View>

        {/* Products Grid */}
        <View style={{ paddingHorizontal: 16, marginBottom: 100 }}>
          <H2 marginBottom={16}>Featured Products</H2>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <XStack space={16}>
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  width={160}
                  padding={0}
                  borderRadius={16}
                  backgroundColor="white"
                  shadowColor="#000"
                  shadowOffset={{ width: 0, height: 2 }}
                  shadowOpacity={0.1}
                  shadowRadius={4}
                  elevation={3}
                >
                  <Image
                    source={{ uri: product.image }}
                    style={{
                      width: '100%',
                      height: 120,
                      borderTopLeftRadius: 16,
                      borderTopRightRadius: 16,
                    }}
                    resizeMode="cover"
                  />
                  
                  <View style={{ padding: 12 }}>
                    {/* Add to Cart Button */}
                    <TouchableOpacity
                      style={{
                        position: 'absolute',
                        top: -20,
                        right: 12,
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        backgroundColor: '#4CAF50',
                        justifyContent: 'center',
                        alignItems: 'center',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 4,
                        elevation: 4,
                      }}
                      onPress={() => addToCart(product)}
                    >
                      <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>+</Text>
                    </TouchableOpacity>

                    {/* Product Info */}
                    <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 4, color: '#333' }}>
                      {product.name}
                    </Text>
                    
                    {/* Price */}
                    <XStack alignItems="center" marginBottom={4}>
                      <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#4CAF50' }}>
                        ${product.price}
                      </Text>
                      {product.originalPrice && (
                        <Text style={{
                          fontSize: 14,
                          color: '#999',
                          textDecorationLine: 'line-through',
                          marginLeft: 8,
                        }}>
                          ${product.originalPrice}
                        </Text>
                      )}
                    </XStack>

                    {/* Weight */}
                    <Text style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
                      {product.weight}
                    </Text>

                    {/* Rating */}
                    <XStack alignItems="center">
                      <Text style={{ fontSize: 12, color: '#FFD700' }}>⭐</Text>
                      <Text style={{ fontSize: 12, color: '#666', marginLeft: 4 }}>
                        {product.rating} ({product.reviews})
                      </Text>
                    </XStack>

                    {/* Category Badge */}
                    <View style={{
                      backgroundColor: '#E5E7EB',
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 12,
                      alignSelf: 'flex-start',
                      marginTop: 8,
                    }}>
                      <Text style={{ 
                        fontSize: 10, 
                        color: '#6B7280',
                        fontWeight: '500',
                      }}>
                        {product.category}
                      </Text>
                    </View>
                  </View>
                </Card>
              ))}
            </XStack>
          </ScrollView>
        </View>
      </ScrollView>

      {/* Cart FAB */}
      {cart.length > 0 && (
        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: 80,
            right: 20,
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: '#4CAF50',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
          onPress={() => setShowCart(true)}
        >
          <Text style={{ color: 'white', fontSize: 24 }}>🛒</Text>
          <View style={{
            position: 'absolute',
            top: -5,
            right: -5,
            backgroundColor: '#EF4444',
            borderRadius: 10,
            minWidth: 20,
            height: 20,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 4,
          }}>
            <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
              {cart.reduce((total, item) => total + item.quantity, 0)}
            </Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Cart Sheet */}
      <Sheet
        modal
        open={showCart}
        onOpenChange={setShowCart}
        snapPoints={[50, 85]}
        position={0}
        zIndex={200000}
      >
        <Sheet.Frame padding="$4">
          <Sheet.Handle />
          <Sheet.ScrollView>
            <H2 marginBottom={16}>Your Cart</H2>
            
            {cart.length === 0 ? (
              <YStack alignItems="center" padding="$6">
                <Text style={{ fontSize: 18, color: '#666', marginBottom: 16 }}>
                  Your cart is empty
                </Text>
                <Button
                  backgroundColor="$blue10"
                  onPress={() => setShowCart(false)}
                >
                  Start Shopping
                </Button>
              </YStack>
            ) : (
              <YStack space="$3">
                {cart.map((item) => (
                  <Card key={item.id} padding="$3" backgroundColor="$gray1">
                    <XStack space="$3" alignItems="center">
                      <Image
                        source={{ uri: item.image }}
                        style={{ width: 50, height: 50, borderRadius: 8 }}
                        resizeMode="cover"
                      />
                      <YStack flex={1}>
                        <Text style={{ fontWeight: '600', fontSize: 14 }}>
                          {item.name}
                        </Text>
                        <Text style={{ color: '#666', fontSize: 12 }}>
                          {item.weight}
                        </Text>
                        <Text style={{ color: '#4CAF50', fontWeight: 'bold' }}>
                          ${item.price}
                        </Text>
                      </YStack>
                      <XStack alignItems="center" space="$2">
                        <TouchableOpacity
                          onPress={() => updateQuantity(item.id, item.quantity - 1)}
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 15,
                            backgroundColor: '#F0F0F0',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Text>-</Text>
                        </TouchableOpacity>
                        <Text style={{ fontSize: 16, fontWeight: '600' }}>
                          {item.quantity}
                        </Text>
                        <TouchableOpacity
                          onPress={() => updateQuantity(item.id, item.quantity + 1)}
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 15,
                            backgroundColor: '#4CAF50',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Text style={{ color: 'white' }}>+</Text>
                        </TouchableOpacity>
                      </XStack>
                    </XStack>
                  </Card>
                ))}

                <Separator marginVertical="$3" />

                {/* Cart Summary */}
                <YStack space="$2">
                  <XStack justifyContent="space-between">
                    <Text>Subtotal:</Text>
                    <Text>${getCartTotal().toFixed(2)}</Text>
                  </XStack>
                  <XStack justifyContent="space-between">
                    <Text>Delivery Fee:</Text>
                    <Text>{getDeliveryFee() === 0 ? 'Free' : `$${getDeliveryFee().toFixed(2)}`}</Text>
                  </XStack>
                  <XStack justifyContent="space-between">
                    <Text>Tax (8%):</Text>
                    <Text>${(getCartTotal() * 0.08).toFixed(2)}</Text>
                  </XStack>
                  <Separator marginVertical="$2" />
                  <XStack justifyContent="space-between">
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Total:</Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#4CAF50' }}>
                      ${getTotalWithTax().toFixed(2)}
                    </Text>
                  </XStack>
                </YStack>

                <Button
                  backgroundColor="$green10"
                  size="$4"
                  marginTop="$4"
                  onPress={handleCheckout}
                >
                  Proceed to Checkout
                </Button>
              </YStack>
            )}
          </Sheet.ScrollView>
        </Sheet.Frame>
        <Sheet.Overlay />
      </Sheet>

      {/* Payment Dialog */}
      <Dialog modal open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent>
          <DialogTitle>Payment & Delivery</DialogTitle>
          <DialogDescription>
            Complete your order with secure payment
          </DialogDescription>

          {isOrdering ? (
            <YStack space="$4" alignItems="center" padding="$4">
              <H3>Processing Your Order...</H3>
              <Progress value={orderProgress} width="100%" />
              <Text>{orderProgress}% Complete</Text>
            </YStack>
          ) : (
            <YStack space="$4">
              {/* Delivery Info */}
              <Card padding="$3" backgroundColor="$gray1">
                <H3 marginBottom={8}>Delivery Information</H3>
                <YStack space="$2">
                  <XStack justifyContent="space-between">
                    <Text>Address:</Text>
                    <Text>{deliveryAddress}</Text>
                  </XStack>
                  <XStack justifyContent="space-between">
                    <Text>Estimated Time:</Text>
                    <Text>{deliveryTime}</Text>
                  </XStack>
                </YStack>
              </Card>

              {/* Payment Method */}
              <YStack space="$2">
                <Label>Payment Method</Label>
                <RadioGroup
                  value={selectedPayment}
                  onValueChange={setSelectedPayment}
                >
                  {paymentMethods.map((method) => (
                    <XStack key={method.id} alignItems="center" space="$2" padding="$2">
                      <RadioGroup.Item value={method.id} id={method.id} />
                      <Label htmlFor={method.id}>
                        <XStack alignItems="center" space="$2">
                          <Text>{method.icon}</Text>
                          <Text>{method.label}</Text>
                        </XStack>
                      </Label>
                    </XStack>
                  ))}
                </RadioGroup>
              </YStack>

              {/* Order Summary */}
              <Card padding="$3" backgroundColor="$gray1">
                <H3 marginBottom={8}>Order Summary</H3>
                <YStack space="$2">
                  <XStack justifyContent="space-between">
                    <Text>Items ({cart.length}):</Text>
                    <Text>${getCartTotal().toFixed(2)}</Text>
                  </XStack>
                  <XStack justifyContent="space-between">
                    <Text>Delivery:</Text>
                    <Text>{getDeliveryFee() === 0 ? 'Free' : `$${getDeliveryFee().toFixed(2)}`}</Text>
                  </XStack>
                  <XStack justifyContent="space-between">
                    <Text>Tax:</Text>
                    <Text>${(getCartTotal() * 0.08).toFixed(2)}</Text>
                  </XStack>
                  <Separator marginVertical="$2" />
                  <XStack justifyContent="space-between">
                    <Text style={{ fontWeight: 'bold' }}>Total:</Text>
                    <Text style={{ fontWeight: 'bold', color: '#4CAF50' }}>
                      ${getTotalWithTax().toFixed(2)}
                    </Text>
                  </XStack>
                </YStack>
              </Card>

              {/* Action Buttons */}
              <XStack space="$2">
                <Button
                  flex={1}
                  backgroundColor="$gray10"
                  onPress={() => setShowPayment(false)}
                >
                  Cancel
                </Button>
                <Button
                  flex={1}
                  backgroundColor="$green10"
                  onPress={handlePayment}
                >
                  Pay Now
                </Button>
              </XStack>
            </YStack>
          )}

          <DialogClose asChild>
            <Button
              position="absolute"
              top="$3"
              right="$3"
              size="$2"
              circular
            >
              ✕
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>

      {/* Bottom Navigation */}
      <View style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        paddingVertical: 12,
        paddingHorizontal: 16,
      }}>
        <XStack justifyContent="space-around" alignItems="center">
          {[
            { icon: '🏠', label: 'Home', active: true },
            { icon: '🥕', label: 'Shop', active: false },
            { icon: '🛒', label: 'Cart', active: false },
            { icon: '👤', label: 'Account', active: false },
          ].map((item, index) => (
            <TouchableOpacity key={index} style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 20, marginBottom: 4 }}>{item.icon}</Text>
              <Text style={{
                fontSize: 12,
                fontWeight: item.active ? '600' : '400',
                color: item.active ? '#4CAF50' : '#666',
              }}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </XStack>
      </View>
    </View>
  );
}
