import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should display the landing page', async ({ page }) => {
    await page.goto('/');

    // Check for main heading
    await expect(page.getByRole('heading', { name: /ecomama/i })).toBeVisible();
    
    // Check for subtitle
    await expect(page.getByText(/connecting farmers & consumers/i)).toBeVisible();
    
    // Check for feature cards
    await expect(page.getByText(/marketplace/i)).toBeVisible();
    await expect(page.getByText(/events & news/i)).toBeVisible();
    await expect(page.getByText(/forums/i)).toBeVisible();
  });

  test('should have functioning buttons', async ({ page }) => {
    await page.goto('/');

    // Check buttons are visible
    await expect(page.getByRole('button', { name: /get started/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /learn more/i })).toBeVisible();
  });
});
