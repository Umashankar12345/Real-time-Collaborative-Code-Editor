const { test, expect } = require('@playwright/test');

test.describe('Real-time Collaboration & Synchronization', () => {
  let roomId;

  test('The "Killer" 2-Browser Collaboration Test', async ({ browser }) => {
    // We launch two entirely separate incognito browser contexts
    const contextA = await browser.newContext();
    const contextB = await browser.newContext();
    
    const pageA = await contextA.newPage();
    const pageB = await contextB.newPage();

    // ---------------------------------------------------------
    // STEP 1: USER A LOGS IN AND CREATES A ROOM
    // ---------------------------------------------------------
    await pageA.goto('http://localhost:5173/login');
    // Assuming UI has basic login fields
    await pageA.fill('input[type="email"]', 'testuserA@example.com');
    await pageA.fill('input[type="password"]', 'password123');
    await pageA.click('button[type="submit"]');
    
    // Wait for Dashboard
    await pageA.waitForURL('**/dashboard');
    
    // Click 'Create Room' quick action
    await pageA.click('text=Create Room');
    await pageA.waitForURL('**/room/*');
    
    // Extract Room ID from URL
    const url = pageA.url();
    roomId = url.split('/room/')[1];

    // User A creates a new file in the room
    await pageA.click('button[title="New File"]');
    await pageA.fill('input[placeholder="Filename..."]', 'app.js');
    await pageA.keyboard.press('Enter');

    // ---------------------------------------------------------
    // STEP 2: USER B LOGS IN AND JOINS THE SAME ROOM
    // ---------------------------------------------------------
    await pageB.goto('http://localhost:5173/login');
    await pageB.fill('input[type="email"]', 'testuserB@example.com');
    await pageB.fill('input[type="password"]', 'password123');
    await pageB.click('button[type="submit"]');
    
    await pageB.waitForURL('**/dashboard');
    
    // User B joins via the join input
    await pageB.click('text=Join Room'); // Opens modal
    await pageB.fill('input[placeholder*="room-"]', roomId);
    await pageB.click('button:has-text("Join Room")');

    // Wait for User B to load the room and open the same file
    await pageB.waitForURL(`**/room/${roomId}`);
    await pageB.click('text=app.js');

    // ---------------------------------------------------------
    // STEP 3: CONCURRENT EDITING VERIFICATION (YJS CRDT)
    // ---------------------------------------------------------
    
    // 3a. User A types "hello"
    // Click inside the monaco editor
    await pageA.click('.monaco-editor'); 
    await pageA.keyboard.type('hello');

    // 3b. Verify User B immediately sees "hello"
    await expect(pageB.locator('.monaco-editor')).toContainText('hello', { timeout: 2000 });

    // 3c. User B types " world"
    await pageB.click('.monaco-editor');
    // Move cursor to end just in case
    await pageB.keyboard.press('End');
    await pageB.keyboard.type(' world');

    // 3d. Verify User A immediately sees "hello world"
    await expect(pageA.locator('.monaco-editor')).toContainText('hello world', { timeout: 2000 });

    // ---------------------------------------------------------
    // STEP 4: DISCONNECT & RECONNECT HANDLING
    // ---------------------------------------------------------
    
    // Simulate User B dropping network connection
    await contextB.setOffline(true);
    
    // User A continues typing while B is offline
    await pageA.keyboard.press('Enter');
    await pageA.keyboard.type('const a = 1;');

    // User B comes back online
    await contextB.setOffline(false);

    // Verify Yjs syncs the missed offline changes automatically
    await expect(pageB.locator('.monaco-editor')).toContainText('const a = 1;', { timeout: 5000 });

    // Close browsers
    await contextA.close();
    await contextB.close();
  });
});
