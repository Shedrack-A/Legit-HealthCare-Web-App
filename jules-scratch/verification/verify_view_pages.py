
import asyncio
from playwright.async_api import async_playwright, expect

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        try:
            # Navigate to the login page
            await page.goto("http://localhost:8000/")

            # Click the staff/user login link
            await page.get_by_role("link", name="Login").click()

            # Fill in the login form
            await page.get_by_label("Username").fill("admin")
            await page.get_by_label("Password").fill("password") # Assuming 'password' for local dev
            await page.get_by_role("button", name="Login").click()

            # Wait for navigation to the dashboard
            await expect(page).to_have_url("http://localhost:8000/dashboard")

            # Navigate to View Patients page and take a screenshot
            await page.goto("http://localhost:8000/view-patients")
            await expect(page.get_by_role("heading", name="View All Patients")).to_be_visible()
            await page.screenshot(path="jules-scratch/verification/view_patients_page.png")
            print("Screenshot of View Patients page taken successfully.")

            # Navigate to View Records page and take a screenshot
            await page.goto("http://localhost:8000/view-records")
            await expect(page.get_by_role("heading", name="View Screening Records")).to_be_visible()
            await page.screenshot(path="jules-scratch/verification/view_records_page.png")
            print("Screenshot of View Records page taken successfully.")

        except Exception as e:
            print(f"An error occurred: {e}")

        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
