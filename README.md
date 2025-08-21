# React Native Tamagui App

Aplikasi React Native yang menggunakan Tamagui untuk UI components dengan struktur yang rapi dan terorganisir.

## Struktur Proyek

```
rn-tamagui/
├── components/          # Komponen UI yang dapat digunakan kembali
│   ├── MainApp.tsx     # Komponen utama aplikasi
│   └── index.ts        # Export semua komponen
├── providers/           # Provider untuk state management
│   ├── ThemeProvider.tsx # Provider untuk tema aplikasi
│   └── index.ts        # Export semua provider
├── App.tsx             # Entry point aplikasi
├── tamagui.config.ts   # Konfigurasi Tamagui
└── package.json        # Dependencies
```

## Fitur

- ✅ Struktur kode yang rapi dan terorganisir
- ✅ Provider pattern untuk state management
- ✅ Komponen yang dapat digunakan kembali
- ✅ Tema yang konsisten dengan Tamagui
- ✅ TypeScript support

## Cara Penggunaan

1. **ThemeProvider**: Mengelola tema aplikasi (light/dark, color schemes)
2. **MainApp**: Komponen utama yang berisi UI aplikasi
3. **App.tsx**: Entry point yang menggunakan provider dan komponen

## Menambahkan Provider Baru

Untuk menambahkan provider baru (misalnya untuk state management):

1. Buat file baru di folder `providers/`
2. Export provider dari `providers/index.ts`
3. Gunakan di `App.tsx`

## Menambahkan Komponen Baru

Untuk menambahkan komponen baru:

1. Buat file baru di folder `components/`
2. Export komponen dari `components/index.ts`
3. Import dan gunakan di komponen lain

## Development

```bash
# Install dependencies
npm install

# Run development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```
