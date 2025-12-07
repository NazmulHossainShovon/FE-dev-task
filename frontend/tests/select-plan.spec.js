import { test, expect } from '@playwright/test';

test('select core plan and click get started now', async ({ page }) => {
  // Navigate to the home route
  await page.goto('/home');

  // Select the core plan by clicking on the Core plan card/tier
  // The Core plan card has a heading with the text "Core"
  await page.locator('h3:has-text("Core")').click();

  // Wait for the calculator section to update with the selected tier
  await expect(page.locator('text=Core Plan')).toBeVisible();

  // Click the "Get Started Now" button
  // The button appears as the outlined button with "Get Started Now" text
  await page.locator('button:has-text("Get Started Now")').click();

  // Verify navigation to the payment page
  await expect(page).toHaveURL(/payment/i);
});