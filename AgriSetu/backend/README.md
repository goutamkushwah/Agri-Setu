# 🌾 Agri-Setu Backend API

A robust Node.js backend API for the Agri-Setu platform - a digital bridge between farmers and customers for buying and selling fresh farm produce.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **User Management**: Farmers, customers, and admin roles
- **Product Management**: CRUD operations for farm products
- **Order Management**: Complete order lifecycle management
- **File Upload**: Image upload with processing and optimization
- **Email Services**: Automated emails for verification, orders, etc.
- **Database**: PostgreSQL with Knex.js query builder
- **Security**: Helmet, CORS, rate limiting, input validation
- **API Documentation**: RESTful API with comprehensive endpoints

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd agri-setu/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=agri_setu_dev
   DB_USER=postgres
   DB_PASSWORD=your_password
   
   JWT_SECRET=your-super-secret-jwt-key
   JWT_REFRESH_SECRET=your-refresh-secret-key
   
   FRONTEND_URL=http://localhost:3000
   
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

4. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb agri_setu_dev
   
   # Run migrations
   npm run migrate
   
   # Seed database (optional)
   npm run seed
   ```

5. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 📊 Database Schema

### Users Table
- User authentication and profile information
- Role-based access (farmer, customer, admin)
- Address and contact information
- Farmer-specific fields (farm details, certifications)

### Products Table
- Product information and pricing
- Stock management
- Categories and subcategories
- Image management
- Organic and freshness indicators

### Orders Table
- Order management and tracking
- Payment status and methods
- Delivery information
- Order status lifecycle

### Order Items Table
- Individual items within orders
- Price snapshots
- Quantity management

### Reviews Table
- Product and farmer reviews
- Rating system
- Verified purchase reviews

## 🔗 API Endpoints

### Authentication
```
POST /api/v1/auth/register     - Register new user
POST /api/v1/auth/login        - Login user
POST /api/v1/auth/refresh-token - Refresh access token
POST /api/v1/auth/logout       - Logout user
GET  /api/v1/auth/verify-email/:token - Verify email
POST /api/v1/auth/forgot-password - Forgot password
POST /api/v1/auth/reset-password - Reset password
GET  /api/v1/auth/profile      - Get user profile
```

### Products
```
GET    /api/v1/products        - Get all products
GET    /api/v1/products/:id    - Get product by ID
POST   /api/v1/products        - Create product (farmer only)
PUT    /api/v1/products/:id    - Update product (owner only)
DELETE /api/v1/products/:id    - Delete product (owner only)
GET    /api/v1/products/search - Search products
GET    /api/v1/products/category/:category - Get products by category
```

### Orders
```
GET    /api/v1/orders          - Get user orders
GET    /api/v1/orders/:id      - Get order by ID
POST   /api/v1/orders          - Create new order
PUT    /api/v1/orders/:id/status - Update order status
GET    /api/v1/orders/farmer/:farmerId - Get farmer orders
```

### Farmers
```
GET    /api/v1/farmers         - Get all farmers
GET    /api/v1/farmers/:id     - Get farmer by ID
GET    /api/v1/farmers/:id/products - Get farmer products
PUT    /api/v1/farmers/profile - Update farmer profile
GET    /api/v1/farmers/dashboard - Get farmer dashboard
```

### Customers
```
GET    /api/v1/customers/profile - Get customer profile
PUT    /api/v1/customers/profile - Update customer profile
GET    /api/v1/customers/dashboard - Get customer dashboard
GET    /api/v1/customers/orders - Get customer orders
```

### Reviews
```
GET    /api/v1/reviews         - Get reviews
POST   /api/v1/reviews         - Create review
PUT    /api/v1/reviews/:id     - Update review
DELETE /api/v1/reviews/:id     - Delete review
```

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Register/Login** to get access token and refresh token
2. **Include token** in Authorization header: `Bearer <token>`
3. **Refresh token** when access token expires

### Role-Based Access Control

- **Customer**: Can view products, create orders, write reviews
- **Farmer**: Can manage products, view orders, update order status
- **Admin**: Full access to all resources

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── utils/          # Utility functions
│   └── config/         # Configuration files
├── migrations/         # Database migrations
├── seeds/             # Database seeds
├── uploads/           # File uploads
├── tests/             # Test files
└── server.js          # Application entry point
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📈 Monitoring & Logging

- **Winston** for structured logging
- **Morgan** for HTTP request logging
- **Health check** endpoint at `/health`

## 🚀 Deployment

### Production Setup

1. **Environment Variables**
   ```bash
   NODE_ENV=production
   PORT=5000
   # ... other production configs
   ```

2. **Database Migration**
   ```bash
   npm run migrate
   ```

3. **Start Application**
   ```bash
   npm start
   ```

### Docker Deployment

```bash
# Build image
docker build -t agri-setu-backend .

# Run container
docker run -p 5000:5000 agri-setu-backend
```

## 🔧 Scripts

```bash
npm start              # Start production server
npm run dev            # Start development server
npm test               # Run tests
npm run migrate        # Run database migrations
npm run migrate:rollback # Rollback last migration
npm run seed           # Seed database
npm run migrate:reset  # Reset and reseed database
```

## 📝 API Documentation

For detailed API documentation, visit:
- Development: `http://localhost:5000/api-docs`
- Production: `https://api.agri-setu.com/api-docs`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Email: support@agri-setu.com
- Documentation: [docs.agri-setu.com](https://docs.agri-setu.com)
- Issues: [GitHub Issues](https://github.com/agri-setu/backend/issues)
