const { test, expect } = require('@playwright/test');

test.describe('Login functionality', () => {
  test('Successful login navigates to dashboard', async ({ page }) => {
    // We assume there's a user 'testuser' with password 'password123'
    // If not, this test will fail until a user is seeded
    await page.goto('/login');
    
    // Check if it's the login form
    await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible();

    await page.getByPlaceholder('developer').fill('testuser');
    await page.getByPlaceholder('••••••••').fill('password123');
    
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Verify it navigates to dashboard
    await expect(page).toHaveURL(/.*\/$/); // Dashboard is at '/'
    
    // Usually the dashboard would have some specific element, let's wait for navigation
    // wait for url to be dashboard root, can't guarantee what's on dashboard right now
  });

  test('Invalid login shows error message', async ({ page }) => {
    await page.goto('/login');
    
    await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible();

    await page.getByPlaceholder('developer').fill('wronguser');
    await page.getByPlaceholder('••••••••').fill('wrongpassword');
    
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Verify error message appears. 
    // The error text depends on backend, but typically 'Invalid credentials' or 'User not found'
    // We will just check that an element with the error class or some error text appears.
    const errorElement = page.locator('.text-\\[\\#FF4D8D\\]');
    await expect(errorElement).toBeVisible();
  });
});
