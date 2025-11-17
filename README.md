# FinGrow: Loan Management Platform

FinGrow is a full-stack MERN (MongoDB, Express, React, Node.js)
application designed to streamline the personal loan process. It
provides a secure, role-based platform for borrowers to apply for loans
and track repayments, and for administrators to manage applications, set
interest rates, and approve payments.

## ✨ Features

### Borrower Features

-   **Authentication**: Secure user registration and login (JWT-based).
-   **Loan Application**: A simple form to request a new loan, allowing
    users to apply for multiple loans.
-   **Loan Dashboard**: A central dashboard to view a history of all
    loans (pending, approved, rejected, paid).
-   **Repayment Schedule**: A detailed, amortized breakdown of the
    repayment schedule for every approved loan.
-   **Payment Submission**: A dedicated page for borrowers to submit
    payments with a receipt/confirmation number for admin review.
-   **Loan Calculator**: A public, dynamic calculator that estimates
    monthly payments based on the current global interest rate.

### Admin Features

-   **Role-Based Access**: Secure routes and UI components visible only
    to admin users.
-   **KPI Dashboard**: A high-level overview of key metrics, including
    total applications, approval rate, and total value
    approved/rejected.
-   **Dynamic Interest Rates**: A global settings page for admins to set
    the application's interest rate. This rate is used for all new loan
    approvals.
-   **Loan Management**: A tabbed interface to view all pending,
    approved, and rejected loans.
-   **Payment Approval**: A dedicated page to review and approve/reject
    borrower-submitted payments.
-   **Payment Logic**: Approved payments are automatically applied to
    the oldest pending installments or stored as advance credit.

## 🛠️ Tech Stack

This project is separated into two main parts: a `Frontend` (React) and
a `Backend` (Node.js/Express).

  -----------------------------------------------------------------------
  Category                            Technology
  ----------------------------------- -----------------------------------
  **Frontend**                        React, Vite, React Router, Tailwind
                                      CSS, Axios, Context API

  **Backend**                         Node.js, Express.js, MongoDB,
                                      Mongoose

  **Authentication**                  JSON Web Tokens (JWT), bcryptjs
  -----------------------------------------------------------------------

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your local
machine:

-   Node.js (v18.x or higher recommended)
-   npm (usually comes with Node.js)
-   MongoDB (running as a local service)


## 🚀 Live Demo: 
visit: 'https://fin-grow-phi.vercel.app/login'

##  Getting Started

To run this project on your local machine, you will need to open **two separate terminal
windows** (one for the backend and one for the frontend).

------------------------------------------------------------------------

### Terminal 1: Backend Setup

1.  **Navigate to the Backend directory:**

    ``` bash
    cd FinGrow/Backend
    ```

2.  **Install dependencies:**

    ``` bash
    npm install
    ```

3.  **Set up Environment Variables:** Create a file named `.env` in the
    `Backend` directory.

    ``` env
    # .env
    PORT=5000
    MONGO_URI=[Your MongoDB connection string]
    JWT_SECRET=[Your JWT secret]
    ```

    > **Note:** A standard local `MONGO_URI` is
    > `mongodb://localhost:27017/fingrow`.

4.  **Run the backend server:**

    ``` bash
    npm run dev
    ```

    The API server will be running on `http://localhost:5000`.

------------------------------------------------------------------------

### Terminal 2: Frontend Setup

1.  **Navigate to the Frontend directory:**

    ``` bash
    cd FinGrow/Frontend
    ```

2.  **Install dependencies:**

    ``` bash
    npm install
    ```

3.  **Run the frontend application:**

    ``` bash
    npm run dev
    ```

    Vite will start the development server, typically on
    `http://localhost:5173`.

### Access the Application

Open your browser and go to: **http://localhost:5173**

### Demo Users

1.  **Register a Borrower:**\
    Use the "Register" page to create a standard user.

2.  **Create an Admin User:**\
    Change their `role` in MongoDB from *borrower* to *admin* manually,
    or temporarily modify the register controller.
