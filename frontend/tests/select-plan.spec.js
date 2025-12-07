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

  // Check that the payment page contains the expected text
  await expect(page.locator('body')).toContainText('100 prompts • Up to 20 competitors');

  // Fill the payment form
  await page.locator('[data-testid="billing-email-input"]').fill('test@example.com');
  await page.locator('[data-testid="card-number-input"]').fill('4242 4242 4242 4242');
  await page.locator('[data-testid="expiry-input"]').fill('12/25');
  await page.locator('[data-testid="cvv-input"]').fill('123');
  await page.locator('[data-testid="card-name-input"]').fill('Test User');

  // Click the submit button
  await page.locator('[data-testid="submit-payment-button"]').click();

  // Verify navigation to the onboarding page
  await expect(page).toHaveURL(/onboarding/i);
});