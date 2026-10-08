import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  timeout: 60_000,
  fullyParallel: true,
  workers: 4,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:8181',
    browserName: 'chromium',
  },
  webServer: {
    command: 'node tools/serve.mjs 8181',
    url: 'http://localhost:8181/',
    reuseExistingServer: true,
  },
});
