const { test, expect } = require('@playwright/test');

test.describe('Editor functionality', () => {
  test('Type code in editor', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.getByPlaceholder('developer').fill('testuser');
    await page.getByPlaceholder('••••••••').fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Go to a room
    const roomId = `room-${Date.now()}`;
    await page.goto(`/room/${roomId}`);
    
    // The monaco editor uses a text area for input. We can target it.
    // Playwright locator for Monaco editor:
    const editorElement = page.locator('.monaco-editor').first();
    await expect(editorElement).toBeVisible();

    // Click inside the editor to focus
    await editorElement.click();
    
    // Type some code
    const testCode = '// Playwright test code';
    await page.keyboard.type(testCode);
    
    // Verify code is in the editor
    await expect(page.locator('.view-lines')).toContainText('Playwright test code');
  });

  test('Real-time sync between two users', async ({ browser }) => {
    // We create two separate browser contexts to represent User A and User B
    const contextA = await browser.newContext();
    const contextB = await browser.newContext();
    
    const pageA = await contextA.newPage();
    const pageB = await contextB.newPage();
    
    // User A Login
    await pageA.goto('/login');
    await pageA.getByPlaceholder('developer').fill('userA');
    await pageA.getByPlaceholder('••••••••').fill('password123');
    await pageA.getByRole('button', { name: 'Sign In' }).click();
    
    // User B Login
    await pageB.goto('/login');
    await pageB.getByPlaceholder('developer').fill('userB');
    await pageB.getByPlaceholder('••••••••').fill('password123');
    await pageB.getByRole('button', { name: 'Sign In' }).click();
    
    // Both join the same room
    const roomId = `room-sync-${Date.now()}`;
    await pageA.goto(`/room/${roomId}`);
    await pageB.goto(`/room/${roomId}`);
    
    // Wait for editors to load
    await expect(pageA.locator('.monaco-editor').first()).toBeVisible();
    await expect(pageB.locator('.monaco-editor').first()).toBeVisible();
    
    // User A types code
    await pageA.locator('.monaco-editor').first().click();
    const syncText = '// Hello from User A';
    await pageA.keyboard.type(syncText);
    
    // Wait a moment for socket sync
    await pageA.waitForTimeout(1000);
    
    // Verify User B sees the code
    await expect(pageB.locator('.view-lines')).toContainText('Hello from User A');
    
    await contextA.close();
    await contextB.close();
  });
});
