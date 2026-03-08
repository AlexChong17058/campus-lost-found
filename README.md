# Campus Lost & Found

A web-based Campus Lost & Found system built for the Web Technology project. The system allows users to register, log in, submit lost or found item reports, browse reports, filter items, update item status, and manage their own reports.

## Features

- User registration and login
- JWT-based authentication
- Submit lost item reports
- Submit found item reports
- View all item reports
- Filter reports by category and status
- View item details in a modal
- Update item status
- Delete own reports
- Protected dashboard for authenticated users

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- HTML
- CSS
- JavaScript

## Project Structure

```text
campus-lost-found/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── itemController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── optionalAuth.js
│   │   ├── validation.js
│   │   ├── errorHandler.js
│   │   └── notFound.js
│   ├── models/
│   │   ├── User.js
│   │   └── Item.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── itemRoutes.js
│   └── public/
│       ├── auth/
│       ├── css/
│       ├── js/
│       └── index.html
├── server.js
├── package.json
├── package-lock.json
├── .env.example
└── README.md