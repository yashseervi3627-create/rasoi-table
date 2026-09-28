RasoiHub – Home Chef Marketplace

RasoiHub is a web-based Home Chef Marketplace that connects customers with home chefs. Home chefs can list homemade food items, while customers can browse food, place orders, track orders and give reviews.

From Home Kitchens to Your Table

Developed as an academic project for BCA 'C' – 2nd Year, Mount Carmel University (Academic Year 2026–27).

Technologies Used
Frontend
React.js
Vite
TypeScript
Tailwind CSS
Backend
Node.js
Express.js
REST API
Database
MySQL
MySQL Workbench
Database: rasoihub
Source Code
GitHub
Development Tools
Component	Tool
Frontend	React + Vite
Backend	Node.js + Express
Database	MySQL
Code Editor	Visual Studio Code
Source Code	GitHub
System Architecture

User → React Frontend → Node.js + Express Backend → MySQL Database (rasoihub)

Team Members
Reg No.	Name	Contribution
MS254253	Yash Choudhary	Frontend & UI Development
MS254205	Arvind Prajapat	Backend & API Development
MS254240	Sanjay Choudhary	Database & Integration
Main Features
Customer
User Registration
User Login
Browse Homemade Food
Food Details
Add to Cart
Place Orders
Order Tracking
Ratings and Reviews
Home Chef
Chef Registration
Chef Dashboard
Add Food
Manage Menu (Edit / Delete Food)
Manage Food Availability
View Customer Orders
Update Order Status
Order Status Flow

Placed → Accepted → Preparing → Ready → Completed

Database Tables
Table	Purpose
users	Stores customer and chef accounts
chef_profiles	Stores additional chef information
foods	Stores food items listed by chefs
orders	Stores customer orders
order_items	Stores individual items in orders
reviews	Stores customer ratings and reviews
Screenshots
Home Page

C:\Users\hp\Desktop\web-screenshots\01-Home.png

Explore Food

Show Image

Food Details

Show Image

Login

Show Image

Register

Show Image

Chef Dashboard

Show Image

My Menu

Show Image

Add Food

Show Image

Edit Dish

Show Image

Cart

Show Image

Order Confirmation

Show Image

Order Tracking

Show Image

Reviews

Show Image

Show Image

How It Works

Show Image

Chef Orders

Show Image

Database Screenshots
Users Table

Show Image

Foods Table

Show Image

Orders Table

Show Image

Order Items Table

Show Image

Reviews Table

Show Image

Project Structure
RasoiHub/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── routes/
│   ├── package.json
│   └── server.js
├── src/
├── public/
├── screenshots/
├── .gitignore
├── package.json
└── README.md
Run Locally
bash
# Frontend
npm install
npm run dev

# Backend
cd backend
npm install
node server.js
