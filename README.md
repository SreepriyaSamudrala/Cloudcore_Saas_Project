# Cloudcore_Saas_Project
Cloudcore SaaS Project: This system provides secure user sign-up and email verification. It features a Node.js/Express.js backend with MongoDB for data, Nodemailer for sending verification emails, and bcrypt for password hashing. The frontend integrates seamlessly for a complete registration flow.



# Cloudcore SaaS Sign-up & Email Verification System

## Project Description

This project establishes a robust **user registration and email verification system** for the Cloudcore SaaS platform. It handles new user sign-ups from start to finish, ensuring account security and authenticity through a modern web stack.

## Features

* **User Registration:** Allows new users to sign up with full name, email, and password.
* **Secure Password Storage:** Passwords are automatically hashed using `bcrypt.js` before being stored in the database.
* **Email Verification:** Sends a unique verification link to the user's email address upon registration.
* **Account Activation:** Marks user accounts as `verified` in the database upon successful email link click.
* **Frontend Integration:** Seamlessly integrates with a static HTML frontend for user interaction and feedback.
* **CORS Configuration:** Properly handles Cross-Origin Resource Sharing for secure communication between frontend and backend.
* **Environment Variable Management:** Uses `.env` for secure handling of sensitive credentials (e.g., email passwords, database URIs).

## Technologies Used

* **Backend:**
    * [Node.js](https://nodejs.org/): JavaScript runtime environment.
    * [Express.js](https://expressjs.com/): Fast, unopinionated, minimalist web framework for Node.js.
    * [MongoDB](https://www.mongodb.com/): NoSQL database for storing user data.
    * [Mongoose](https://mongoosejs.com/): MongoDB object data modeling (ODM) for Node.js.
    * [Bcrypt.js](https://www.npmjs.com/package/bcryptjs): Library for hashing passwords.
    * [Nodemailer](https://nodemailer.com/): Module for sending emails.
    * [Dotenv](https://www.npmjs.com/package/dotenv): Loads environment variables from a `.env` file.
    * [CORS](https://www.npmjs.com/package/cors): Node.js package for providing a Connect/Express middleware that can be used to enable CORS.
* **Frontend:**
    * HTML5
    * CSS (via Tailwind CSS CDN)
    * JavaScript (ES6+)
* **Tools:**
    * [Git](https://git-scm.com/): Version control system.
    * [GitHub](https://github.com/): Code hosting platform.
    * [VS Code](https://code.visualstudio.com/): Code editor.
    * [Live Server (VS Code Extension)](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer): For local frontend development.

## Getting Started

Follow these steps to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed:

* **Node.js & npm:** Download from [nodejs.org](https://nodejs.org/).
* **MongoDB Community Server:** Download and install from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community).
    * Ensure your `mongod` service is running or manually start it. Create the default data directory (e.g., `C:\data\db` on Windows, `/data/db` on Linux/macOS) if it doesn't exist.
* **VS Code:** Download from [code.visualstudio.com](https://code.visualstudio.com/).
* **Live Server Extension:** Install in VS Code (search for "Ritwick Dey Live Server").

### Installation & Setup

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/YourUsername/Cloudcore_SaaS_Project.git](https://github.com/YourUsername/Cloudcore_SaaS_Project.git)
    cd Cloudcore_SaaS_Project
    ```
    (Replace `YourUsername` with your actual GitHub username).

2.  **Backend Setup:**
    * Navigate into the `backend` directory:
        ```bash
        cd backend
        ```
    * Install backend dependencies:
        ```bash
        npm install
        ```
    * Create a `.env` file in the `backend` directory with the following content:
        ```dotenv
        MONGODB_URI=mongodb://localhost:27017/cloudcoredb
        EMAIL_USER=your_email@gmail.com
        EMAIL_PASS=your_gmail_app_password_here # Use an App Password for Gmail
        FRONTEND_URL=[http://127.0.0.1:5500](http://127.0.0.1:5500)      # Verify your Live Server URL
        SERVER_PORT=5000
        ```
        **Crucial:** Replace placeholders with your actual Gmail credentials (use an [App Password](https://support.google.com/accounts/answer/185833?hl=en) if using Gmail) and ensure `FRONTEND_URL` matches the address Live Server provides when running your `index.html`.

3.  **Run the Backend Server:**
    * From the `backend` directory:
        ```bash
        node server.js
        ```
    * You should see "MongoDB Connected..." and "Server started on port 5000" in your terminal. Keep this terminal open.

4.  **Run the Frontend:**
    * Open the `Cloudcore_SaaS_Project` folder in VS Code.
    * Navigate to the `frontend` folder.
    * Right-click on `index.html` and select "Open with Live Server".
    * Your web browser will open the frontend. Note the URL (e.g., `http://127.0.0.1:5500`). Ensure this matches your `FRONTEND_URL` in `.env`.

### Usage

1.  **Sign Up:** On the `index.html` page (opened by Live Server), fill out the sign-up form with a **valid email address** you can access.
2.  **Check Email:** After submission, you'll be redirected to `check-email.html`. Check your provided email inbox (and spam/junk folder) for the verification email.
3.  **Verify Account:** Click the "Verify My Account" link in the email.
4.  **Account Verified:** You will be redirected to the `thank-you-verified.html` page, confirming successful verification. You can then check your MongoDB `cloudcoredb` database (in the `users` collection) to see `isVerified: true` for the registered user.

## Contributing

Contributions are welcome! If you have suggestions for improvements or find issues, please open an issue or submit a pull request.

## License

This project is open-source and available under the [MIT License](LICENSE).
