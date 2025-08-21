import React from 'react';
import { ThemeProvider } from './providers';
import { MainApp } from './components';

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}