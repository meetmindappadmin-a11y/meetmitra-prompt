import { defineConfig } from 'vitest/config';
import path from 'node:path';

// Root test runner. Covers pure logic in both the client and the server.
// The @shared alias mirrors the one in the client's Vite config so type-only
// imports resolve identically in tests.
export default defineConfig({
  resolve: {
    alias: { '@shared': path.resolve(__dirname, 'shared') },
  },
  test: {
    include: ['client/src/**/*.test.ts', 'server/src/**/*.test.ts'],
    environment: 'node',
  },
});
