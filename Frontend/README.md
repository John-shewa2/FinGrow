# FinGrow Frontend

This is the frontend for the FinGrow application, built with React and Vite.

FinGrow is a web application designed to streamline the personal loan process. It provides a platform for users to apply for loans and track their status, and for administrators to manage and approve applications.

## ✨ Features

- **User Authentication**: Secure login and registration for both borrowers and administrators.
- **Loan Application**: Borrowers can easily apply for new loans by specifying the desired amount and repayment term.
- **Borrower Dashboard**: Borrowers can view a list of their loans, check their status (pending, approved, rejected), and see detailed repayment schedules for approved loans.
- **Admin Dashboard**: Administrators have a comprehensive view of all loan applications. They can filter loans by status and have the authority to approve or reject them.

## 🛠️ Tech Stack

- **Framework**: [React](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [e.g., CSS Modules, Styled-Components, Tailwind CSS]
- **State Management**: [e.g., Redux, Context API]
- **API Communication**: [e.g., Axios, Fetch API]

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18.x or higher recommended)
- npm or Yarn

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://[your-git-repository-url]/FinGrow.git
cd FinGrow/Frontend
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Set up Environment Variables

Create a `.env.local` file in the `Frontend` directory and add the necessary environment variables. For Vite, environment variables exposed to the client should be prefixed with `VITE_`.

```env
# .env.local
VITE_API_URL=http://localhost:5000/api
```

### 4. Run the application

To start the development server:

```bash
npm run dev
```

The application will be running on `http://localhost:5173` (or another port specified by Vite).

## 📁 Project Structure (Example)

A typical structure for a React + Vite application:
```
/src
|-- /api         # Functions for making API requests
|-- /components  # Reusable UI components
|-- /hooks       # Custom React hooks
|-- /pages       # Page-level components
|-- /store       # State management (e.g., Redux, Zustand)
|-- /styles      # Global styles and assets
|-- App.jsx      # Main application component
|-- main.jsx     # Application entry point
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a pull request.