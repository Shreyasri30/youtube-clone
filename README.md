
---

# 📺 YouTube Clone – MERN Stack

A full-stack YouTube-like video streaming platform built using the **MERN stack** (MongoDB, Express, React, Node).
This project implements **video upload, playback, like/dislike, comments, channel creation, search, subscribe system**, and full responsive UI inspired by YouTube.

---
Demo video link: https://drive.google.com/file/d/1ce_H3wpArb9oAWmE5vyssLabOVIeDfWt/view?usp=sharing
Github link: https://github.com/Shreyasri30/youtube-clone

---

## 🚀 Features Overview

### 🔐 Authentication

* User registration & login
* JWT-based authentication
* Global auth context (React Context API)
* Logout dropdown menu in header

---

### 🎥 Video Features

* Upload videos with category, title, description, thumbnail URL & video URL
* Auto-formatted thumbnails
* Video player page
* Like / dislike fully functional
* View count display
* Recommended videos sidebar (auto-populated)
* Share (Web Share API / clipboard fallback)
* Download (simulated button)

---

### 💬 Comments System

* Add comments
* Edit comments
* Delete comments
* 3-dot menu per comment (YouTube-like)
* Live updates after each CRUD operation

---

### 📺 Channel System

* Create channel (one per user)
* View channel with:

  * Channel banner
  * Channel avatar
  * Videos uploaded by channel
  * Filter by categories
* Edit video
* Delete video
* Channel stats displayed (views)

---

### 🔍 Global Search

* Search bar in header works on **every page**
* Redirects to `/search?q=query`
* Dedicated **Search Results Page** showing matched videos
* Search by title, description, category, or channel name

---

### 🧭 Sidebar Navigation (YouTube-like)

* Collapsible sidebar
* Home
* Subscriptions (static)
* Trending (static)
* “You” page (account area)
* Login/Logout actions

---

### 🙋‍♀️ “You” Page (Account Area)

* User avatar & basic details
* View Channel button
* Dummy watch-history cards

---

### 📱 Responsive Design

* Fully responsive with:

  * Mobile header stacking
  * Sidebar slide-in on mobile
  * Video player + recommended stacked on small screens
  * Dynamic grid layout (auto-fill columns)

---

## 🏗️ Tech Stack

### **Frontend**

* React (Vite)
* React Router v6
* Axios
* Context API for auth
* Custom CSS (YouTube-style responsive UI)

### **Backend**

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT Authentication


### **Database**
Using MongoDB Atlas for database

---

## 📁 Folder Structure

```
youtube-clone/
│── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── db.js
│   ├── server.js
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── App.jsx
    │   ├── App.css
    │   ├── index.css
    │   ├── api.js
    │   └── main.jsx
    └── package.json
```

---

## 🗄️ Environment Variables (Backend)

Create `.env` in backend folder:

```
PORT=5000
MONGO_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-jwt-secret

(For the credentials of this project db, refer to .env file in backend)

```

---

## 🔌 API Endpoints

### **Auth Routes**

| Method | Route              | Description       |
| ------ | ------------------ | ----------------- |
| POST   | /api/auth/register | Register user     |
| POST   | /api/auth/login    | Login & get token |

---

### **Video Routes**

| Method | Route                   | Description             |
| ------ | ----------------------- | ----------------------- |
| GET    | /api/videos             | Get all videos          |
| GET    | /api/videos/:id         | Get single video        |
| POST   | /api/videos             | Upload video            |
| PUT    | /api/videos/:id         | Update video            |
| DELETE | /api/videos/:id         | Delete video            |
| PUT    | /api/videos/:id/like    | Like/unlike video       |
| PUT    | /api/videos/:id/dislike | Dislike/undislike video |

---

### **Comment Routes**

| Method | Route                    | Description    |
| ------ | ------------------------ | -------------- |
| GET    | /api/comments/:videoId   | Get comments   |
| POST   | /api/comments/:videoId   | Add comment    |
| PUT    | /api/comments/update/:id | Edit comment   |
| DELETE | /api/comments/delete/:id | Delete comment |

---

### **Channel Routes**

| Method | Route                       | Description           |
| ------ | --------------------------- | --------------------- |
| POST   | /api/channels               | Create channel        |
| GET    | /api/channels/:id           | View channel          |
| POST   | /api/channels/:id/subscribe | Subscribe/unsubscribe |

---

### **Search Route**

| Method | Route                      | Description   |
| ------ | -------------------------- | ------------- |
| GET    | /api/videos/search?query=_ | Search videos |

---

## ▶️ Running the Project

### 1️⃣ Install dependencies

#### Backend:

```
cd backend
npm install
```

#### Frontend:

```
cd frontend
npm install
```

---

### 2️⃣ Start Backend

```
cd backend
npm start
```

---

### 3️⃣ Start Frontend

```
cd frontend
npm run dev
```

The project runs at:

```
Frontend: http://localhost:5173
Backend:  http://localhost:5000
```

---

## 🏆 Final Notes

This YouTube Clone implements all the mandatory features defined in the capstone PDF, plus additional UI improvements and real functionality for a professional submission.