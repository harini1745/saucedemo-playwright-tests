const { expect } = require('@playwright/test');

class CartPage {
  constructor(page) {
    this.page = page;
    this.title = page.getByText('Your Cart');
    this.cartItems = page.getByTestId('inventory-item');
    this.removeButtons = page.getByRole('button', { name: 'Remove' });
    this.checkoutButton = page.getByTestId('checkout');
  }

  async expectLoaded() {
    await expect(this.title).toBeVisible();
  }

  async removeFirstItem() {
    await this.removeButtons.first().click();
  }

  async goToCheckout() {
    await this.checkoutButton.click();
  }
}

module.exports = { CartPage };