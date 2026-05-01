# 📝 Task Manager — Full Stack Web Application

> **Login system + Task CRUD + Role-based access + Secure APIs**

---

## 🧭 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Features](#features)
- [App Flow](#app-flow)
- [API Endpoints](#api-endpoints)
- [Role-Based Access Control](#role-based-access-control)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Database Models](#database-models)
- [Security](#security)

---

## 📌 Project Overview

Task Manager is a full-stack web application where users can register, log in, and manage their personal tasks. Admins have elevated privileges to view and manage all users' tasks across the platform. The app uses JWT-based authentication and role-based access control to keep data secure and isolated.

---

## 🛠️ Tech Stack

| Layer       | Technology                     |
|-------------|-------------------------------|
| Backend     | Node.js + Express              |
| Database    | MongoDB (via Mongoose)         |
| Auth        | JWT (JSON Web Tokens) + bcrypt |
| Frontend    | React (functional components)  |
| Styling     | CSS / TailwindCSS (optional)   |

---

## 📁 Folder Structure

```
task-manager/
│
├── backend/
│   ├── controllers/
│   │   ├── authController.js       # Register & Login logic
│   │   └── taskController.js       # CRUD operations for tasks
│   │
│   ├── models/
│   │   ├── User.js                 # User schema (name, email, password, role)
│   │   └── Task.js                 # Task schema (title, description, status, owner)
│   │
│   ├── routes/
│   │   ├── authRoutes.js           # POST /api/auth/register, /api/auth/login
│   │   └── taskRoutes.js           # CRUD routes for tasks
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js       # Verify JWT token
│   │   └── roleMiddleware.js       # Check admin role
│   │
│   ├── config/
│   │   └── db.js                   # MongoDB connection setup
│   │
│   ├── utils/
│   │   └── generateToken.js        # JWT token generator
│   │
│   ├── app.js                      # Express app setup, routes registration
│   ├── server.js                   # Server entry point (starts listening)
│   └── .env                        # Environment variables (never commit this)
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── LoginPage.jsx        # First page — Login form
    │   │   ├── RegisterPage.jsx     # Register form
    │   │   └── Dashboard.jsx        # Main dashboard after login
    │   │
    │   ├── components/
    │   │   ├── TaskCard.jsx         # Individual task display
    │   │   ├── TaskForm.jsx         # Create / Edit task form
    │   │   ├── Navbar.jsx           # Navigation bar
    │   │   └── AdminPanel.jsx       # Admin-only: all users' tasks
    │   │
    │   ├── context/
    │   │   └── AuthContext.jsx      # Global auth state (user, token, role)
    │   │
    │   ├── api/
    │   │   └── axiosInstance.js     # Axios setup with base URL + auth header
    │   │
    │   ├── App.jsx                  # Routes: / → Login, /dashboard, /admin
    │   └── main.jsx                 # React entry point
    │
    └── package.json
```

---

## ✨ Features

### 👤 User Features
- Register a new account (name, email, password)
- Login with email and password → receive JWT token
- View only their own tasks on the Dashboard
- Create a new task (title, description, status)
- Edit / update an existing task
- Delete their own tasks

### 🛡️ Admin Features
- Login with admin credentials
- View **all** tasks from **all** users on the Admin Panel
- Delete **any** task in the system
- (Optionally) view a list of all registered users

---

## 🔄 App Flow

```
[Browser opens]
       │
       ▼
 ┌─────────────┐
 │ Login Page  │  ◄── Default first page (/)
 │  or         │
 │ Register    │
 └──────┬──────┘
        │  Submit credentials
        ▼
  ┌───────────┐
  │  Backend  │  Validates user → returns JWT token
  └──────┬────┘
         │  Token stored in localStorage
         ▼
  ┌─────────────────────────────┐
  │         Dashboard           │
  │  ┌─────────────────────┐   │
  │  │  User sees OWN tasks │   │  role = "user"
  │  │  Create / Edit /     │   │
  │  │  Delete own tasks    │   │
  │  └─────────────────────┘   │
  │                             │
  │  ┌─────────────────────┐   │
  │  │   Admin Panel       │   │  role = "admin"
  │  │   ALL users' tasks  │   │
  │  │   Delete any task   │   │
  │  └─────────────────────┘   │
  └─────────────────────────────┘
```

---

## 🔗 API Endpoints

### Auth Routes — `/api/auth`

| Method | Endpoint    | Description              | Auth Required |
|--------|-------------|--------------------------|---------------|
| POST   | `/register` | Register a new user      | ❌ No         |
| POST   | `/login`    | Login & receive JWT      | ❌ No         |

### Task Routes — `/api/tasks`

| Method | Endpoint    | Description                        | Auth Required | Role      |
|--------|-------------|------------------------------------|---------------|-----------|
| GET    | `/`         | Get all tasks (own tasks for user) | ✅ Yes        | User      |
| POST   | `/`         | Create a new task                  | ✅ Yes        | User      |
| PUT    | `/:id`      | Update a task by ID                | ✅ Yes        | Owner     |
| DELETE | `/:id`      | Delete a task by ID                | ✅ Yes        | Owner     |
| GET    | `/all`      | Get ALL users' tasks               | ✅ Yes        | Admin     |
| DELETE | `/all/:id`  | Delete any task                    | ✅ Yes        | Admin     |

---

## 🔐 Role-Based Access Control

```
Roles:
  "user"   → Can only see and manage their own tasks
  "admin"  → Can see and manage ALL tasks across all users

How it works:
  1. On register, role defaults to "user"
  2. Admin accounts are seeded manually or assigned in the DB
  3. JWT payload includes { id, role }
  4. authMiddleware.js verifies the token on every protected route
  5. roleMiddleware.js checks req.user.role === "admin" for admin routes
```

---

## ⚙️ Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_super_secret_key_here
```

## 🚀 Deployment

### Option 1: Deploy as one service
1. Build the frontend:
   - `cd frontend && npm install && npm run build`
2. Start the backend:
   - `cd backend && npm install && npm start`

The backend now serves the website from `frontend/dist`, and API calls use the same origin at `/api`.

### Option 2: Deploy backend and frontend separately
- Backend host (Render, Heroku, Railway, Azure): deploy `backend/` and set these environment variables:
  - `MONGO_URI`
  - `JWT_SECRET`
  - `NODE_ENV=production`
  - `PORT` (if required by platform)
- Frontend host (Netlify, Vercel, Cloudflare Pages): build the app with `npm run build` and deploy the `frontend/dist` folder.
- Set `VITE_API_URL` in frontend hosting if the backend is on a different domain.

### Recommended production setup
- Use `NODE_ENV=production`
- Keep `MONGO_URI` and `JWT_SECRET` secret in your hosting environment
- If deploying the full app together, use the backend service as the primary host and serve static files from `frontend/dist`

### Useful commands
```bash
cd backend
npm install
npm start
```

If you want to deploy to a platform like Render or Heroku, connect your repo to the platform and point it at the `backend/` folder as the service root. The backend will then build the frontend automatically during install.
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

> ⚠️ **Never commit `.env` to version control. Add it to `.gitignore`.**

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB running locally or a MongoDB Atlas URI
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
# Create your .env file (see above)
npm run dev      # Uses nodemon for hot reload
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev      # Vite or CRA dev server
```

### Default Ports

| Service   | Port   |
|-----------|--------|
| Backend   | `5000` |
| Frontend  | `5173` (Vite) or `3000` (CRA) |
| MongoDB   | `27017` |

---

## 🗃️ Database Models

### User Model (`models/User.js`)

```js
{
  name:      String   (required),
  email:     String   (required, unique),
  password:  String   (hashed with bcrypt),
  role:      String   (enum: ["user", "admin"], default: "user"),
  createdAt: Date     (auto)
}
```

### Task Model (`models/Task.js`)

```js
{
  title:       String   (required),
  description: String,
  status:      String   (enum: ["pending", "in-progress", "completed"], default: "pending"),
  owner:       ObjectId (ref: "User", required),
  createdAt:   Date     (auto),
  updatedAt:   Date     (auto)
}
```

---

## 🔒 Security

- Passwords hashed with **bcrypt** (salt rounds: 10) before storing in DB
- Authentication via **JWT** — token expires in 7 days by default
- Protected routes verified by `authMiddleware.js` on every request
- Admin-only routes additionally checked by `roleMiddleware.js`
- Users can only access/modify tasks where `task.owner === req.user.id`
- Environment secrets stored in `.env` — never hardcoded

---

## 📋 Scripts

### Backend `package.json` scripts

```json
{
  "scripts": {
    "start": "node server.js",
    "dev":   "nodemon server.js"
  }
}
```

### Frontend `package.json` scripts

```json
{
  "scripts": {
    "dev":   "vite",
    "build": "vite build",
    "start": "vite preview"
  }
}
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "Add my feature"`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

> Built with ❤️ using Node.js, Express, MongoDB, and React.
