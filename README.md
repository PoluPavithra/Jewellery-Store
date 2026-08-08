# 👑 AURELIA — Luxury Haute Joaillerie E-Commerce Platform

Welcome to **Aurelia**, a production-ready, full-stack luxury jewellery e-commerce platform. This application is built with a **React** frontend and a **Spring Boot** backend, offering a premium shopping experience with features like a shopping bag, wishlist, payment gateway integration, and a comprehensive admin dashboard.

This guide will walk you through setting up, running, and exploring the Aurelia platform.

---

## 🌟 What Can You Do with Aurelia?

### For Customers:
- **Luxury Showcase**: Browse high-definition jewellery pieces, filter by category, and sort by price.
- **Dynamic Shopping Bag & Wishlist**: Easily add items to your cart or wishlist, manage quantities, and select sizes.
- **Secure Checkout**: Seamlessly process payments using the integrated payment gateway structure.
- **Order Tracking**: View order status (Pending, Processing, Shipped, Delivered) and access official invoices.
- **Profile Management**: Update personal details and manage multiple delivery addresses.

### For Administrators:
- **Executive Dashboard**: Monitor live revenue, total orders, customer statistics, and low-stock alerts.
- **Catalogue Management**: Add, edit, or remove jewellery items (images, materials, prices, stock levels).
- **Inventory Control**: Update stock quickly via the inline inventory editor.
- **Order Processing**: Update customer order statuses in real-time.
- **Customer Directory**: View client details and manage user roles (Admin vs User).

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, React Router, Tailwind CSS, Lucide Icons.
- **Backend**: Java 17, Spring Boot 3, Spring Security, JWT Authentication.
- **Database**: MySQL.
- **Infrastructure**: Docker & Docker Compose for easy deployment.

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need the following installed on your system:
- **Docker & Docker Compose** (Recommended for the easiest setup)
- **Node.js** (v18 or higher) - *If running frontend manually*
- **Java 17** & **Maven** - *If running backend manually*
- **MySQL** (v8.0+) - *If running database manually*

---

### Method 1: The Easy Way (Using Docker Compose) 🐳

This method will spin up the Frontend, Backend, and Database automatically in containers.

1. **Clone or download this repository** to your local machine.
2. **Open your terminal** and navigate to the root directory of the project.
3. **Run the following command**:
   ```bash
   docker-compose up --build
   ```
4. **Wait a few moments** for the containers to build and start. The database will automatically be seeded with initial categories.
5. **Access the application**:
   - **Frontend App**: [http://localhost:3000](http://localhost:3000)
   - **Backend API**: [http://localhost:8080](http://localhost:8080)

---

### Method 2: Manual Setup (For Development) 💻

If you prefer to run the services individually on your host machine:

#### 1. Database Setup
1. Open MySQL and create a database:
   ```sql
   CREATE DATABASE aurelia_jewellery_db;
   ```
2. Import the initial schema and data:
   ```bash
   mysql -u root -p aurelia_jewellery_db < schema.sql
   ```

#### 2. Backend (Spring Boot) Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Update the `application.properties` (or `.env` equivalent) if your MySQL credentials differ from the defaults (root/root).
3. Run the application using Maven:
   ```bash
   mvn clean spring-boot:run
   ```
4. The API will be available at `http://localhost:8080`.

#### 3. Frontend (React) Setup
1. Open a new terminal window and navigate to the project root directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Access the web interface at `http://localhost:3000`.

---

## 🔐 Using the Application

### Creating Your First User
1. Open the frontend application in your browser.
2. Click on the **Sign In / Sign Up** button (usually in the top right or within the mobile menu).
3. Register a new account.
4. Once registered, you can start browsing, adding items to your wishlist or cart, and proceeding to checkout.

### Accessing the Admin Dashboard
By default, new users are assigned the `ROLE_USER` role. To access the Admin Dashboard, you need `ROLE_ADMIN`.
If you are running locally with manual database access, you can upgrade your user via SQL:
```sql
UPDATE users SET role = 'ROLE_ADMIN' WHERE email = 'your-email@example.com';
```
After updating, log out and log back in. You will now see the **Admin Dashboard** option in your profile menu!

---

## 📁 Project Structure Overview

Understanding the layout of the project will help you navigate and make changes:

- **/src**: Contains the React Frontend code.
  - **/components**: Reusable UI parts (Navbar, Footer, Modals, Drawers).
  - **/context**: React Context providers (AuthContext, ShopContext).
  - **/pages**: Main view components (Home, Products, Checkout, Admin, Profile).
  - **/services**: Functions to communicate with the Backend API.
- **/backend**: Contains the Spring Boot Java Backend code.
  - **/src/main/java/com/aurelia/jewellery/controller**: REST API endpoints.
  - **/src/main/java/com/aurelia/jewellery/model**: Database entities.
  - **/src/main/java/com/aurelia/jewellery/service**: Business logic.
- **schema.sql**: The SQL file used to structure the database and insert initial categories.
- **docker-compose.yml**: Orchestrates the multi-container Docker application.

---

## 🤝 Need Help?

If you encounter any issues during setup or usage, please double-check that your ports (`3000`, `8080`, `3306`) are not being used by other applications. 

Happy Shopping at Aurelia! ✨
