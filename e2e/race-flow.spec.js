import { test, expect } from "@playwright/test";

test.describe("Race day flow", () => {
  test("user can generate program and see races progress", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: "Horse Racing" })
    ).toBeVisible();

    const generateButton = page.getByRole("button", {
      name: "GENERATE PROGRAM",
    });
    const controlButton = page.locator(".btn-start");

    await expect(controlButton).toBeDisabled();

    await generateButton.click();

    const horseRows = page.locator(".horse-table tbody tr");
    await expect(horseRows).toHaveCount(20);
    await expect(controlButton).toBeEnabled();

    await controlButton.click();
    await expect(controlButton).toHaveText("PAUSE");

    const resultsRound = page
      .locator(".results-container .round-section")
      .first();
    await expect(resultsRound).toBeVisible({ timeout: 40000 });

    const lapInfo = page.locator(".lap-info");
    await expect(lapInfo).toContainText("2nd Lap", { timeout: 60000 });
  });
});
