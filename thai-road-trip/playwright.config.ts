import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';

// Environnements CI/containers : Chromium pré-installé hors du cache npm.
const systemChromium = '/opt/pw-browsers/chromium';

export default defineConfig({
  testDir: 'e2e',
  timeout: 30_000,
  retries: 1,
  use: {
    baseURL: 'http://127.0.0.1:4173',
    viewport: { width: 390, height: 844 }, // iPhone-like
    ...(existsSync(systemChromium) ? { launchOptions: { executablePath: systemChromium } } : {}),
  },
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4173',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
