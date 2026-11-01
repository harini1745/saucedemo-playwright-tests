const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');

const STANDARD_USER = 'standard_user';
const PASSWORD = 'secret_sauce';

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(STANDARD_USER, PASSWORD);
});

test('products are displayed after login', async ({ page }) => {
  const inventoryPage = new InventoryPage(page);

  await inventoryPage.expectLoaded();
  await expect(inventoryPage.inventoryItems.first()).toBeVisible();
});

test('products can be sorted by price from low to high', async ({ page }) => {
  const inventoryPage = new InventoryPage(page);

  await inventoryPage.sortBy('Price (low to high)');

  const prices = await inventoryPage.itemPrices.allTextContents();
  const numericPrices = prices.map(price =>
    Number(price.replace('$', ''))
  );

  const sortedPrices = [...numericPrices].sort((a, b) => a - b);
  expect(numericPrices).toEqual(sortedPrices);
});

test('products can be sorted by name from A to Z', async ({ page }) => {
  const inventoryPage = new InventoryPage(page);

  await inventoryPage.sortBy('Name (A to Z)');

  const names = await inventoryPage.itemNames.allTextContents();
  const sortedNames = [...names].sort((a, b) =>
    a.localeCompare(b)
  );

  expect(names).toEqual(sortedNames);
});
