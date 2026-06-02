# 🌾 Agri-Setu - Digital Bridge Between Farmers & Customers

## 📁 Complete Project Structure

```
agri-setu/
├── backend/                          # Node.js + Express + PostgreSQL + Knex
│   ├── src/
│   │   ├── controllers/              # Route controllers
│   │   │   ├── authController.js
│   │   │   ├── farmerController.js
│   │   │   ├── customerController.js
│   │   │   ├── productController.js
│   │   │   ├── orderController.js
│   │   │   └── adminController.js
│   │   ├── middleware/               # Custom middleware
│   │   │   ├── auth.js
│   │   │   ├── validation.js
│   │   │   ├── upload.js
│   │   │   └── errorHandler.js
│   │   ├── models/                   # Database models
│   │   │   ├── User.js
│   │   │   ├── Product.js
│   │   │   ├── Order.js
│   │   │   └── index.js
│   │   ├── routes/                   # API routes
│   │   │   ├── auth.js
│   │   │   ├── farmers.js
│   │   │   ├── customers.js
│   │   │   ├── products.js
│   │   │   ├── orders.js
│   │   │   └── admin.js
│   │   ├── services/                 # Business logic
│   │   │   ├── authService.js
│   │   │   ├── productService.js
│   │   │   ├── orderService.js
│   │   │   └── notificationService.js
│   │   ├── utils/                    # Utility functions
│   │   │   ├── database.js
│   │   │   ├── email.js
│   │   │   ├── payment.js
│   │   │   └── helpers.js
│   │   ├── config/                   # Configuration files
│   │   │   ├── database.js
│   │   │   ├── jwt.js
│   │   │   └── upload.js
│   │   └── app.js                    # Express app setup
│   ├── migrations/                   # Database migrations
│   │   ├── 001_create_users.js
│   │   ├── 002_create_products.js
│   │   ├── 003_create_orders.js
│   │   └── 004_create_reviews.js
│   ├── seeds/                        # Database seeds
│   │   ├── users.js
│   │   ├── products.js
│   │   └── orders.js
│   ├── uploads/                      # File uploads
│   │   ├── products/
│   │   ├── profiles/
│   │   └── temp/
│   ├── tests/                        # Backend tests
│   │   ├── auth.test.js
│   │   ├── products.test.js
│   │   └── orders.test.js
│   ├── package.json
│   ├── knexfile.js
│   ├── .env.example
│   ├── .env
│   ├── .gitignore
│   └── server.js                     # Server entry point
│
├── frontend/                         # React Frontend
│   ├── public/
│   │   ├── index.html
│   │   ├── favicon.ico
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/               # Reusable components
│   │   │   ├── common/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── Loading.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   ├── RegisterForm.jsx
│   │   │   │   ├── ForgotPassword.jsx
│   │   │   │   └── ProfileForm.jsx
│   │   │   ├── products/
│   │   │   │   ├── ProductCard.jsx
│   │   │   │   ├── ProductGrid.jsx
│   │   │   │   ├── ProductDetails.jsx
│   │   │   │   ├── ProductForm.jsx
│   │   │   │   ├── ProductFilters.jsx
│   │   │   │   └── ProductSearch.jsx
│   │   │   ├── orders/
│   │   │   │   ├── OrderCard.jsx
│   │   │   │   ├── OrderSummary.jsx
│   │   │   │   ├── OrderStatus.jsx
│   │   │   │   └── OrderTracking.jsx
│   │   │   ├── farmer/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── ProductManagement.jsx
│   │   │   │   ├── OrderManagement.jsx
│   │   │   │   ├── SalesAnalytics.jsx
│   │   │   │   └── FarmerProfile.jsx
│   │   │   └── customer/
│   │   │       ├── Cart.jsx
│   │   │       ├── Wishlist.jsx
│   │   │       ├── OrderHistory.jsx
│   │   │       ├── CustomerProfile.jsx
│   │   │       └── CustomerDashboard.jsx
│   │   ├── pages/                    # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── FarmerDashboard.jsx
│   │   │   ├── CustomerDashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── About.jsx
│   │   │   └── Contact.jsx
│   │   ├── hooks/                    # Custom hooks
│   │   │   ├── useAuth.js
│   │   │   ├── useCart.js
│   │   │   ├── useProducts.js
│   │   │   ├── useOrders.js
│   │   │   └── useLocalStorage.js
│   │   ├── context/                  # React Context
│   │   │   ├── AuthContext.jsx
│   │   │   ├── CartContext.jsx
│   │   │   └── ProductContext.jsx
│   │   ├── services/                 # API services
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── productService.js
│   │   │   ├── orderService.js
│   │   │   └── userService.js
│   │   ├── utils/                    # Utility functions
│   │   │   ├── constants.js
│   │   │   ├── helpers.js
│   │   │   ├── validators.js
│   │   │   └── formatters.js
│   │   ├── styles/                   # Stylesheets
│   │   │   ├── globals.css
│   │   │   ├── components.css
│   │   │   └── pages.css
│   │   ├── assets/                   # Static assets
│   │   │   ├── images/
│   │   │   ├── icons/
│   │   │   └── fonts/
│   │   ├── App.jsx
│   │   └── index.jsx
│   ├── package.json
│   ├── .env
│   ├── .gitignore
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── docs/                             # Documentation
│   ├── API.md
│   ├── DEPLOYMENT.md
│   ├── CONTRIBUTING.md
│   └── README.md
│
├── scripts/                          # Deployment scripts
│   ├── setup.sh
│   ├── deploy.sh
│   └── backup.sh
│
├── docker/                           # Docker configuration
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── docker-compose.yml
│
├── .gitignore
├── README.md
└── package.json                      # Root package.json for scripts
```

## 🎯 Key Features

### For Farmers:
- 📊 Dashboard with sales analytics
- 🥬 Product management (CRUD)
- 📦 Order management
- 📈 Sales reports and insights
- 👤 Profile management
- 📱 Mobile-responsive interface

### For Customers:
- 🛒 Shopping cart and wishlist
- 🔍 Product search and filters
- 📋 Order tracking
- ⭐ Product reviews and ratings
- 💳 Secure payment processing
- 🚚 Delivery tracking

### For Admins:
- 👥 User management
- 📊 System analytics
- 🛡️ Content moderation
- 💰 Payment management
- 📈 Business insights

## 🛠️ Technology Stack

### Backend:
- **Node.js** + **Express.js**
- **PostgreSQL** database
- **Knex.js** query builder
- **JWT** authentication
- **Multer** file uploads
- **Joi** validation
- **Bcrypt** password hashing

### Frontend:
- **React 18** with hooks
- **React Router** navigation
- **Axios** HTTP client
- **Tailwind CSS** styling
- **React Query** state management
- **React Hook Form** forms
- **Vite** build tool

## 🚀 Getting Started

1. Clone the repository
2. Setup backend (see backend/README.md)
3. Setup frontend (see frontend/README.md)
4. Configure environment variables
5. Run database migrations
6. Start both servers

## 📱 Mobile Responsive
- Fully responsive design
- Progressive Web App (PWA) ready
- Touch-friendly interface
- Offline capabilities
