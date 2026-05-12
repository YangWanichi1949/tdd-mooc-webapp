const { test, expect } = require('@playwright/test');

test('can add and complete a todo', async ({ page }) => {
  const todoText = `Buy milk ${Date.now()}`;

  await page.goto('http://localhost:8080');

  await page.fill('#todo-input', todoText);

  await page.click('#add-button');

  await expect(page.getByText(todoText)).toBeVisible();

  await page.getByText(todoText).locator('..').locator('input[type="checkbox"]').check();

  await expect(page.getByText(todoText).locator('..')).toHaveCSS(
    'text-decoration-line',
    'line-through'
  );

  await page.reload();

  await expect(page.getByText(todoText).locator('..')).toHaveCSS(
    'text-decoration-line',
    'line-through'
  );
});