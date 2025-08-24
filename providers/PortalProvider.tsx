import React from 'react';
import { PortalProvider as TamaguiPortalProvider } from '@tamagui/portal';

interface PortalProviderProps {
  children: React.ReactNode;
}

export function PortalProvider({ children }: PortalProviderProps) {
  return (
    <TamaguiPortalProvider>
      {children}
    </TamaguiPortalProvider>
  );
}
