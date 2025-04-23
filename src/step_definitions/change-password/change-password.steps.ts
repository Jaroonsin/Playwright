import { Given, When, Then, world } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { ICustomWorld } from "../../utils/custom_world";

let customWorld: ICustomWorld = world as ICustomWorld;

Given("the user with email {string} has the old password {string}", async function (email: string, oldPassword: string) {
        const page = customWorld.page;
  
        if (page) {
            await page.goto("/auth/login"); // Adjust this path if needed
            await page.waitForLoadState("domcontentloaded");
  
            await page.locator("#email").fill(email); // Updated selector
            await page.locator("#password").fill(oldPassword); // Updated selector
  
            const loginButton = page.getByRole("button", { name: "Sign in" }); // Tailwind-friendly!
            await loginButton.click();
            await expect(page).toHaveURL("/users/dashboard", { ignoreCase: true });

            await page.goto("/profile"); // Navigating to the profile page
            await page.waitForLoadState("domcontentloaded"); 
        }
    }
);


When('the current password is {string}', async function (currentPassword: string) {
    const page = customWorld.page;
    if (page) {
      await page.locator('input[id="currentPassword"]').fill(currentPassword);
    }
  });
  
  When('the new password is {string}', async function (newPassword: string) {
    const page = customWorld.page;
    if (page) {
      await page.locator('input[id="newPassword"]').fill(newPassword);
    }
  });
  
  When('the confirm new password is {string}', async function (confirmPassword: string) {
    const page = customWorld.page;
    if (page) {
      await page.locator('input[id="confirmPassword"]').fill(confirmPassword);
    }
  });
  

// When("I submit the password change form", async function () {
//   const page = customWorld.page;
//   if (page) {
//     const button = page.getByRole("button", { name: "Change Password", exact: true });
//     await button.click();
//     await page.waitForLoadState("networkidle");
//   }
// });

Then('I should see {string}', async function (message: string) {
    const page = customWorld.page;
    if (page) {
      const button = page.getByRole("button", { name: "Change Password", exact: true });
  
      // Check if the button is enabled (can be clicked)
      const isButtonEnabled = await button.isEnabled();
  
      if (isButtonEnabled) {
        await button.click();
        await page.waitForLoadState("networkidle");
      }
  
      // Check for the expected message, regardless of whether we clicked
      const messageElement = page.getByText(message, { exact: false });
      await expect(messageElement).toBeVisible();
    }
  });
