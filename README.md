# AI-Powered DevSecOps

### A Secure CI/CD Pipeline with Cloud Security Monitoring

## 📌 Project Overview

AI-Powered DevSecOps is a web-based security management project that integrates pipeline management, vulnerability tracking, security scoring, rule-based AI security analysis, service monitoring, and PDF report generation into one platform.

The main objective is to provide a centralized dashboard for monitoring application security and managing security-related activities.

## ✨ Features

- User Registration and Login
- Password Hashing using bcryptjs
- JWT Authentication
- Dashboard with Security Score
- CI/CD Pipeline Management
- Vulnerability Management
- Security Score Calculation
- Rule-Based AI Security Analysis
- Service and Cloud Monitoring Dashboard
- PDF Security Report Generation
- MongoDB Database Integration
- Git and GitHub Version Control

## 🛠️ Technologies Used

### Frontend

- HTML5
- CSS3
- JavaScript

### Backend

- Node.js
- Express.js
- REST APIs

### Database

- MongoDB
- Mongoose

### Security and Other Libraries

- JSON Web Token (JWT)
- bcryptjs
- dotenv
- CORS
- PDFKit

## 📂 Project Structure

```text
DevSecOps/
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── Dashboard.html
│   ├── pipelines.html
│   ├── vulnerabilities.html
│   ├── ai-analysis.html
│   ├── monitoring.html
│   ├── reports.html
│   ├── settings.html
│   ├── css/
│   └── js/
│
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   └── .gitignore
│
├── akash_sudo/
├── README.md
└── .gitignore
```

## ⚙️ Requirements

Install or configure the following before running the project:

- Node.js and npm
- MongoDB Community Server
- Visual Studio Code
- Live Server extension for VS Code

## 🚀 How to Run the Project

### Step 1: Clone the Repository

```bash
git clone https://github.com/devesh1705hemu/college_project_Ai_DevSecops.git
cd college_project_Ai_DevSecops
```

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 3: Configure Environment Variables

Create a `.env` file inside the `backend` folder.

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/devsecops
JWT_SECRET=replace_with_your_own_secret
```

Use your own secret value for `JWT_SECRET`. Do not upload the `.env` file to GitHub.

### Step 4: Start MongoDB

Ensure that the MongoDB service is running on your computer.

### Step 5: Start the Backend

From the `backend` directory, run:

```bash
node server.js
```

The backend will run at:

```text
http://localhost:5000
```

### Step 6: Start the Frontend

1. Open the project in VS Code.
2. Open the `frontend` folder.
3. Right-click `frontend/index.html`.
4. Select **Open with Live Server**.
5. Register an account and log in to access the dashboard.

Keep the backend server running while using the frontend.

## 🔐 Security Features

- Passwords are hashed before being stored.
- JWT tokens are used for authentication.
- Protected API routes verify authentication tokens.
- Environment variables store configuration and secrets.
- `.gitignore` excludes `.env` and `node_modules` from Git tracking.

## 🔄 Project Workflow

```text
User Registration
        ↓
User Login
        ↓
JWT Authentication
        ↓
Dashboard
        ↓
Pipeline Management
        ↓
Vulnerability Management
        ↓
Security Score
        ↓
AI Security Analysis
        ↓
Service Monitoring
        ↓
PDF Security Report
```

## 📊 Security Score

The security score starts at 100 and decreases according to open vulnerabilities:

| Severity | Score Deduction |
| -------- | --------------: |
| Critical |              25 |
| High     |              15 |
| Medium   |              10 |
| Low      |               5 |

The final score cannot be lower than zero.

## 🤖 AI Security Analysis

The current analysis module uses rule-based logic to evaluate vulnerability severity and provide risk information, potential impact, and security recommendations.

## 🔧 Current Project Scope

The pipeline module simulates CI/CD stages and their statuses. It is a project demonstration and is not connected to a complete production CI/CD execution engine.

## 👨‍💻 Author

**Akash Bind**

## 📄 License

This project is intended for educational and demonstration purposes.
