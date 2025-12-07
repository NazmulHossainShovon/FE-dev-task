import { test, expect } from '@playwright/test';

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/');

  // Check that the page title contains expected text
  await expect(page).toHaveTitle(/Vite \+ React/);
});

test('app renders without errors', async ({ page }) => {
  await page.goto('/');

  // Check if page loads without errors
  await expect(page.locator('body')).toBeVisible();
  
  // Wait for the page to be fully loaded
  await page.waitForLoadState('networkidle');
  
  // Check if the root element is present
  await expect(page.locator('#root')).toBeVisible();
});

test('console logs backend URL', async ({ page }) => {
  const logs = [];
  page.on('console', msg => {
    if (msg.type() === 'log') {
      logs.push(msg.text());
    }
  });

  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Check if backend URL is logged
  expect(logs.some(log => log.includes('Backend URL:'))).toBeTruthy();
});