
import asyncio
from playwright.async_api import async_playwright, expect

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        try:
            # Login
            await page.goto("http://localhost:8000/")
            await page.get_by_role("link", name="Login").click()
            await page.get_by_label("Username").fill("admin")
            await page.get_by_label("Password").fill("password")
            await page.get_by_role("button", name="Login").click()
            await expect(page).to_have_url("http://localhost:8000/dashboard")

            # Navigate to Control Panel Landing Page
            await page.goto("http://localhost:8000/control-panel")
            await expect(page.get_by_role("heading", name="Control Panel")).to_be_visible()
            await page.screenshot(path="jules-scratch/verification/control_panel_landing.png")
            print("Screenshot of Control Panel landing page taken successfully.")

            # Navigate to User Management Page
            await page.goto("http://localhost:8000/control-panel/user-management")
            await expect(page.get_by_role("heading", name="User Management")).to_be_visible()
            await page.screenshot(path="jules-scratch/verification/user_management.png")
            print("Screenshot of User Management page taken successfully.")

            # Navigate to Role Management Page
            await page.goto("http://localhost:8000/control-panel/role-management")
            await expect(page.get_by_role("heading", name="Role & Permission Management")).to_be_visible()
            await page.screenshot(path="jules-scratch/verification/role_management.png")
            print("Screenshot of Role Management page taken successfully.")

        except Exception as e:
            print(f"An error occurred: {e}")

        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
