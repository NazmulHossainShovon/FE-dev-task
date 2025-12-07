import { test, expect } from '@playwright/test';

test('select core plan and click get started now', async ({ page }) => {
  // Navigate to the home route
  await page.goto('/home');

  // Select the core plan by clicking on the Core plan card
  await page.locator('[data-testid="plan-name-core"]').click();

  // Wait for the calculator section to update with the selected tier
  await expect(page.locator('[data-testid="selected-plan-summary"]')).toContainText('Core Plan');

  // Click the "Get Started Now" button
  await page.locator('[data-testid="get-started-button"]').click();

  // Verify navigation to the payment page
  await expect(page).toHaveURL(/payment/i);
});