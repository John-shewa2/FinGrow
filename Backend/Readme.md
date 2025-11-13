# FinGrow Backend

Welcome to the backend repository for FinGrow!

This backend service provides a RESTful API for the FinGrow application, a platform for managing loan applications. It handles user authentication, loan creation, and administrative actions like approving or rejecting loans.

## ✨ Features

- **User Authentication**: Secure endpoints for user registration and login (JWT-based).
- **Loan Management**: Allows users to create and view their loan applications.
- **Admin Controls**: Provides administrators with endpoints to view all loans and update their status (approve/reject).
- **Repayment Calculation**: Automatically calculates a repayment schedule for approved loans.

## 🛠️ Tech Stack

- **Framework**: Express.js
- **Language**: Node.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JSON Web Tokens (JWT)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18.x or higher recommended)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/try/download/community)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://[your-git-repository-url]/FinGrow.git
cd FinGrow/Backend
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Set up Environment Variables

Create a `.env` file in the `Backend` directory and add the necessary environment variables. See `.env.example` for a template.

```env
# .env
PORT=5000
MONGO_URI=[Your MongoDB connection string]
JWT_SECRET=[Your JWT secret]
```

### 4. Run the server

To start the development server with auto-reloading (thanks to nodemon):

```bash
npm run dev
```

The server will be running on `http://localhost:5000`.

## 🔗 API Endpoints

Here are the main API endpoints available for loan management:

| Method | Endpoint                 | Access  | Description                                      |
|--------|--------------------------|---------|--------------------------------------------------|
| `POST` | `/api/loans`             | Private | Creates a new loan application for the logged-in user. |
| `GET`  | `/api/loans/myloans`     | Private | Retrieves all loans for the logged-in user.      |
| `GET`  | `/api/loans`             | Admin   | Retrieves all loans (with optional status filter). |
| `GET`  | `/api/loans/:id`         | Private | Retrieves a specific loan by its ID.             |
| `PUT`  | `/api/loans/:id/status`  | Admin   | Updates a loan's status to 'approved' or 'rejected'. |

> Note: Authentication endpoints like `/api/auth/login` and `/api/auth/register` are also available.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a pull request.
