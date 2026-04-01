# 💰 Finance Data Processing Backend

## 📌 Overview
This project is a backend system for managing financial data, user roles, and dashboard analytics. It demonstrates API design, data modeling, access control, and aggregation logic.

---

## 🚀 Features

### 👤 User Management
- Create and manage users
- Role-based access (admin, analyst, viewer)
- User status handling

### 💰 Financial Records
- Create, read, update, delete records
- Fields: amount, type, category, date, note
- Filtering (type, category, date)
- Pagination support
- Search functionality

### 📊 Dashboard APIs
- Total income
- Total expenses
- Net balance
- Category-wise totals
- Monthly trends
- Weekly trends
- Recent activity

### 🔐 Access Control
- Admin → full access
- Analyst → read + insights
- Viewer → restricted

### ⚠️ Validation & Error Handling
- Input validation
- Proper status codes
- Error handling for invalid operations

---

## 🛠 Tech Stack
- Node.js
- Express.js
- MongoDB (Mongoose)

---

## 📡 API Endpoints

### Users
- POST `/users`
- GET `/users`

### Records
- POST `/records`
- GET `/records`
- PUT `/records/:id`
- DELETE `/records/:id`

### Filters & Pagination
- GET `/records?type=income`
- GET `/records?page=1&limit=5`
- GET `/records?search=food`

### Dashboard
- GET `/summary/income`
- GET `/summary/expense`
- GET `/summary/balance`
- GET `/summary/category`
- GET `/summary/monthly`
- GET `/summary/weekly`
- GET `/summary/recent`

---

## ⚙️ Setup

```bash
node app.js
