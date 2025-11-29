# 📝 MERN Notes Manager

A full-stack secure application to manage personal notes. Built with MongoDB, Express, React, and Node.js.

![MERN Stack](https://img.shields.io/badge/MERN-Stack-green)
![Status](https://img.shields.io/badge/Status-Completed-success)
![License](https://img.shields.io/badge/License-MIT-blue)

## 🚀 Overview

This project is a Full Stack MVP (Minimum Viable Product) designed to demonstrate:
* **Authentication:** Secure Login and Signup using **JWT (JSON Web Tokens)**.
* **Database Management:** NoSQL schema modeling with **MongoDB** & **Mongoose**.
* **REST API:** Custom backend endpoints for CRUD operations.
* **Frontend State:** React Hooks (`useState`, `useEffect`) and Context.

---

## 🛠️ Tech Stack

* **Frontend:** React (Vite), Axios, CSS modules.
* **Backend:** Node.js, Express.js.
* **Database:** MongoDB Atlas (Cloud).
* **Authentication:** JWT, BcryptJS.

---

## ⚙️ Features

* ✅ **User Authentication** (Sign Up & Login with secure password hashing).
* ✅ **Create Notes** (Add titles and content).
* ✅ **Read Notes** (View all notes specific to the logged-in user).
* ✅ **Update Notes** (Edit existing notes).
* ✅ **Delete Notes** (Remove unwanted notes).
* ✅ **Session Persistence** (Users stay logged in on refresh).

---

## 🔧 Installation & Setup

Follow these steps to run the project locally.

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/notes-manager.git
cd notes-manager
```

### 2. Backend Setup

Navigate to the server folder and install dependencies:

```bash
cd server
npm install
```

Create a `.env` file in the `server` folder and add your credentials:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
```

Start the Server:

```bash
node index.js
```

*(You should see "MongoDB Connected" in the terminal)*

### 3. Frontend Setup

Open a new terminal, navigate to the client folder, and install dependencies:

```bash
cd ../client
npm install
```

Start the React App:

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

-----

## 📡 API Endpoints

| Method | Endpoint | Description | Auth Required |
| :----- | :------- | :----------- | :------------- |
| `POST` | `/register` | Create a new user | No |
| `POST` | `/login` | Login and get Token | No |
| `GET` | `/notes` | Get all notes for user | Yes (Header) |
| `POST` | `/notes` | Create a new note | Yes (Header) |
| `PUT` | `/notes/:id` | Update a specific note | Yes (Header) |
| `DELETE` | `/notes/:id` | Delete a specific note | Yes (Header) |

-----

## 📸 Screenshots

*(Optional: Add screenshots of your app here)*

-----

## 🤝 Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a Pull Request.

-----

### How to add Screenshots (Bonus Tip)

If you want to make the repo look amazing:
1. Take a screenshot of your Login page and your Dashboard.
2. Save them as `login.png` and `dashboard.png`.
3. Upload them to your GitHub repo.
4. Replace the line under **Screenshots** with:

```markdown
![Login Screen](./login.png)
![Dashboard](./dashboard.png)
```
