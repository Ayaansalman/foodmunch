# FoodMunch - Distributed E-Commerce Platform with Real-Time Services

## Technical Documentation Report

---

### Project Information
| Field | Details |
|-------|---------|
| **Project Title** | FoodMunch - Food Delivery Platform |
| **Technology Stack** | MERN (MongoDB, Express.js, React, Node.js) |
| **Real-time Technology** | Socket.io |
| **Architecture** | Microservices-based |
| **Course** | Complex Computing Problems |

---

## Table of Contents
1. [Executive Summary](#1-executive-summary)
2. [System Architecture](#2-system-architecture)
3. [Microservices Design](#3-microservices-design)
4. [Backend Implementation](#4-backend-implementation)
5. [Frontend Implementation](#5-frontend-implementation)
6. [Real-time Features](#6-real-time-features)
7. [Security Implementation](#7-security-implementation)
8. [Database Design](#8-database-design)
9. [API Documentation](#9-api-documentation)
10. [Deployment Guide](#10-deployment-guide)
11. [Complexity Analysis](#11-complexity-analysis)
12. [Conclusion](#12-conclusion)

---

## 1. Executive Summary

FoodMunch is a full-stack food delivery platform built using modern web technologies and microservices architecture. The platform enables customers to browse menus, place orders, and track deliveries in real-time, while providing administrators with comprehensive order management capabilities.

### Key Features
- **Customer Portal**: Browse menu, add to cart, checkout, real-time order tracking
- **Admin Dashboard**: Order management, menu CRUD, statistics dashboard
- **Real-time Updates**: Socket.io for live order status notifications
- **Secure Authentication**: JWT-based authentication with role-based access control

### Technology Highlights
- Node.js + Express.js backend with microservices pattern
- React + Vite frontend with modern UI/UX
- MongoDB Atlas for cloud database
- Socket.io for real-time bidirectional communication

---

## 2. System Architecture

### 2.1 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                               │
├─────────────────────────────────┬───────────────────────────────────┤
│     Customer App (React)        │       Admin Panel (React)         │
│     Port: 5173                  │       Port: 5174                  │
│     - Home, Menu, Cart          │       - Dashboard, Orders         │
│     - Checkout, Orders          │       - Menu Management           │
└─────────────────────────────────┴───────────────────────────────────┘
                          │                       │
                          │  HTTP/REST + WebSocket│
                          ▼                       ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         API GATEWAY LAYER                            │
│                    Express.js Server (Port: 4000)                   │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐│
│  │   Routes    │  │ Middleware  │  │  Socket.io  │  │   Static    ││
│  │   Layer     │  │   Layer     │  │   Server    │  │   Files     ││
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘│
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       MICROSERVICES LAYER                            │
├────────────────┬───────────────┬───────────────┬────────────────────┤
│  Auth Service  │ Food Service  │ Cart Service  │   Order Service   │
│  - Register    │ - CRUD Ops    │ - Add/Remove  │   - Create Order  │
│  - Login       │ - Categories  │ - Update Qty  │   - Track Status  │
│  - JWT Tokens  │ - Availability│ - Clear Cart  │   - Real-time     │
└────────────────┴───────────────┴───────────────┴────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        DATABASE LAYER                                │
│                        MongoDB Atlas                                 │
├────────────────┬───────────────┬───────────────┬────────────────────┤
│    Users       │     Foods     │     Carts     │      Orders        │
│  Collection    │  Collection   │  Collection   │    Collection      │
└────────────────┴───────────────┴───────────────┴────────────────────┘
```

### 2.2 Component Interaction Flow

```
Customer Action          Backend Processing           Real-time Update
     │                         │                           │
     ▼                         ▼                           ▼
┌──────────┐  HTTP POST  ┌──────────┐  MongoDB     ┌──────────────┐
│ Place    │ ──────────► │ Order    │ ───────►     │ Save Order   │
│ Order    │             │ Service  │              │ to Database  │
└──────────┘             └──────────┘              └──────────────┘
                              │                           │
                              │ Socket.io Emit            │
                              ▼                           │
                        ┌──────────────┐                  │
                        │ Notify Admin │ ◄────────────────┘
                        │ New Order!   │
                        └──────────────┘
                              │
                              ▼
                        ┌──────────────┐
                        │ Admin Panel  │
                        │ Updates Live │
                        └──────────────┘
```

---

## 3. Microservices Design

### 3.1 Service Breakdown

| Service | Responsibility | Endpoints |
|---------|---------------|-----------|
| **Auth Service** | User authentication, JWT tokens, profile management | `/api/auth/*` |
| **Food Service** | Menu management, CRUD operations, categories | `/api/food/*` |
| **Cart Service** | Shopping cart operations, quantity management | `/api/cart/*` |
| **Order Service** | Order processing, payment, real-time tracking | `/api/order/*` |

### 3.2 Service Communication Pattern

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────►│   Express   │────►│   Service   │
│   Request   │     │   Router    │     │   Layer     │
└─────────────┘     └─────────────┘     └─────────────┘
                          │                    │
                          ▼                    ▼
                    ┌─────────────┐     ┌─────────────┐
                    │ Middleware  │     │  Mongoose   │
                    │ (Auth/Valid)│     │   Models    │
                    └─────────────┘     └─────────────┘
```

---

## 4. Backend Implementation

### 4.1 Directory Structure

```
backend/
├── server.js              # Entry point with Express + Socket.io
├── config/
│   └── db.js             # MongoDB connection configuration
├── models/
│   ├── User.js           # User schema (customers + admins)
│   ├── Food.js           # Food items schema
│   ├── Cart.js           # Shopping cart schema
│   └── Order.js          # Orders schema
├── services/
│   ├── authService.js    # Authentication business logic
│   ├── foodService.js    # Food CRUD operations
│   ├── cartService.js    # Cart management
│   └── orderService.js   # Order processing + real-time
├── routes/
│   ├── authRoutes.js     # /api/auth/* endpoints
│   ├── foodRoutes.js     # /api/food/* endpoints
│   ├── cartRoutes.js     # /api/cart/* endpoints
│   └── orderRoutes.js    # /api/order/* endpoints
├── middleware/
│   ├── auth.js           # JWT verification + RBAC
│   ├── errorHandler.js   # Global error handling
│   └── validation.js     # Joi request validation
├── socket/
│   └── socketHandler.js  # Socket.io event handlers
└── uploads/              # Food images directory
```

### 4.2 Key Technologies

| Technology | Purpose |
|------------|---------|
| Express.js | Web framework for REST API |
| Socket.io | Real-time bidirectional communication |
| Mongoose | MongoDB ODM for data modeling |
| JWT (jsonwebtoken) | Token-based authentication |
| bcryptjs | Password hashing |
| Joi | Request validation |
| Multer | File upload handling |
| CORS | Cross-origin resource sharing |

### 4.3 Authentication Flow

```
1. User submits credentials
          │
          ▼
2. Server validates with bcrypt
          │
          ▼
3. Server generates JWT token
   jwt.sign({ id, role }, secret)
          │
          ▼
4. Token sent to client
   { token: "eyJhbG..." }
          │
          ▼
5. Client stores in localStorage
          │
          ▼
6. Subsequent requests include:
   Authorization: Bearer <token>
          │
          ▼
7. Middleware verifies token
   jwt.verify(token, secret)
```

---

## 5. Frontend Implementation

### 5.1 Customer Application Structure

```
frontend/src/
├── main.jsx              # Entry with providers
├── App.jsx               # Routing configuration
├── styles/
│   └── index.css         # Global design system
├── context/
│   ├── AuthContext.jsx   # Authentication state
│   ├── CartContext.jsx   # Shopping cart state
│   └── SocketContext.jsx # Real-time connection
├── services/
│   └── api.js            # Axios HTTP client
├── components/
│   ├── Layout/           # Navbar, Footer
│   ├── Auth/             # Login modal
│   └── Food/             # FoodCard, CategoryFilter
└── pages/
    ├── Home.jsx          # Landing page
    ├── Menu.jsx          # Food browsing
    ├── Cart.jsx          # Shopping cart
    ├── Checkout.jsx      # Order placement
    ├── Orders.jsx        # Order tracking
    └── Verify.jsx        # Payment verification
```

### 5.2 State Management with Context API

```
                    ┌─────────────────┐
                    │   App.jsx       │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        ▼                    ▼                    ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│ AuthProvider  │   │ CartProvider  │   │SocketProvider │
│ - user        │   │ - cart items  │   │ - socket      │
│ - login()     │   │ - addToCart() │   │ - connected   │
│ - logout()    │   │ - removeItem()│   │ - events      │
└───────────────┘   └───────────────┘   └───────────────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             ▼
                    ┌─────────────────┐
                    │   Components    │
                    │ useAuth()       │
                    │ useCart()       │
                    │ useSocket()     │
                    └─────────────────┘
```

### 5.3 Admin Panel Features

| Feature | Description |
|---------|-------------|
| **Dashboard** | Statistics overview (orders, revenue, pending) |
| **Orders** | Real-time order management with status updates |
| **Menu Items** | View, enable/disable, delete food items |
| **Add Food** | Create new menu items with image upload |

---

## 6. Real-time Features

### 6.1 Socket.io Implementation

**Server-side (socketHandler.js):**
```javascript
io.on('connection', (socket) => {
    // Customer joins their personal room
    socket.on('joinUserRoom', (userId) => {
        socket.join(`user:${userId}`);
    });
    
    // Admin joins admin room
    socket.on('joinAdminRoom', () => {
        socket.join('admin');
    });
});
```

**Real-time Order Updates:**
```
┌──────────────┐                    ┌──────────────┐
│ Admin Panel  │                    │ Customer App │
│              │                    │              │
│ Changes      │    Socket.io       │ Receives     │
│ Order Status │ ─────────────────► │ Status Update│
│ to "Preparing"                    │ Live!        │
└──────────────┘                    └──────────────┘
```

### 6.2 Events

| Event | Direction | Purpose |
|-------|-----------|---------|
| `joinUserRoom` | Client → Server | Customer subscribes to their updates |
| `joinAdminRoom` | Client → Server | Admin subscribes to all orders |
| `newOrderReceived` | Server → Admin | Notify admin of new order |
| `myOrderUpdate` | Server → Customer | Update customer's order status |
| `orderStatusChanged` | Server → All | Broadcast order status change |

---

## 7. Security Implementation

### 7.1 Authentication & Authorization

| Feature | Implementation |
|---------|---------------|
| **Password Hashing** | bcryptjs with salt rounds |
| **Token-based Auth** | JWT with expiration |
| **Role-based Access** | `isAdmin` middleware |
| **Input Validation** | Joi schemas for all inputs |

### 7.2 Middleware Stack

```
Request → CORS → JSON Parser → Auth Middleware → Validation → Route Handler
```

### 7.3 Validation Example (Joi)

```javascript
const registerSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
});
```

---

## 8. Database Design

### 8.1 Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐
│     USERS       │       │      FOODS      │
├─────────────────┤       ├─────────────────┤
│ _id (ObjectId)  │       │ _id (ObjectId)  │
│ name            │       │ name            │
│ email (unique)  │       │ description     │
│ password (hash) │       │ price           │
│ role            │       │ image           │
│ isActive        │       │ category        │
│ createdAt       │       │ isAvailable     │
└─────────────────┘       └─────────────────┘
        │                         │
        │ 1:1                     │ Referenced in
        ▼                         ▼
┌─────────────────┐       ┌─────────────────┐
│      CARTS      │       │     ORDERS      │
├─────────────────┤       ├─────────────────┤
│ _id (ObjectId)  │       │ _id (ObjectId)  │
│ userId (ref)    │       │ userId (ref)    │
│ items [         │       │ items [         │
│   {foodId,      │       │   {foodId,name, │
│    quantity}    │       │    price,qty}   │
│ ]               │       │ ]               │
│ createdAt       │       │ totalAmount     │
└─────────────────┘       │ deliveryAddress │
                          │ status          │
                          │ paymentStatus   │
                          │ createdAt       │
                          └─────────────────┘
```

### 8.2 Collections

| Collection | Purpose | Key Fields |
|------------|---------|------------|
| `users` | User accounts | email, password, role |
| `foods` | Menu items | name, price, category, image |
| `carts` | Shopping carts | userId, items array |
| `orders` | Order records | userId, items, status, total |

---

## 9. API Documentation

### 9.1 Authentication Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Create new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/profile` | Get user profile | Yes |
| PUT | `/api/auth/profile` | Update profile | Yes |

### 9.2 Food Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/food/list` | Get all foods | No |
| GET | `/api/food/:id` | Get single food | No |
| POST | `/api/food/add` | Add new food | Admin |
| PUT | `/api/food/:id` | Update food | Admin |
| DELETE | `/api/food/:id` | Delete food | Admin |

### 9.3 Cart Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/cart` | Get user's cart | Yes |
| POST | `/api/cart/add` | Add item | Yes |
| POST | `/api/cart/remove` | Remove item | Yes |
| DELETE | `/api/cart` | Clear cart | Yes |

### 9.4 Order Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/order/create` | Create order | Yes |
| GET | `/api/order/my-orders` | Get user's orders | Yes |
| GET | `/api/order/admin/all` | Get all orders | Admin |
| PUT | `/api/order/admin/:id/status` | Update status | Admin |

---

## 10. Deployment Guide

### 10.1 Prerequisites
- AWS EC2 Instance (Ubuntu 22.04)
- Docker & Docker Compose installed
- MongoDB Atlas account
- Domain name (optional)

### 10.2 Deployment Architecture

```
                    ┌─────────────────────────────┐
                    │       AWS EC2 Instance      │
                    │         (Ubuntu)            │
                    ├─────────────────────────────┤
                    │                             │
                    │  ┌───────────────────────┐  │
      Port 80 ─────►│  │       NGINX           │  │
      Port 443      │  │   (Reverse Proxy)     │  │
                    │  └───────────┬───────────┘  │
                    │              │              │
                    │  ┌───────────▼───────────┐  │
                    │  │   Docker Containers   │  │
                    │  ├───────────────────────┤  │
                    │  │ Backend  (Port 4000)  │  │
                    │  │ Frontend (Port 5173)  │  │
                    │  │ Admin    (Port 5174)  │  │
                    │  └───────────────────────┘  │
                    │                             │
                    └─────────────────────────────┘
                                   │
                                   ▼
                    ┌─────────────────────────────┐
                    │      MongoDB Atlas          │
                    │   (Cloud Database)          │
                    └─────────────────────────────┘
```

### 10.3 Docker Compose Configuration

```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "4000:4000"
    environment:
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SECRET=${JWT_SECRET}
    
  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
      
  admin:
    build: ./admin
    ports:
      - "5174:5174"
```

---

## 11. Complexity Analysis

### 11.1 Why This Qualifies as a Complex Computing Problem

| Criteria | Implementation |
|----------|---------------|
| **Multiple Interconnected Systems** | 3 applications (Backend, Frontend, Admin) + MongoDB Database |
| **Microservices Architecture** | 4 separate services (Auth, Food, Cart, Order) |
| **Real-time Communication** | Socket.io for bidirectional updates |
| **Authentication & Security** | JWT, bcrypt, Joi validation, RBAC |
| **State Management** | React Context API with multiple providers |
| **Database Design** | 4 collections with relationships |
| **Deployment Complexity** | Docker containers, NGINX reverse proxy |

### 11.2 Technical Challenges Addressed

1. **Real-time Synchronization**: Order status updates visible instantly across all connected clients
2. **Microservices Communication**: Services operating independently while sharing data through APIs
3. **Authentication Across Services**: JWT tokens validated by auth middleware
4. **State Consistency**: Cart sync between client and server
5. **Scalability**: Architecture supports horizontal scaling

---

## 12. Conclusion

FoodMunch demonstrates a production-ready food delivery platform built with modern web technologies. The implementation showcases:

- **Microservices architecture** with clean separation of concerns
- **Real-time capabilities** using Socket.io
- **Secure authentication** with JWT and role-based access
- **Modern UI/UX** with responsive design
- **Scalable database design** with MongoDB

The project successfully addresses the requirements for a Complex Computing Problem by integrating multiple technologies, implementing real-time features, and following industry-standard practices for web development.

---

## Appendix

### A. GitHub Repository
**URL**: https://github.com/Ayaansalman/foodmunch

### B. Deployed Application
**URL**: [To be added after deployment]

### C. Technologies Used

| Category | Technologies |
|----------|--------------|
| Frontend | React, Vite, React Router, Axios, Socket.io-client |
| Backend | Node.js, Express.js, Socket.io, Mongoose |
| Database | MongoDB Atlas |
| Authentication | JWT, bcryptjs |
| Validation | Joi |
| Styling | CSS3, CSS Variables, Flexbox, Grid |

### D. Test Accounts

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@foodmunch.com | admin123 |
| **Customer** | test@123.com | 12345678 |

---

*Document prepared for Complex Computing Problems course submission*
