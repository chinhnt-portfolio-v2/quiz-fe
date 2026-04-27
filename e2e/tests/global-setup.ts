import { test as setup, expect } from '@playwright/test';

const AUTH_FILE = 'e2e/.auth/state.json';

const BASE_URL = process.env.BASE_URL ?? 'https://quiz-fe.vercel.app';
const API_BASE = process.env.VITE_API_BASE_URL ?? 'https://chinhnt-portfolio-platform.fly.dev/api/v1';
const EMAIL = process.env.QUIZ_TEST_EMAIL ?? 'quiz-e2e@test.local';
const PASSWORD = process.env.QUIZ_TEST_PASSWORD ?? 'Test1234!';

setup('authenticate', async ({ page, request }) => {
  // Try to register first (idempotent — 409 means already exists, which is fine)
  const reg = await request.post(`${API_BASE}/auth/register`, {
    data: { email: EMAIL, password: PASSWORD },
  });
  if (reg.status() !== 201 && reg.status() !== 409) {
    throw new Error(`Register failed: ${reg.status()} ${await reg.text()}`);
  }

  // Login via the UI form
  await page.goto(`${BASE_URL}/login`);
  await page.getByLabel('Email').fill(EMAIL);
  await page.getByLabel('Password').fill(PASSWORD);
  await page.getByRole('button', { name: 'Sign in' }).click();

  // Wait for redirect to /quiz after successful login
  await expect(page).toHaveURL(/\/quiz/, { timeout: 30_000 });

  // Persist auth state
  await page.context().storageState({ path: AUTH_FILE });
});
