import { Given, When, Then, DataTable, world } from "@cucumber/cucumber";
import { ICustomWorld } from "../../utils/custom_world";
import { expect } from "@playwright/test";
import { Page, Locator } from "@playwright/test"; // Import Page and Locator types

let customWorld: ICustomWorld = world as ICustomWorld; // Cast world to your custom type

// Helper function to get a locator for a field based on its label or a known selector
// You'll need to adapt this based on how your form elements are structured (e.g., input by label, input by ID, input by name)
// Helper function to get a locator for a field *within the property creation panel*
// YOU WILL NEED TO CUSTOMIZE THESE SELECTORS BASED ON YOUR APPLICATION'S HTML
function getPropertyPanelFieldLocator(page: Page, fieldName: string): Locator {
	// The panel is the first div with class 'flex z-50 ...' (use a more specific selector if needed)
	const panelLocator = page.locator('div.flex.z-50');

	switch (fieldName) {
		case "Property Name":
			return panelLocator.locator('input[placeholder="Property Name"]');
		case "Property Location":
			return panelLocator.locator('input[placeholder="Property Location"]');
		case "Property Detail":
			return panelLocator.locator('textarea[placeholder="Property Detail"]');
		case "Size (Square meter)":
			return panelLocator.locator('input[placeholder="eg. 100.00"]');
		case "Price (Baht per month)":
			return panelLocator.locator('input[placeholder="eg. 1,000.00"]');
		case "Image":
			return panelLocator.locator('input#file-input');
		default:
			throw new Error(
				`Unknown property panel field name: ${fieldName}. Add a selector in getPropertyPanelFieldLocator.`
			);
	}
}

// Step for the Background (assuming you have a login step defined elsewhere or handled by customWorld)
// You might need a step like this if your customWorld doesn't automatically handle session restoration
Given(
	"I log in to the dashboard page with email {string} and password {string}",
	async function (email: string, password: string) {
		const page = customWorld.page;

		if (page) {
			await page.goto("/auth/login"); // Adjust this path if needed
			await page.waitForLoadState("domcontentloaded");

			await page.locator("#email").fill(email); // Updated selector
			await page.locator("#password").fill(password); // Updated selector

			const loginButton = page.getByRole("button", { name: "Sign in" }); // Tailwind-friendly!
			await loginButton.click();
			await expect(page).toHaveURL("/users/dashboard", { ignoreCase: true });
		}
	}
);

Given("I am on the property listing page", async function () {
	const page = customWorld.page;
	expect(page).not.toBeNull();

	if (page) {
		await page.waitForLoadState("domcontentloaded");
		// Optional: Wait for the "Create new property" button to be visible
		await page.waitForSelector('button:has-text("Create new property")'); // **Replace with the actual selector if different**
	}
});

When("I click the {string} button", async function (buttonText: string) {
	const page = customWorld.page;
	if (!page) {
		throw new Error("Page object is not available in customWorld.");
	}
	// This step is generic to click a button by its text on the main page
	// Make sure this locator correctly finds the "Create new property" button
	const buttonLocator = page.getByRole("button", { name: buttonText, exact: true }); // Using getByRole is robust

	await expect(buttonLocator).toBeVisible();
	await buttonLocator.click();

});

When("I fill in the property details in the panel with:", async function (dataTable: DataTable) {
	const page = customWorld.page;
	if (!page) {
		throw new Error("Page object is not available in customWorld.");
	}

	// Optional: Ensure the panel is visible before trying to fill
	await expect(page.locator('.property-creation-panel')).toBeVisible(); // **Replace with panel selector**

	const rows = dataTable.rows();
	for (const row of rows) {
		const fieldName = row[0];
		const value = row[1];
		const fieldLocator = getPropertyPanelFieldLocator(page, fieldName);

		// --- Adapt these interactions based on the field type ---
		const tagName = await fieldLocator.evaluate((el) => el.tagName);
		const inputType =
			tagName === "INPUT" ? await fieldLocator.evaluate((el) => (el as HTMLInputElement).type) : null;


		if (tagName === "SELECT") {
			await fieldLocator.selectOption(value);
		} else if (tagName === "INPUT" || tagName === "TEXTAREA") {
			if (inputType === "file" && value != "") {
				// Handle file upload
				await fieldLocator.setInputFiles([value]); // value should be the file path
			} else if (value != "") {
				await fieldLocator.fill(value);
			}
		} else {
			console.warn(
				`Unsupported element type for panel field "${fieldName}": ${tagName}. Manual interaction might be needed.`
			);
			// Add custom logic for other element types
		}
    }
})

When("I click the {string} button in the panel", async function (buttonText: string) {
	const page = customWorld.page;
	if (!page) {
		throw new Error("Page object is not available in customWorld.");
	}

	// Find the button *within* the property creation panel
    const panelLocator = page.locator('.property-creation-panel'); // Example: Adjust this selector to match your panel
	const submitButton = panelLocator.getByRole("button", { name: buttonText, exact: true }); // Example: Find button by role and text inside the panel

	await expect(submitButton).toBeVisible(); // Ensure button is visible
	await submitButton.click();

	// Optional: Wait for something to happen after clicking (e.g., panel closes, list updates, success message appears)
	// This depends on what happens next in your application's UI
	await page.waitForLoadState('networkidle'); // Wait for network to be idle
});

Then("I should see a success message indicating the property was created", async function () {
    
	const page = customWorld.page;
	if (!page) {
		throw new Error("Page object is not available in customWorld.");
	}
    
	// Verify the success message is visible on the page
	// --- REPLACE WITH THE ACTUAL SELECTOR AND TEXT OF YOUR SUCCESS MESSAGE ---
	// Based on your login steps, you might have a generic step for seeing a message.
	// If the success message uses the same pattern, you might reuse that step.
	const successMessageLocator = page.getByText("Property created successfully", { exact: false }); // Example
	// -----------------------------------------------------------------------

	await expect(successMessageLocator).toBeVisible();
	// Optional: Wait for the message to disappear if it's a temporary notification
	// await successMessageLocator.waitFor({ state: 'hidden' });
});

Then("the new property {string} should appear in the property list", async function (propertyName: string) {
	const page = customWorld.page;
	if (!page) {
		throw new Error("Page object is not available in customWorld.");
	}

	// Navigate back to the list page if necessary, or check the current list
	// Assuming the list updates dynamically or you are already on the list page

	// --- REPLACE WITH THE ACTUAL SELECTOR FOR YOUR PROPERTY LIST ITEMS ---
	const propertyListItemLocator = page.locator(".property-list-item", { hasText: propertyName }); // Example: Find list item containing the property name
	// Or a more specific selector if each item has a dedicated name element:
	// const propertyNameElement = page.locator('.property-list-item .property-name', { hasText: propertyName }); // Example
	// -----------------------------------------------------------------------

	await expect(propertyListItemLocator).toBeVisible();
	// Optional: Click on the item to verify details if needed
	// await propertyListItemLocator.click();
	// await expect(page).toHaveURL(/some-details-url/); // Check URL after clicking
});


Then("I should see a validation error message matching {string}", async function (text: string) {
    const page = customWorld.page;
    if (!page) {
      throw new Error("Page object is not available in customWorld.");
    }
	const panelLocator = page.locator('.property-creation-panel');

	const errorMessageLocator = panelLocator.locator('.text-red-500.text-xs', { hasText: text , });
	// console.log(`Error message locator: ${errorMessageLocator}`);
	await expect(errorMessageLocator).toBeVisible();

});


Then("the property creation panel should still be visible", async function () {
    const page = customWorld.page;
    if (!page) {
        throw new Error("Page object is not available in customWorld.");
    }
     // Verify that the panel element is still in the DOM and visible
     // --- REPLACE WITH THE ACTUAL SELECTOR FOR YOUR PANEL ---
    const panelLocator = page.locator('.property-creation-panel'); // Example - make sure this selector is correct
     // -------------------------------------------------------
    await expect(panelLocator).toBeVisible();
    console.log("Property creation panel is still visible.");
});

// Add more step definitions as needed
// Add more step definitions as needed for other scenarios
