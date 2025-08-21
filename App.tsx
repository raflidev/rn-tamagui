import React from 'react';
import { ThemeProvider, QueryProvider } from './providers';
import { MainApp } from './components';

export default function App() {
  return (
    <QueryProvider>
      <ThemeProvider>
        <MainApp />
      </ThemeProvider>
    </QueryProvider>
  );
}