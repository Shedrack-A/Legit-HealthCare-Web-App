import re
from playwright.sync_api import sync_playwright, Page, expect
import requests
import time

def run(playwright):
    base_url = "http://127.0.0.1:5000"

    # Login as admin to get token
    login_res = requests.post(f"{base_url}/api/login", json={"username": "admin", "password": "AdminPassword123!"})
    token = login_res.json()['token']
    headers = {"Authorization": f"Bearer {token}"}

    # Create patient
    patient_data = {
        "staff_id": "54321",
        "first_name": "Jane",
        "middle_name": "Austen",
        "last_name": "Smith",
        "department": "HR",
        "gender": "Female",
        "date_of_birth": "1990-05-15",
        "contact_phone": "555-123-4567",
        "email_address": "jane.smith@example.com",
        "race": "Hispanic",
        "nationality": "Canadian",
        "patient_id_for_year": "P2024002",
        "screening_year": 2024,
        "company_section": "DCP"
    }
    requests.post(f"{base_url}/api/screening/register", json=patient_data, headers=headers)

    # Add some consultation data
    consultation_data = {
        "staff_id": "54321",
        "comment_one": "Patient is in good health.",
        "comment_two": "Recommend annual check-ups.",
        "bp": "120/80"
    }
    requests.post(f"{base_url}/api/save-director-review/54321", json=consultation_data, headers=headers)

    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Log in to the frontend as admin
    page.goto("http://localhost:3000/login")

    # Handle the dev server overlay
    overlay = page.locator("#webpack-dev-server-client-overlay")
    if (overlay.is_visible()):
        page.evaluate('document.querySelector("#webpack-dev-server-client-overlay").remove()')

    page.get_by_label("Username").fill("admin")
    page.get_by_label("Password").fill("AdminPassword123!")
    page.get_by_role("button", name="Login").click()

    # Set global filters
    page.goto("http://localhost:3000/view-records")
    page.wait_for_url("http://localhost:3000/view-records")
    page.wait_for_selector('select')
    page.select_option('select:nth-of-type(1)', value='DCP')
    page.select_option('select:nth-of-type(2)', value='2024')

    # Navigate to the report page for the test patient
    page.goto("http://localhost:3000/patient-report/view/54321")

    # Wait for the report to be rendered
    expect(page.locator("#report-to-download")).to_be_visible()

    # Give it a moment for images to load
    time.sleep(5)

    page.screenshot(path="jules-scratch/verification/verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)