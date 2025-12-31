# Admin Dashboard (MEAN Stack)

## Project Structure
- **backend**: Node.js + Express + MongoDB
- **frontend**: Angular

## Prerequisites
- Node.js
- MongoDB (running locally on default port 27017)
**Using Docker:**
```bash
docker run -d --name mongodb -p 27017:27017 mongo:latest
```

## How to Run

### Backend
1. Navigate to `backend` folder:
   ```bash
   cd admin-dashboard/backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start server:
   ```bash
   npm start
   ```
   Server runs on `http://localhost:5000`

### Frontend
1. Navigate to `frontend` folder:
   ```bash
   cd admin-dashboard/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start application:
   ```bash
   npm start
   ```
   Application runs on `http://localhost:4200`

## Default Login
- The app supports Registration and Login.
- To access the Dashboard, the user must have `role: 'admin'`.
