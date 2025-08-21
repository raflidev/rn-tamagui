import React from 'react';
import { TamaguiProvider, Theme } from 'tamagui';
import tamaguiConfig from '../tamagui.config';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
      <Theme name="light">
        <Theme name="blue">
          {children}
        </Theme>
      </Theme>
    </TamaguiProvider>
  );
}
