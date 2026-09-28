# 🍱 RasoiHub - Home Chef Marketplace

> **From Home Kitchens to Your Table**

RasoiHub is a web-based Home Chef Marketplace that connects customers with home chefs. The platform allows home chefs to list homemade food items while customers can browse food, place orders, track orders, and provide reviews.

This project was developed as an academic project for **BCA 'C' - 2nd Year** at **Mount Carmel University**.

---

## 🎯 Aim

The main aim of RasoiHub is to provide a simple online platform that connects customers with home chefs and makes homemade food easier to discover and order.

The system provides separate functionality for customers and home chefs.

---

## 💡 Project Idea

RasoiHub provides a common platform where home chefs can showcase their homemade food and customers can discover and order food from them.

### Basic Flow

**Home Chef → Add Homemade Food → Receive Customer Orders**

**Customer → Browse Food → Add to Cart → Place Order → Track Order → Review**

---

## ✨ Key Features

### 👤 Customer

- User Registration and Login
- Browse Homemade Food
- View Food Details
- Add Food to Cart
- Place Orders
- View Orders
- Track Order Status
- Give Ratings and Reviews

### 👨‍🍳 Home Chef

- Chef Registration
- Chef Dashboard
- Add Food Items
- Manage Menu
- Edit and Delete Food Items
- Manage Food Availability
- View Customer Orders
- Update Order Status
- Manage Chef Profile

### 📦 Order Tracking

Orders follow a simple status flow:

**Placed → Accepted → Preparing → Ready → Completed**

Orders can also be marked as **Cancelled**.

---

## 🛠️ Technologies Used

| Category | Technologies |
|---|---|
| Frontend | React.js, Vite, TypeScript, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MySQL |
| Database Tool | MySQL Workbench |
| Development | Visual Studio Code |
| Version Control | Git & GitHub |

---

## 👥 Team Contributions

| Team Member | Reg. No. | Contribution |
|---|---|---|
| **Yash Choudhary** | MS254253 | Frontend & UI Development |
| **Arvind Prajapat** | MS254205 | Backend & API Development |
| **Sanjay Choudhary** | MS254240 | Database & Integration |

---

## 🔄 System Flow


                ┌──────────────────┐
                │     Customer     │
                └────────┬─────────┘
                         │
                         ▼
                ┌──────────────────┐
                │ React Frontend   │
                └────────┬─────────┘
                         │
                    API Requests
                         │
                         ▼
                ┌──────────────────┐
                │ Node.js +        │
                │ Express Backend  │
                └────────┬─────────┘
                         │
                    SQL Queries
                         │
                         ▼
                ┌──────────────────┐
                │ MySQL Database   │
                │    rasoihub      │
                └──────────────────┘

                🖥️ Website Implementation
🏠 Home Page

The home page introduces RasoiHub and provides navigation to the main sections of the website.

🍽️ Explore Food

Customers can browse homemade food items listed by home chefs.

🍛 Food Details

Customers can view detailed information about a selected food item.

🔐 Login

The Login page allows registered users to access their accounts.

📝 Registration

New users can create an account and select the appropriate user role.

👨‍🍳 Chef Dashboard

The Chef Dashboard provides access to food management and order-related functionality.

🍴 My Menu

Chefs can view and manage their listed food items.

➕ Add Food

Chefs can add new homemade food items by providing details such as name, description, price, category and image.

🛒 Cart

Customers can review the food items they have selected before placing an order.

📦 Orders

Customers can view their placed orders and order information.

🚚 Order Tracking

Customers can track the current status of their orders.

Placed → Accepted → Preparing → Ready → Completed

⭐ Reviews

Customers can provide ratings and comments for food items.

⚙️ Backend Implementation

The backend is developed using Node.js and Express.js.

It is responsible for handling API requests, application logic and communication with the MySQL database.

Backend Structure
backend/
├── config/
│   └── db.js
├── routes/
├── .env
├── package.json
└── server.js

🗄️ MySQL Database

RasoiHub uses MySQL for storing application data.

Database Name
rasoihub
Main Tables
Table	Purpose
users	Stores customer and chef accounts
foods	Stores food items listed by chefs
orders	Stores customer orders
order_items	Stores individual items in orders
reviews	Stores customer ratings and reviews
chef_profiles	Stores additional chef information
🔗 Database Relationships
Users
 │
 ├── Foods
 │
 ├── Chef Profiles
 │
 └── Orders
        │
        └── Order Items
               │
               └── Foods

Users ───── Reviews ───── Foods

The database uses primary keys and foreign keys to maintain relationships between the tables.

🎓 Academic Project

Project: RasoiHub - Home Chef Marketplace
Course: BCA 'C' - 2nd Year
College: Mount Carmel University
Academic Year: 2026–27

👥 Project Team
Name	Register Number
Yash Choudhary	MS254253
Arvind Prajapat	MS254205
Sanjay Choudhary	MS254240

📌 Conclusion

RasoiHub demonstrates the development of a Home Chef Marketplace using frontend, backend and database technologies.

The project brings together a React-based interface, Node.js and Express.js backend, and MySQL database to provide functionality for home chefs and customers.

The project demonstrates practical concepts including:

Web application development
React frontend development
REST API architecture
Backend development
MySQL database design
Database relationships
Food and menu management
Order management
Order tracking
Customer reviews

for this text make it look attractive
