const { test, expect } = require('@playwright/test');

test('shows the Todo App page', async ({ page }) => {
  await page.goto('http://localhost:8080');

  await expect(
    page.getByRole('heading', { name: 'Todo App' })
  ).toBeVisible();
});
