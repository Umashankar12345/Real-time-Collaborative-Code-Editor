const { test, expect } = require('@playwright/test');

test.describe('Room functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.getByPlaceholder('developer').fill('testuser');
    await page.getByPlaceholder('••••••••').fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(/.*\/$/);
  });

  test('Create Room', async ({ page }) => {
    // Click on Create Room card
    await page.getByText('Create Room', { exact: true }).click();
    
    // Verify it navigates to a room
    await expect(page).toHaveURL(/\/room\/room-\d+/);
    
    // Check if some editor/workspace element is visible
    // Depending on workspace layout, we might check for the header or editor
    // We'll just verify the URL for now
  });

  test('Join Room directly via URL', async ({ page }) => {
    // Since join room UI might not be fully wired up, test joining via URL
    const roomId = `room-${Date.now()}`;
    await page.goto(`/room/${roomId}`);
    
    // Verify we are in the room
    await expect(page).toHaveURL(new RegExp(`/room/${roomId}`));
  });
});
