const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');
const { CartPage } = require('../pages/CartPage');
const { CheckoutPage } = require('../pages/CheckoutPage');

const STANDARD_USER = 'standard_user';
const PASSWORD = 'secret_sauce';

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);

  await loginPage.goto();
  await loginPage.login(STANDARD_USER, PASSWORD);

  await inventoryPage.addItemToCart(0);
  await inventoryPage.openCart();
  await cartPage.goToCheckout();
});

test('checkout requires a first name', async ({ page }) => {
  const checkoutPage = new CheckoutPage(page);

  await checkoutPage.fillCustomerDetails('', 'Doe', '12345');
  await checkoutPage.continue();

  await checkoutPage.expectError('First Name is required');
});

test('checkout requires a last name', async ({ page }) => {
  const checkoutPage = new CheckoutPage(page);

  await checkoutPage.fillCustomerDetails('John', '', '12345');
  await checkoutPage.continue();

  await checkoutPage.expectError('Last Name is required');
});

test('checkout requires a postal code', async ({ page }) => {
  const checkoutPage = new CheckoutPage(page);

  await checkoutPage.fillCustomerDetails('John', 'Doe', '');
  await checkoutPage.continue();

  await checkoutPage.expectError('Postal Code is required');
});

test('user can complete a valid checkout', async ({ page }) => {
  const checkoutPage = new CheckoutPage(page);

  await checkoutPage.fillCustomerDetails('John', 'Doe', '12345');
  await checkoutPage.continue();
  await checkoutPage.finishOrder();

  await expect(checkoutPage.confirmationMessage).toBeVisible();
});