
import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Go to the home page first, then navigate to login
        await page.goto("http://localhost:8000/")
        await page.click('a[href="/login"]')

        # Wait for the login form to be visible
        await page.wait_for_selector('form')

        # Fill in the login form using ID selectors
        await page.fill('#username', "testuser")
        await page.fill('#password', "Password123!")

        # Click the login button
        await page.click('button[type="submit"]')

        # Wait for navigation to the dashboard page and for the content to be ready
        await page.wait_for_url("**/dashboard")
        await page.wait_for_selector("h1:has-text('Protected Dashboard')")

        # Take the screenshot
        await page.screenshot(path="jules-scratch/verification/dashboard.png")

        await browser.close()

asyncio.run(main())
