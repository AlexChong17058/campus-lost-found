# Campus Lost & Found

A web-based Campus Lost & Found management system developed using **Node.js, Express, MongoDB, HTML, CSS, and JavaScript**.  
This system allows users to report lost or found items, browse existing reports, and manage their own reports in a secure and centralized platform.

---

## Live Application

Live website:  
https://campus-lost-found-ye93.onrender.com

---

## GitHub Repository

Repository link:  
https://github.com/AlexChong17058/campus-lost-found

---

## Features

### Authentication
- User registration
- User login
- JWT-based authentication
- Protected routes

### Item Management
- Report lost items
- Report found items
- View all items
- View item details
- Update item status (Active, Claimed, Resolved)
- Delete own reports

### Filtering
- Filter by category (Lost / Found)
- Filter by item status
- View personal reports (My Reports)

### Dashboard
- Statistics overview:
  - Total items
  - Active items
  - Claimed items
  - Resolved items

---

## Technology Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

### Frontend
- HTML
- CSS
- JavaScript (Vanilla JS)

### Deployment
- Render (Node.js hosting)
- MongoDB Atlas (Cloud database)

---

## Project Structure

```
campus-lost-found
│
├── src
│   ├── config
│   │   └── db.js
│   │
│   ├── controllers
│   │   ├── authController.js
│   │   └── itemController.js
│   │
│   ├── middleware
│   │   ├── auth.js
│   │   ├── optionalAuth.js
│   │   ├── validation.js
│   │   ├── errorHandler.js
│   │   └── notFound.js
│   │
│   ├── models
│   │   ├── User.js
│   │   └── Item.js
│   │
│   ├── routes
│   │   ├── authRoutes.js
│   │   └── itemRoutes.js
│   │
│   └── public
│       ├── auth
│       │   ├── login.html
│       │   ├── register.html
│       │   └── forgot-password.html
│       │
│       ├── css
│       │   └── style.css
│       │
│       ├── js
│       │   └── app.js
│       │
│       └── index.html
│
├── server.js
├── package.json
├── package-lock.json
├── .env.example
└── README.md
```

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/AlexChong17058/campus-lost-found.git
cd campus-lost-found
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment file

Create a `.env` file based on `.env.example`.

Example:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development
```

### 4. Start the server

```
npm start
```

For development with nodemon:

```
npm run dev
```

---

## Environment Variables

Example `.env.example`

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

---

## Security Features

The system implements several security practices:

- Password hashing
- JWT authentication
- Protected API routes
- Server-side validation
- Input sanitization
- Environment variables for sensitive data
- Centralized error handling middleware

---

## Performance Optimization

- Lightweight frontend structure
- Modular backend architecture
- Efficient database queries
- Lighthouse performance testing

---

## Deployment

The application is deployed using **Render**.

Live URL:

https://campus-lost-found-ye93.onrender.com

Backend and frontend are served from the same Node.js application.

Database hosted on **MongoDB Atlas**.

---

## Testing Checklist

Before submission, the following functionalities were verified:

- User registration
- User login
- Create lost item report
- Create found item report
- View all items
- Filter items
- View item details
- Update item status
- Delete report
- Logout and session protection

---

## Author

Chong Yong Shen
QIU-202507-008512  
Web Technology Project

---

## License

This project is developed for academic purposes only.