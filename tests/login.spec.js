const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');

const STANDARD_USER = 'standard_user';
const LOCKED_USER = 'locked_out_user';
const PASSWORD = 'secret_sauce';

test('standard user can log in successfully', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  await loginPage.goto();
  await loginPage.login(STANDARD_USER, PASSWORD);

  await inventoryPage.expectLoaded();
  await expect(page).toHaveURL(/inventory/);
});

test('login fails with an invalid password', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(STANDARD_USER, 'wrong-password');

  await loginPage.expectError('Username and password do not match');
});

test('locked-out user cannot log in', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(LOCKED_USER, PASSWORD);

  await loginPage.expectError('Sorry, this user has been locked out');
});

test('login fails when fields are empty', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login('', '');

  await loginPage.expectError('Username is required');
});
