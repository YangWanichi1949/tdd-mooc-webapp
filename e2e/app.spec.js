const { test, expect } = require('@playwright/test');

test('can add a todo', async ({ page }) => {
  await page.goto('http://localhost:8080');

  await page.fill('#todo-input', 'Buy milk');

  await page.click('#add-button');

  await expect(page.locator('text=Buy milk')).toBeVisible();
});