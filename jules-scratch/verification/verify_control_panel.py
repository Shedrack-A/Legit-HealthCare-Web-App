from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Log in as admin
    page.goto("http://localhost:3000/login")
    page.locator('input[name="username"]').fill("admin")
    page.locator('input[name="password"]').fill("password")
    page.locator('button[type="submit"]').click()

    # Wait for navigation to the dashboard
    page.wait_for_url("http://localhost:3000/dashboard")

    # Navigate to the control panel
    page.goto("http://localhost:3000/control-panel")

    # Take a screenshot
    page.screenshot(path="jules-scratch/verification/control_panel.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)