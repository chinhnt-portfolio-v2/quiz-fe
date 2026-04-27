import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL ?? 'https://quiz-fe.vercel.app';
const API_BASE = process.env.VITE_API_BASE_URL ?? 'https://chinhnt-portfolio-platform.fly.dev/api/v1';

test.describe('Login page — unauthenticated', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
  });

  test('shows login form with email and password fields', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Quiz' })).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
  });

  test('shows Google login button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Continue with Google/i })).toBeVisible();
  });

  test('can switch to register mode', async ({ page }) => {
    await page.getByRole('button', { name: /Sign up/i }).click();
    await expect(page.getByRole('button', { name: 'Create account' })).toBeVisible();
    await expect(page.getByText('Create an account to get started')).toBeVisible();
  });

  test('shows error on invalid credentials', async ({ page }) => {
    await page.getByLabel('Email').fill('notexist@test.local');
    await page.getByLabel('Password').fill('WrongPass1!');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByRole('alert')).toContainText(/Invalid email or password/i, { timeout: 15_000 });
  });

  test('shows error for empty form submission', async ({ page }) => {
    // HTML5 validation prevents submit — email field should be invalid
    await page.getByRole('button', { name: 'Sign in' }).click();
    // The browser blocks the request; no network call is made
    const emailInput = page.getByLabel('Email');
    await expect(emailInput).toBeFocused();
  });

  test('registration — duplicate email shows error', async ({ page, request }) => {
    // Register once via API
    const email = `dup-${Date.now()}@test.local`;
    await request.post(`${API_BASE}/auth/register`, {
      data: { email, password: 'Test1234!' },
    });

    // Try to register again via UI
    await page.getByRole('button', { name: /Sign up/i }).click();
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password').fill('Test1234!');
    await page.getByRole('button', { name: 'Create account' }).click();
    await expect(page.getByRole('alert')).toContainText(/Email already in use/i, { timeout: 15_000 });
  });

  test('protected route redirects to login', async ({ page }) => {
    await page.goto(`${BASE_URL}/quiz/progress`);
    await expect(page).toHaveURL(/\/login/, { timeout: 10_000 });
  });

  test('register new account then auto-switches to login', async ({ page }) => {
    const unique = `reg-${Date.now()}@test.local`;
    await page.getByRole('button', { name: /Sign up/i }).click();
    await page.getByLabel('Email').fill(unique);
    await page.getByLabel('Password').fill('Test1234!');
    await page.getByRole('button', { name: 'Create account' }).click();
    await expect(page.getByRole('status')).toContainText(/Account created/i, { timeout: 15_000 });
    // Should have switched to login mode
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
  });
});

test.describe('Login — successful flow', () => {
  test('login with valid credentials navigates to /quiz', async ({ page, request }) => {
    const email = `login-${Date.now()}@test.local`;
    const password = 'Test1234!';

    // Create account first
    await request.post(`${API_BASE}/auth/register`, { data: { email, password } });

    await page.goto(`${BASE_URL}/login`);
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password').fill(password);
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page).toHaveURL(/\/quiz/, { timeout: 30_000 });
  });
});
