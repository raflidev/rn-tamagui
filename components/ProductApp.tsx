import React from 'react'
import { Button, Input, Text, XStack, YStack, XGroup } from 'tamagui'
import { Search } from '@tamagui/lucide-icons'
const ProductApp = () => {
  return (
    <YStack
    overflow="hidden"
    gap="$2"
    margin="$3"
    padding="$2"
    marginTop={30}
  >
    <XStack alignItems="center" space="$2">
      <Text flex={1} color='$gray10'>Dikirim ke <Text color="$blue10">Tambun Selatan, Bekasi</Text></Text>
      <Text color="$blue10">99 Point</Text>
    </XStack>
    <XStack alignItems="center" space="$2">
      <XStack flex={1} alignItems="center" justifyContent="center" backgroundColor="$blue4" borderRadius="$2"  paddingHorizontal="$2">
        <Search size={17} color="$blue10" />
        <Input 
          flex={1} 
          size="$3" 
          placeholder="Cari produk..."
          borderWidth={0}
          backgroundColor="transparent"
        />
      </XStack>
    </XStack>
  </YStack>
  
  )
}

export default ProductApp