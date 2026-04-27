import { defineConfig, devices } from '@playwright/test';

/**
 * Quiz-FE Playwright E2E config.
 *
 * Auth strategy:
 *   - global-setup.ts logs in once and saves storageState to e2e/.auth/state.json
 *   - "chromium-auth" project inherits that state → no per-test login
 *   - "chromium-noauth" project uses blank state → tests unauthenticated behaviour
 *
 * Usage:
 *   # Against Vercel (default)
 *   npx playwright test
 *
 *   # Local dev server on port 5173
 *   BASE_URL=http://localhost:5173 npx playwright test
 *
 *   # Supply credentials (required for auth tests)
 *   QUIZ_TEST_EMAIL=user@test.com QUIZ_TEST_PASSWORD=Test1234 npx playwright test
 */
export default defineConfig({
  testDir: './e2e/tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: 1,

  reporter: [
    ['list'],
    ['html', { outputFolder: 'e2e/reports', open: 'never' }],
  ],

  use: {
    baseURL: process.env.BASE_URL ?? 'https://quiz-fe.vercel.app',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 30_000,
  },

  projects: [
    // Setup project that performs login once
    {
      name: 'setup',
      testMatch: '**/global-setup.ts',
    },

    // Auth tests — inherits session from setup
    {
      name: 'chromium-auth',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'e2e/.auth/state.json',
      },
      dependencies: ['setup'],
      testIgnore: ['**/auth.noauth.spec.ts'],
    },

    // No-auth tests — blank browser context
    {
      name: 'chromium-noauth',
      use: { ...devices['Desktop Chrome'] },
      testMatch: ['**/auth.noauth.spec.ts'],
    },
  ],
});
