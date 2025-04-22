import { Given, When, Then, world } from "@cucumber/cucumber";
import { ICustomWorld } from "../../utils/custom_world";
import { expect } from "@playwright/test";

let customWorld: ICustomWorld = world;

Given("the user is on the login page", async () => {
  const page = customWorld.page;
  expect(page).not.toBeNull();

  if (page) {
    await page.goto("/auth/login"); // Adjust this path if needed
    await page.waitForLoadState("domcontentloaded");
  }
});

When("the user logs in with username {string} and password {string}", async (username: string, password: string) => {
  const page = customWorld.page;
  if (page) {
    await page.locator("#email").fill(username);      // Updated selector
    await page.locator("#password").fill(password);   // Updated selector

    const loginButton = page.getByRole("button", { name: "Sign in" }); // Tailwind-friendly!
    await loginButton.click();
  }
});

Then("they should see {string}", async (message: string) => {
  const page = customWorld.page;
  if (page) {
    const messageElement = page.getByText(message, { exact: false });
    await expect(messageElement).toBeVisible();
  }
});

Then("they should navigate to {string}", async (path: string) => {
  const page = customWorld.page;
  if (page) {
    await expect(page).toHaveURL(path, { ignoreCase: true });
  }
});
