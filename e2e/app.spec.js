const { test, expect } = require('@playwright/test');

test('can add, complete, rename, and archive a todo', async ({ page }) => {
  const todoText = `Buy milk ${Date.now()}`;
  const renamedTodoText = `Buy oat milk ${Date.now()}`;

  await page.goto('http://localhost:8080');

  await page.fill('#todo-input', todoText);

  await page.click('#add-button');

  await expect(page.getByText(todoText)).toBeVisible();

  await page
    .getByText(todoText)
    .locator('..')
    .locator('input[type="checkbox"]')
    .check();

  await expect(page.getByText(todoText).locator('..')).toHaveCSS(
    'text-decoration-line',
    'line-through'
  );

  await page.reload();

  await page.getByText(todoText).dblclick();

  const editInput = page.locator('#edit-input');

  await editInput.fill(renamedTodoText);

  await editInput.press('Enter');

  await expect(page.getByText(renamedTodoText)).toBeVisible();

  await expect(page.getByText(renamedTodoText).locator('..')).toHaveCSS(
    'text-decoration-line',
    'line-through'
  );

  await page.click('#archive-button');

  await expect(page.getByText(renamedTodoText)).toHaveCount(0);
});