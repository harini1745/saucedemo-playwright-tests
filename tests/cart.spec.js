const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');
const { CartPage } = require('../pages/CartPage');

const STANDARD_USER = 'standard_user';
const PASSWORD = 'secret_sauce';

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(STANDARD_USER, PASSWORD);
});

test('user can add a product to the cart', async ({ page }) => {
  const inventoryPage = new InventoryPage(page);

  await inventoryPage.addItemToCart(0);

  await expect(inventoryPage.cartBadge).toHaveText('1');
});

test('user can remove a product from the cart', async ({ page }) => {
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);

  await inventoryPage.addItemToCart(0);
  await inventoryPage.openCart();

  await cartPage.expectLoaded();
  await cartPage.removeFirstItem();

  await expect(cartPage.cartItems).toHaveCount(0);
});