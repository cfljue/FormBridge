/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import { crx } from '@crxjs/vite-plugin';
import manifest from './src/manifest.json' with { type: 'json' };
import { resolve } from 'path';

export default defineConfig(({ mode }) => ({
  plugins: [crx({ manifest })],

  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/lit')) return 'lit';
        },
      },
    },
  },

  resolve: {
    alias: {
      '@shared': resolve(__dirname, 'src/components/shared'),
      '@popup': resolve(__dirname, 'src/components/popup'),
      '@config': resolve(__dirname, 'src/components/config'),
      '@services': resolve(__dirname, 'src/services'),
      '@store': resolve(__dirname, 'src/store'),
      '@app-types': resolve(__dirname, 'src/types'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@i18n': resolve(__dirname, 'src/i18n'),
    },
  },

  test: {
    environment: 'happy-dom',
    include: ['src/**/*.test.ts'],
  },
}));
