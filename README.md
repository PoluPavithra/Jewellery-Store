# AURELIA — Luxury Haute Joaillerie E-Commerce Platform

Aurelia is a production-ready, full-stack luxury jewellery e-commerce platform built with **Spring Boot 3**, **Java 17**, **React 18**, **TypeScript**, **Tailwind CSS**, and **MySQL**.

---

## 🌟 Key Features

### 👑 Customer Features
- **Luxury Showcase**: High-definition image sliders, interactive image zooming, category filters, material/price range selectors, and sorting.
- **Dynamic Shopping Bag & Wishlist**: Real-time side drawer carts, quantity managers, and ring/bracelet size selectors.
- **Razorpay Payment Gateway**: Seamless order creation, Razorpay checkout modal, and secure HMAC-SHA256 signature verification.
- **Order Management & Invoicing**: Track order status (PENDING, PROCESSING, SHIPPED, DELIVERED) and view/print official luxury invoices.
- **VIP Customer Profile**: Update profile details, phone numbers, and manage multiple delivery addresses.

### 🛡️ Admin Management Panel
- **Executive Dashboard**: Live revenue totals, order counts, customer registry stats, and low stock warnings.
- **Catalogue CRUD**: Full control to add, edit, or remove jewellery items with custom images, materials, weights, and stock levels.
- **Inventory Control**: Real-time inline stock editor for quick restocking.
- **Category Manager**: Add and organize jewellery categories.
- **Order Processing**: Change customer order statuses directly with instant updates.
- **Customer Directory**: View client account details and promote/demote roles.

### 🔐 Security & Architecture
- **JWT Authentication**: Stateless BCrypt encrypted password authorization.
- **Role-Based Access Control**: `ROLE_USER` and `ROLE_ADMIN` route guards.
- **Input Validation**: Clean DTO request constraints with global exception handling.

---

## 📁 Complete Project Folder Structure

```
.
├── Dockerfile                      # Multi-stage Dockerfile for React Frontend
├── docker-compose.yml              # Orchestrates MySQL, Spring Boot & React containers
├── schema.sql                      # Production MySQL database schema & seed data
├── .env.example                    # Environment variable configuration template
├── README.md                       # Complete setup documentation
├── package.json                    # Frontend dependencies & scripts
├── vite.config.ts                  # Vite build configuration
├── src/                            # React Frontend Source
│   ├── components/                 # Reusable UI Components
│   │   ├── AuthModal.tsx
│   │   ├── CartDrawer.tsx
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── Skeleton.tsx
│   │   └── WishlistDrawer.tsx
│   ├── context/                    # React Context State Managers
│   │   ├── AuthContext.tsx
│   │   └── ShopContext.tsx
│   ├── pages/                      # Application Page Views
│   │   ├── AboutPage.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── CheckoutPage.tsx
│   │   ├── CollectionsPage.tsx
│   │   ├── ContactPage.tsx
│   │   ├── Home.tsx
│   │   ├── InvoicePage.tsx
│   │   ├── OrderHistoryPage.tsx
│   │   ├── ProductDetails.tsx
│   │   ├── ProductListingPage.tsx
│   │   └── UserProfilePage.tsx
│   ├── services/                   # API Integration Clients
│   │   ├── adminService.ts
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   ├── cartService.ts
│   │   ├── orderService.ts
│   │   ├── paymentService.ts
│   │   ├── productService.ts
│   │   └── userService.ts
│   ├── types.ts                    # Global TypeScript Interfaces
│   ├── App.tsx                     # Main Router & Application Container
│   ├── main.tsx                    # React Entry Point
│   └── index.css                   # Global Luxury Gold/Emerald Design System
└── backend/                        # Spring Boot 3 Java Backend
    ├── Dockerfile                  # Multi-stage Dockerfile for Java Spring Boot
    ├── pom.xml                     # Maven project configuration & dependencies
    └── src/main/java/com/aurelia/jewellery/
        ├── config/                 # Security & CORS Config
        │   └── SecurityConfig.java
        ├── controller/             # REST API Controllers
        │   ├── AdminController.java
        │   ├── AuthController.java
        │   ├── CartController.java
        │   ├── CategoryController.java
        │   ├── OrderController.java
        │   ├── PaymentController.java
        │   ├── ProductController.java
        │   └── UserController.java
        ├── dto/                    # Request & Response Data Transfer Objects
        │   ├── request/
        │   └── response/
        ├── exception/              # Global Exception Handlers
        │   ├── GlobalExceptionHandler.java
        │   └── ResourceNotFoundException.java
        ├── model/                  # JPA Database Entities
        │   ├── Cart.java
        │   ├── Category.java
        │   ├── Order.java
        │   ├── Product.java
        │   ├── User.java
        │   └── ...
        ├── repository/             # Spring Data JPA Repositories
        ├── security/               # JWT Utilities & Filters
        │   ├── JwtAuthenticationFilter.java
        │   ├── JwtTokenProvider.java
        │   └── CustomUserDetailsService.java
        └── service/                # Business Logic Interfaces & Implementations
            ├── impl/
            └── ...
```

---

## 📡 Complete REST API Endpoint Directory

### 🔑 Authentication APIs
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register new user account |
| POST | `/api/auth/login` | Public | Authenticate user & receive JWT token |

### 💎 Product & Category APIs
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/products` | Public | Fetch all catalogue items |
| GET | `/api/products/{id}` | Public | Fetch product details by ID |
| GET | `/api/products/category/{catId}` | Public | Fetch products by category |
| POST | `/api/products` | Admin | Create a new jewellery item |
| PUT | `/api/products/{id}` | Admin | Update jewellery item details |
| DELETE | `/api/products/{id}` | Admin | Delete jewellery item |
| GET | `/api/categories` | Public | List all categories |

### 🛒 Shopping Bag APIs
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/cart` | Authenticated | Fetch active user shopping bag |
| POST | `/api/cart/items` | Authenticated | Add item to shopping bag |
| PUT | `/api/cart/items/{itemId}` | Authenticated | Update quantity or size |
| DELETE | `/api/cart/items/{itemId}` | Authenticated | Remove item from bag |

### 📦 Order & Invoice APIs
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/orders` | Authenticated | Place a new order from cart |
| GET | `/api/orders` | Authenticated | Get user's order history |
| GET | `/api/orders/{id}` | Authenticated | Get specific order invoice details |

### 💳 Razorpay Payment Gateway APIs
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/payments/create-order` | Authenticated | Initialize Razorpay payment order |
| POST | `/api/payments/verify` | Authenticated | Verify HMAC-SHA256 signature |
| POST | `/api/payments/cancel/{orderId}` | Authenticated | Handle payment cancellation |

### 🛡️ Admin Executive APIs
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/admin/stats` | Admin | Fetch live dashboard metrics |
| GET | `/api/admin/orders` | Admin | Fetch all customer orders |
| PUT | `/api/admin/orders/{id}/status` | Admin | Update order status |
| GET | `/api/admin/customers` | Admin | List registered customers |
| PUT | `/api/admin/customers/{id}/role` | Admin | Change user authorization role |

---

## 🗄️ MySQL Database Schema

The database consists of 8 normalized relational tables:
1. `users` (id, full_name, email, password, phone, role, created_at)
2. `categories` (id, name, description, created_at)
3. `products` (id, name, description, price, material, weight, stock, primary_image_url, category_id, created_at)
4. `product_images` (id, product_id, image_url)
5. `carts` (id, user_id, updated_at)
6. `cart_items` (id, cart_id, product_id, quantity, selected_size)
7. `orders` (id, order_number, user_id, total_amount, status, shipping_street, shipping_city, shipping_state, shipping_postal_code, shipping_country, razorpay_order_id, razorpay_payment_id, created_at)
8. `order_items` (id, order_id, product_id, quantity, price_at_purchase, selected_size)

---

## 🚀 Steps to Run the Application Locally

### Method 1: Docker Compose (Recommended)
1. Ensure Docker and Docker Compose are installed.
2. Run the following command at the project root:
   ```bash
   docker-compose up --build
   ```
3. Open your browser:
   - **Frontend App**: `http://localhost:3000`
   - **Backend API**: `http://localhost:8080/api`
   - **MySQL Server**: `localhost:3306`

### Method 2: Manual Local Execution

#### 1. Setup MySQL Database
- Create a database named `aurelia_jewellery_db`.
- Import the `schema.sql` file:
  ```bash
  mysql -u root -p aurelia_jewellery_db < schema.sql
  ```

#### 2. Start Backend (Spring Boot)
- Navigate to the `/backend` folder:
  ```bash
  cd backend
  mvn clean spring-boot:run
  ```
- The backend will start on `http://localhost:8080`.

#### 3. Start Frontend (React + Vite)
- Navigate to the project root directory and run:
  ```bash
  npm install
  npm run dev
  ```
- Access the web interface at `http://localhost:3000`.
