from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Navigate to the homepage first
    page.goto("http://localhost:8000")

    # Click the "Login" link
    page.get_by_role("link", name="Login").click()

    # Explicitly wait for the URL to change
    page.wait_for_url("http://localhost:8000/login")

    # Now on the login page, verify the heading and take a screenshot
    expect(page.get_by_role("heading", name="Login")).to_be_visible()
    page.screenshot(path="jules-scratch/verification/login-page.png")

    # Attempt to navigate to the protected patient registration page
    page.goto("http://localhost:8000/register-patient")

    # Expect to be redirected back to the login page
    page.wait_for_url("http://localhost:8000/login")
    page.screenshot(path="jules-scratch/verification/protected-route-redirect.png")

    context.close()
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
