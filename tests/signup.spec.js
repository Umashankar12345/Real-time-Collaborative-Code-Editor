const { test, expect } = require('@playwright/test');

test.describe('Signup functionality', () => {
  test('Successful signup', async ({ page }) => {
    await page.goto('/login');
    
    // Switch to create account mode
    await page.getByRole('button', { name: 'Create one' }).click();
    
    await expect(page.getByRole('heading', { name: 'Create Account' })).toBeVisible();

    // Fill in the details
    const uniqueId = Date.now();
    await page.getByPlaceholder('John Doe').fill(`Test User ${uniqueId}`);
    await page.getByPlaceholder('john@example.com').fill(`testuser${uniqueId}@example.com`);
    await page.getByPlaceholder('developer').fill(`testuser${uniqueId}`);
    
    // There are multiple password fields now (Password and Confirm Password).
    // They both have the same placeholder, so we can use nth(0) and nth(1) or getByLabel.
    // The labels are 'Password' and 'Confirm Password'.
    await page.getByText('Password', { exact: true }).locator('..').locator('input').fill('password123');
    await page.getByText('Confirm Password').locator('..').locator('input').fill('password123');
    
    await page.getByRole('button', { name: 'Creating Account...' }).click({ trial: true }).catch(() => {});
    await page.getByRole('button', { name: 'Sign Up' }).click();

    // Verify it navigates to dashboard
    await expect(page).toHaveURL(/.*\/$/);
  });
});
