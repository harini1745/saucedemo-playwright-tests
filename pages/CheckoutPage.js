const { expect } = require('@playwright/test');

class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.firstName = page.getByPlaceholder('First Name');
    this.lastName = page.getByPlaceholder('Last Name');
    this.postalCode = page.getByPlaceholder('Zip/Postal Code');
    this.continueButton = page.getByTestId('continue');
    this.errorMessage = page.getByText(/Error:/);
    this.finishButton = page.getByTestId('finish');
    this.confirmationMessage = page.getByText('Thank you for your order!');
  }

  async fillCustomerDetails(firstName, lastName, postalCode) {
    await this.firstName.fill(firstName);
    await this.lastName.fill(lastName);
    await this.postalCode.fill(postalCode);
  }

  async continue() {
    await this.continueButton.click();
  }

  async finishOrder() {
    await this.finishButton.click();
  }

  async expectError(message) {
    await expect(this.errorMessage).toContainText(message);
  }
}

module.exports = { CheckoutPage };