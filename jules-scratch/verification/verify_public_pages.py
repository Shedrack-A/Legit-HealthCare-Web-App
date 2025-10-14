from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Navigate to the homepage first
    page.goto("http://localhost:8000")

    # Wait for the page to be fully interactive
    page.wait_for_load_state('networkidle')
    page.screenshot(path="jules-scratch/verification/homepage.png")

    # Click the "Login" link
    page.get_by_role("link", name="Login").click()

    # Explicitly wait for the URL to change
    page.wait_for_url("http://localhost:8000/login")

    # Now on the login page, verify the heading and take a screenshot
    expect(page.get_by_role("heading", name="Login")).to_be_visible()
    page.screenshot(path="jules-scratch/verification/login-page.png")

    context.close()
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
