# AWS EC2 Deployment Guide for FoodMunch (Simple Setup)

This guide walks you through deploying FoodMunch on AWS EC2 without Docker - just Node.js directly.

---

## Step 1: Launch EC2 Instance

1. Go to **AWS Console → EC2 → Launch Instance**
2. Configure:
   - **Name**: foodmunch-server
   - **AMI**: Ubuntu Server 22.04 LTS
   - **Instance Type**: t2.micro (free tier)
   - **Key Pair**: Create new or use existing (.pem file)
   - **Security Group**: Allow these ports:
     - 22 (SSH)
     - 80 (HTTP)
     - 4000 (Backend API)
     - 5173 (Frontend)
     - 5174 (Admin)

3. Click **Launch** and note your **Public IP Address**

---

## Step 2: Connect to EC2

```bash
# On your local machine (Windows PowerShell or CMD)
ssh -i "your-key.pem" ubuntu@YOUR_EC2_PUBLIC_IP
```

---

## Step 3: Install Node.js

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

---

## Step 4: Install PM2 (Process Manager)

```bash
sudo npm install -g pm2
```

---

## Step 5: Clone Your Repository

```bash
# Install git
sudo apt install git -y

# Clone your repository
git clone https://github.com/YOUR_USERNAME/foodmunch.git
cd foodmunch
```

---

## Step 6: Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file
nano .env
```

Add these contents to .env:
```
PORT=4000
MONGODB_URI=mongodb+srv://fooddelivery:uB9gPSeam9vMyKqG@cluster0.qupaqyz.mongodb.net/food-delivery?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=random#secret
```

Press `Ctrl+X`, then `Y`, then `Enter` to save.

```bash
# Seed the database
node seed.js

# Start with PM2
pm2 start server.js --name backend
```

---

## Step 7: Setup Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Build for production
npm run build

# Install serve to host build files
sudo npm install -g serve

# Start with PM2
pm2 start "serve -s dist -l 5173" --name frontend
```

---

## Step 8: Setup Admin Panel

```bash
cd ../admin

# Install dependencies
npm install

# Build for production
npm run build

# Start with PM2
pm2 start "serve -s dist -l 5174" --name admin
```

---

## Step 9: Save PM2 Configuration

```bash
# Save current processes
pm2 save

# Setup PM2 to start on system boot
pm2 startup
# Copy and run the command it gives you
```

---

## Step 10: Verify Deployment

Open in browser:
- **Frontend**: http://YOUR_EC2_IP:5173
- **Admin**: http://YOUR_EC2_IP:5174  
- **API**: http://YOUR_EC2_IP:4000/api/food/list

### Test Accounts

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@foodmunch.com | admin123 |
| **Customer** | test@123.com | 12345678 |

---

## Useful PM2 Commands

```bash
# View all processes
pm2 list

# View logs
pm2 logs

# Restart all services
pm2 restart all

# Stop all services
pm2 stop all

# Monitor resources
pm2 monit
```

---

## Important: Update API URLs

Before building frontend and admin, update the API URL to your EC2 IP:

**In frontend code files, change:**
```javascript
// From
const API_URL = 'http://localhost:4000/api';
// To
const API_URL = 'http://YOUR_EC2_IP:4000/api';
```

Do the same for Socket.io connection URL.

---

## Quick Reference

| Service | Port | URL |
|---------|------|-----|
| Backend API | 4000 | http://EC2_IP:4000 |
| Frontend | 5173 | http://EC2_IP:5173 |
| Admin Panel | 5174 | http://EC2_IP:5174 |

---

## Troubleshooting

**MongoDB connection issues:**
- Go to MongoDB Atlas → Network Access
- Add your EC2 IP or allow access from anywhere (0.0.0.0/0)

**Port not accessible:**
- Check EC2 Security Group has the port open

**Process crashed:**
```bash
pm2 logs --err
pm2 restart all
```
