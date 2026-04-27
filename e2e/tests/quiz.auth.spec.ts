import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL ?? 'https://quiz-fe.vercel.app';

/**
 * Full quiz use-case tests that run with an authenticated session
 * (session injected by global-setup.ts via storageState).
 */
test.describe('Quiz — authenticated use-cases', () => {
  test('topic selection page loads with topics', async ({ page }) => {
    await page.goto(`${BASE_URL}/quiz`);
    // Wait for topics grid to appear (API may take a moment)
    const topic = page.locator('button.rounded-xl.border-2').first();
    await expect(topic).toBeVisible({ timeout: 30_000 });
  });

  test('can select a topic and start quiz', async ({ page }) => {
    await page.goto(`${BASE_URL}/quiz`);

    // Wait for topics to load
    const firstTopic = page.locator('button.rounded-xl.border-2').first();
    await expect(firstTopic).toBeVisible({ timeout: 30_000 });

    // Select first topic
    await firstTopic.click();

    // Start quiz button should become enabled
    const startBtn = page.getByRole('button', { name: /Start Quiz/i });
    await expect(startBtn).toBeEnabled({ timeout: 5_000 });
    await startBtn.click();

    // Should navigate to /quiz/practice
    await expect(page).toHaveURL(/\/quiz\/practice/, { timeout: 15_000 });
  });

  test('quiz practice page shows question and options', async ({ page }) => {
    await page.goto(`${BASE_URL}/quiz`);

    // Select all topics and start
    const selectAllBtn = page.getByRole('button', { name: /Select all/i });
    await expect(selectAllBtn).toBeVisible({ timeout: 30_000 });
    await selectAllBtn.click();

    await page.getByRole('button', { name: /Start Quiz/i }).click();
    await expect(page).toHaveURL(/\/quiz\/practice/, { timeout: 15_000 });

    // Question text should appear
    const questionCard = page.locator('.rounded-2xl.border.shadow-sm').first();
    await expect(questionCard).toBeVisible({ timeout: 30_000 });

    // At least one option button
    const options = page.locator('button.rounded-xl.border-2');
    await expect(options.first()).toBeVisible({ timeout: 10_000 });
    expect(await options.count()).toBeGreaterThan(1);
  });

  test('can answer a question and see feedback', async ({ page }) => {
    await page.goto(`${BASE_URL}/quiz`);

    const selectAllBtn = page.getByRole('button', { name: /Select all/i });
    await expect(selectAllBtn).toBeVisible({ timeout: 30_000 });
    await selectAllBtn.click();
    await page.getByRole('button', { name: /Start Quiz/i }).click();
    await expect(page).toHaveURL(/\/quiz\/practice/, { timeout: 15_000 });

    // Wait for first option to appear
    const firstOption = page.locator('button.rounded-xl.border-2').first();
    await expect(firstOption).toBeVisible({ timeout: 30_000 });

    // Click the first option
    await firstOption.click();

    // Feedback panel should appear (correct or wrong)
    const feedback = page.locator('.rounded-xl.p-4.text-sm');
    await expect(feedback).toBeVisible({ timeout: 10_000 });

    // Next button should appear
    const nextBtn = page.getByRole('button', { name: /next/i });
    await expect(nextBtn).toBeVisible({ timeout: 5_000 });
  });

  test('can proceed to next question after answering', async ({ page }) => {
    await page.goto(`${BASE_URL}/quiz`);

    const selectAllBtn = page.getByRole('button', { name: /Select all/i });
    await expect(selectAllBtn).toBeVisible({ timeout: 30_000 });
    await selectAllBtn.click();
    await page.getByRole('button', { name: /Start Quiz/i }).click();
    await expect(page).toHaveURL(/\/quiz\/practice/, { timeout: 15_000 });

    // Answer question 1
    const firstOption = page.locator('button.rounded-xl.border-2').first();
    await expect(firstOption).toBeVisible({ timeout: 30_000 });
    await firstOption.click();

    // Click Next
    const nextBtn = page.getByRole('button', { name: /next/i });
    await expect(nextBtn).toBeVisible({ timeout: 5_000 });
    await nextBtn.click();

    // Wait for next question to load (prev option should disappear and new one appear)
    await page.waitForTimeout(1_000);
    const nextOption = page.locator('button.rounded-xl.border-2').first();
    await expect(nextOption).toBeVisible({ timeout: 30_000 });
  });

  test('navigation — go to progress dashboard', async ({ page }) => {
    await page.goto(`${BASE_URL}/quiz/progress`);
    // Should not redirect to login (we're authenticated)
    await expect(page).not.toHaveURL(/\/login/, { timeout: 5_000 });
    await expect(page).toHaveURL(/\/quiz\/progress/);
  });

  test('navigation — go to history page', async ({ page }) => {
    await page.goto(`${BASE_URL}/quiz/history`);
    await expect(page).not.toHaveURL(/\/login/, { timeout: 5_000 });
    await expect(page).toHaveURL(/\/quiz\/history/);
  });

  test('navigation — go to missed questions page', async ({ page }) => {
    await page.goto(`${BASE_URL}/quiz/missed`);
    await expect(page).not.toHaveURL(/\/login/, { timeout: 5_000 });
    await expect(page).toHaveURL(/\/quiz\/missed/);
  });

  test('logout button in quiz practice ends session and redirects', async ({ page }) => {
    await page.goto(`${BASE_URL}/quiz`);

    const selectAllBtn = page.getByRole('button', { name: /Select all/i });
    await expect(selectAllBtn).toBeVisible({ timeout: 30_000 });
    await selectAllBtn.click();
    await page.getByRole('button', { name: /Start Quiz/i }).click();
    await expect(page).toHaveURL(/\/quiz\/practice/, { timeout: 15_000 });

    // Wait for quiz to load
    const firstOption = page.locator('button.rounded-xl.border-2').first();
    await expect(firstOption).toBeVisible({ timeout: 30_000 });

    // Click logout button (svg icon button with sr-only text)
    const logoutBtn = page.locator('button[title]').filter({ hasText: /logout/i });
    if (await logoutBtn.count() === 0) {
      // Try finding by title attribute
      const logoutByTitle = page.locator('button[title*="ogout"], button[title*="ogout"]').last();
      if (await logoutByTitle.count() > 0) {
        await logoutByTitle.click();
      }
    } else {
      await logoutBtn.click();
    }

    await expect(page).toHaveURL(/\/login/, { timeout: 15_000 });
  });
});
