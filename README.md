# Legit HealthCare Services Ltd - Web Application

This is the official web application for **Legit HealthCare Services Ltd**, designed to streamline patient data management, medical screenings, and reporting. The application is built with a modern, clean, and intuitive UI/UX, ensuring a seamless experience for both clinic staff and patients.

## 🌟 Key Features

- **Patient Registration:** A comprehensive system for registering patient bio-data for yearly medical screenings.
- **Consultation Module:** Allows doctors to record and manage patient consultation findings.
- **Test Results Management:** Dedicated modules for entering and tracking various medical test results (Full Blood Count, Kidney Function, etc.).
- **Director's Review:** A specialized interface for the hospital director to review and comment on patient reports.
- **Patient Reports:** Generation of detailed patient reports, with options to download as PDF or send via email.
- **Role-Based Access Control (RBAC):** Granular permission system to control access to different features based on user roles (Admin, Doctor, etc.).
- **User & Role Management:** Admins can manage users, roles, and permissions through a dedicated Control Panel.
- **Temporary Access Codes:** A secure system for granting temporary permissions to users.
- **Theme Switching:** Light and dark mode support for user preference.
- **Responsive Design:** Fully responsive and adaptive design for a seamless experience on desktops, tablets, and mobile devices.

## 🎨 Design & Theme

- **Main System Color:** `#08733f`
- **Accent Color:** `#06e175`
- **Background Color:** `#eefff5`
- **Default Font:** Montserrat
- **UI Style:** Card-based design with smooth animations and hover effects.

## 💻 Tech Stack

- **Backend:** Python, Flask, Flask-SQLAlchemy, Flask-Migrate
- **Frontend:** TypeScript, React, Styled-Components
- **Database:** SQLite (for development), adaptable to other SQL databases.

## 🚀 Getting Started

### Prerequisites

- Python 3.x and `pip`
- Node.js and `npm`

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd legit-healthcare-app
    ```

2.  **Backend Setup:**
    ```bash
    # Navigate to the backend directory
    cd backend

    # Create a virtual environment
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`

    # Install dependencies
    pip install -r requirements.txt

    # Set up the database
    export FLASK_APP=backend/app.py
    flask db upgrade

    # Create the admin user (run from the project root)
    # Replace <password> with a secure password
    flask create-admin <password>
    ```

    **Example:**
    ```bash
    flask create-admin MySecurePassword123!
    ```

3.  **Frontend Setup:**
    ```bash
    # Navigate to the frontend directory
    cd ../frontend

    # Install dependencies
    npm install
    ```

### Running the Application

1.  **Start the Backend Server:**
    ```bash
    # From the backend directory
    flask run
    ```
    The Flask server will start on `http://127.0.0.1:5000`.

2.  **Start the Frontend Development Server:**
    ```bash
    # From the frontend directory
    npm start
    ```
    The React app will open in your browser at `http://localhost:3000`.

---
*This document will be updated as new features are developed and integrated.*
