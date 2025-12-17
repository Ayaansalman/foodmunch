# 🍕 FoodMunch - Food Delivery Platform

A full-stack food delivery application built with **MERN Stack** (MongoDB, Express.js, React, Node.js) featuring **real-time order tracking**, **microservices architecture**, and a modern dark-themed UI.

![Tech Stack](https://img.shields.io/badge/Stack-MERN-green)
![Real-time](https://img.shields.io/badge/Real--time-Socket.io-blue)
![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas-brightgreen)

---

## 🌟 Features

### Customer Features
- 🔐 User authentication (Register/Login)
- 🍽️ Browse menu with category filters
- 🛒 Add to cart with quantity controls
- 📦 Place orders with delivery details
- 📍 **Real-time order tracking** via Socket.io
- 📜 Order history

### Admin Features
- 📊 Dashboard with statistics
- 📦 Real-time order management
- ➕ Add/Edit/Delete menu items
- 🔄 Update order status (instant customer notification)

---

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Customer App   │     │   Admin Panel   │     │  Backend API    │
│   (React)       │     │   (React)       │     │  (Express +     │
│   Port: 5173    │     │   Port: 5174    │     │   Socket.io)    │
└────────┬────────┘     └────────┬────────┘     │   Port: 4000    │
         │                       │              └────────┬────────┘
         └───────────────┬───────┘                       │
                         │                               │
                    REST API + WebSocket                 │
                                                         ▼
                                                ┌─────────────────┐
                                                │  MongoDB Atlas  │
                                                └─────────────────┘
```

### Microservices

| Service | Responsibility |
|---------|---------------|
| **Auth Service** | JWT authentication, user management |
| **Food Service** | Menu CRUD operations |
| **Cart Service** | Shopping cart management |
| **Order Service** | Order processing + real-time updates |

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, Vite, React Router, Axios, Socket.io-client |
| **Backend** | Node.js, Express.js, Socket.io, Mongoose |
| **Database** | MongoDB Atlas |
| **Auth** | JWT, bcryptjs |
| **Validation** | Joi |
| **Styling** | CSS3, CSS Variables, Flexbox, Grid |

---

## 📁 Project Structure

```
foodmunch/
├── backend/
│   ├── server.js           # Express + Socket.io server
│   ├── config/db.js        # MongoDB connection
│   ├── models/             # Mongoose schemas
│   ├── services/           # Business logic (microservices)
│   ├── routes/             # API endpoints
│   ├── middleware/         # Auth, validation, errors
│   └── socket/             # Socket.io handlers
├── frontend/
│   ├── src/
│   │   ├── context/        # Auth, Cart, Socket providers
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route pages
│   │   └── services/       # API client
└── admin/
    └── src/                # Admin panel (same structure)
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/foodmunch.git
cd foodmunch
```

2. **Setup Backend**
```bash
cd backend
npm install

# Create .env file
echo "PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key" > .env

# Seed database with admin user and sample data
node seed.js

# Start server
npm run dev
```

3. **Setup Frontend**
```bash
cd ../frontend
npm install
npm run dev
```

4. **Setup Admin Panel**
```bash
cd ../admin
npm install
npm run dev
```

### Test Accounts

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@foodmunch.com | admin123 |
| **Customer** | test@123.com | 12345678 |

---

## 📡 API Endpoints

### Authentication
```
POST /api/auth/register    - Create account
POST /api/auth/login       - Login
GET  /api/auth/profile     - Get profile (Auth required)
```

### Food
```
GET    /api/food/list      - Get all foods
GET    /api/food/:id       - Get single food
POST   /api/food/add       - Add food (Admin)
DELETE /api/food/:id       - Delete food (Admin)
```

### Cart
```
GET    /api/cart           - Get cart
POST   /api/cart/add       - Add to cart
POST   /api/cart/remove    - Remove item
DELETE /api/cart           - Clear cart
```

### Orders
```
POST /api/order/create         - Create order
GET  /api/order/my-orders      - Get user orders
GET  /api/order/admin/all      - All orders (Admin)
PUT  /api/order/admin/:id/status - Update status (Admin)
```

---

## 🔌 Real-time Events (Socket.io)

| Event | Description |
|-------|-------------|
| `joinUserRoom` | Customer subscribes to their updates |
| `joinAdminRoom` | Admin subscribes to all orders |
| `newOrderReceived` | New order notification to admin |
| `myOrderUpdate` | Order status update to customer |

---

## 🎨 Screenshots

| Customer App | Admin Panel |
|--------------|-------------|
| Modern dark theme | Real-time dashboard |
| Food browsing | Order management |
| Cart & Checkout | Menu CRUD |

---

## 📝 Environment Variables

```env
# Backend (.env)
PORT=4000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret
```

---

## 🐳 Docker Deployment

```bash
docker-compose up -d
```

---

## 👨‍💻 Author

**Your Name**
- Course: Complex Computing Problems
- University: COMSATS University Islamabad

---

## 📄 License

This project is for educational purposes.
