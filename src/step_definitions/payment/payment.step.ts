/// <reference path="../../types/omise.d.ts" />
import { Given, When, Then, world } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { ICustomWorld } from "../../utils/custom_world";

let customWorld: ICustomWorld = world as ICustomWorld;

async function mockOmise(page: any) {
  await page.addInitScript(() => {
    window.Omise = {
      setPublicKey: () => {},
      createToken: (_type: string, _params: any, callback: any) => {
        callback(200, { id: 'tokn_test_123' });
      }
    };
  });
}

Given(
    "I log in to the dashboard as payment user with email {string} and password {string}",
    async function (email: string, password: string) {
        const page = this.page;
        if (!page) throw new Error("Page is undefined");

        if (page) {
            await page.goto("/auth/login"); // /auth/login
            await page.waitForLoadState("domcontentloaded");

            await page.locator("#email").fill(email); // Updated selector
            await page.locator("#password").fill(password); // Updated selector

            const loginButton = page.getByRole("button", { name: "Sign in" }); // Tailwind-friendly!
            await loginButton.click();
            await expect(page).toHaveURL("/users/dashboard", { ignoreCase: true });
            
            await page.getByRole("button", { name: "Transaction" }).click();

            await expect(page).toHaveURL("/transactions", { ignoreCase: true });

            const paymentEntry = page.getByText("Payment").first();
            await paymentEntry.scrollIntoViewIfNeeded();
            await paymentEntry.click();

            await page.getByRole("button", { name: "Pay Rental" }).click();
            // await expect(page.getByText("Pay Rental")).toBeVisible();
            await expect(page.getByRole("button", { name: "Pay Rental" })).toBeVisible();
        }
    }
);

// Given("the user is on the payment modal", async function (this: ICustomWorld) {
//   const page = this.page;
//   if (!page) throw new Error("Page is undefined");

//   await mockOmise(page);
//   await page.goto("/your-page-with-payment-modal");
//   await page.evaluate(() => {
//     const openBtn = document.querySelector('#open-payment-modal');
//     if (openBtn) (openBtn as HTMLElement).click();
//   });
//   await expect(page.getByText("Pay Rental")).toBeVisible();
// });

When("the user submits payment with:", async function (this: ICustomWorld, dataTable) {
  const page = this.page;
  if (!page) throw new Error("Page is undefined");

  const data = Object.fromEntries(dataTable.rawTable.slice(1));

//   await page.locator('label:has-text("Cardholder Name") + input').waitFor({ state: 'visible' });
//   await page.locator('label:has-text("Cardholder Name") + input').fill(data.name || '');
  await page.locator('label:has-text("Cardholder Name") + input').fill('Wave');


//   await page.locator('label:has-text("Cardholder Name")').locator('xpath=following-sibling::input').fill(data.name || '');
//   await page.locator('label:has-text("Cardholder Name")').locator('.. >> input').fill(data.name || ''); 
//   await page.locator('input[autocomplete="name"]').fill(data.name || '');

  await page.locator('label:has-text("Card Number") + input').fill(data.number || '');
  await page.locator('label:has-text("Expiry Month") + input').fill(data.month || '');
  await page.locator('label:has-text("Expiry Year") + input').fill(data.year || '');
  await page.locator('label:has-text("Security Code") + input').fill(data.securityCode || '');

//   await page.click('text=Pay Now');
  const payBtn = page.getByRole("button", { name: "Pay Now" });
  await expect(payBtn).toBeVisible(); // (optional) Debug ให้แน่ใจว่ามันโผล่จริง

  if (await payBtn.isDisabled()) {
    console.log("Pay Now button is disabled — form not submittable");
    return;
  }
  
  await page.waitForTimeout(1000);
  await payBtn.click();
  await page.waitForTimeout(1000);
  await page.reload({ waitUntil: "domcontentloaded" });
});

// Then("payment error should show {string}", async function (this: ICustomWorld, text: string) {
//   const page = this.page;
//   if (!page) throw new Error("Page is undefined");
//   const errorElement = page.getByText(text, { exact: false });
//   await expect(errorElement).toBeVisible();
// });

Then("the modal should close", async function (this: ICustomWorld) {
  const page = this.page;
  if (!page) throw new Error("Page is undefined");

//   await expect(page.getByText("Pay Rental")).toHaveCount(0);
//   await expect(page.getByRole("button", { name: "Pay Rental" })).toHaveCount(0);

  await page.reload({ waitUntil: "domcontentloaded" });

  const refreshBtn = page.locator('svg path[d*="M14.5 10.6665L11.8333 13.3332"]');
  await refreshBtn.first().click();

  await page.waitForTimeout(1000);
  
  const firstTransaction = page.locator("div:has-text('Payment')").first();
  await firstTransaction.scrollIntoViewIfNeeded();
  await expect(firstTransaction).toContainText("Active");
});
