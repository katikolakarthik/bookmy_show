# BookMyShow Backend

A comprehensive backend API for movie and event ticket booking system built with Node.js, Express, and MongoDB.

## 🚀 Features

### Core Features
- ✅ **User Registration & Login** - JWT-based authentication with password validation
- ✅ **User Profile Management** - Update profile and change password
- ✅ **Movie Management** - CRUD operations for movies (Admin only)
- ✅ **Event Management** - Create and manage events (Admin only)
- ✅ **Venue Management** - Create and manage venues (Admin only)
- ✅ **Show Management** - Create and manage shows for movies/events (Admin only)
- ✅ **Ticket Booking System** - Book tickets with seat selection
- ✅ **Seat Locking** - Concurrency-safe seat reservation
- ✅ **Booking Management** - View, cancel, and manage bookings
- ✅ **Admin Dashboard** - Admin panel with statistics and user management

### Technical Features
- 🔐 **JWT Authentication** - Secure token-based authentication
- 🛡️ **Input Validation** - Comprehensive validation with express-validator
- 🔒 **Role-based Authorization** - Admin and user role management
- 📊 **Database Indexing** - Optimized queries with MongoDB indexes
- 🚦 **Rate Limiting** - API rate limiting for security
- 🛡️ **Security Middleware** - Helmet, CORS, and other security measures
- 📝 **Error Handling** - Centralized error handling
- 🔄 **Concurrency Control** - Seat locking mechanism
- 📱 **Scalable Architecture** - Modular and scalable code structure

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Security**: helmet, cors, express-rate-limit
- **Environment**: dotenv
- **File Upload**: multer
- **Date/Time**: moment
- **Testing**: Jest

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bookmyshow-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `config.env` and update the values:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/bookmyshow
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_EXPIRE=7d
   BCRYPT_SALT_ROUNDS=12
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

4. **Start MongoDB**
   ```bash
   # Start MongoDB service
   mongod
   ```

5. **Create Admin User**
   ```bash
   npm run create-admin
   ```

6. **Run the application**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## 📚 API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Authentication Routes (`/auth`)
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/create-admin` - Create admin user (special route)
- `GET /auth/me` - Get current user profile
- `PUT /auth/profile` - Update user profile
- `PUT /auth/change-password` - Change password
- `POST /auth/logout` - User logout

### User Routes (`/user`)
- `GET /user/profile` - Get user profile
- `PUT /user/profile` - Update user profile
- `PUT /user/change-password` - Change password

### Movie Routes (`/movies`)
- `GET /movies` - Get all movies (public)
- `GET /movies/:id` - Get movie by ID (public)
- `POST /movies` - Create movie (admin only)
- `PUT /movies/:id` - Update movie (admin only)
- `DELETE /movies/:id` - Delete movie (admin only)

### Event Routes (`/events`)
- `GET /events` - Get all events (public)
- `POST /events` - Create event (admin only)

### Venue Routes (`/venues`)
- `GET /venues` - Get all venues (public)
- `POST /venues` - Create venue (admin only)

### Show Routes (`/shows`)
- `GET /shows` - Get all shows (public)
- `GET /shows/:id` - Get show by ID (public)
- `POST /shows` - Create show (admin only)
- `PUT /shows/:id` - Update show (admin only)
- `DELETE /shows/:id` - Delete show (admin only)

### Booking Routes (`/bookings`)
- `POST /bookings` - Create booking
- `GET /bookings` - Get user bookings
- `GET /bookings/:id` - Get booking by ID
- `PUT /bookings/:id/cancel` - Cancel booking
- `POST /bookings/lock-seats` - Lock seats temporarily

### Admin Routes (`/admin`)
- `GET /admin/dashboard` - Get admin dashboard stats
- `GET /admin/users` - Get all users (admin only)
- `GET /admin/bookings` - Get all bookings (admin only)
- `PUT /admin/users/:id/status` - Update user status (admin only)

## 📊 Database Schema

### User Model
- Basic info (name, email, phone)
- Password (hashed with bcrypt)
- Role (user/admin)
- Address and preferences
- Booking history (virtual)

### Movie Model
- Title, description, genre, language
- Cast, crew, director
- Ratings (censor board, IMDB, user)
- Box office data
- Status (upcoming, now-showing, ended)

### Event Model
- Title, description, type, category
- Organizer information
- Date/time, duration, venue
- Pricing and capacity

### Venue Model
- Name, type, address, location
- Capacity and screens
- Amenities and contact info
- Operating hours and ratings

### Show Model
- Links to movie/event and venue
- Date/time, duration, pricing
- Seat layout and availability
- Status and special features

### Booking Model
- User, show, venue references
- Seat selection and pricing
- Payment details and status
- Booking codes and expiry

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

## 🛡️ Security Features

- **Password Validation**: Minimum 8 characters with complexity requirements
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive validation for all inputs
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS**: Cross-origin resource sharing configuration
- **Helmet**: Security headers
- **Error Handling**: Centralized error handling without exposing sensitive info

## 🔄 Seat Locking Mechanism

The system implements a concurrency-safe seat locking mechanism:

1. **Seat Validation**: Checks seat availability before booking
2. **Temporary Locking**: Locks seats for 15 minutes during booking process
3. **Atomic Updates**: Uses MongoDB transactions for seat updates
4. **Automatic Release**: Expired locks are automatically released

## 📈 Scalability Features

- **Database Indexing**: Optimized queries with proper indexes
- **Pagination**: All list endpoints support pagination
- **Modular Architecture**: Separated routes, controllers, and models
- **Error Handling**: Centralized error handling
- **Validation**: Input validation at multiple levels
- **Caching Ready**: Architecture supports easy caching implementation

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment mode | development |
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/bookmyshow |
| JWT_SECRET | JWT secret key | your-super-secret-jwt-key-change-in-production |
| JWT_EXPIRE | JWT expiration time | 7d |
| BCRYPT_SALT_ROUNDS | Password hashing rounds | 12 |
| RATE_LIMIT_WINDOW_MS | Rate limit window | 900000 (15 minutes) |
| RATE_LIMIT_MAX_REQUESTS | Max requests per window | 100 |

## 🚀 Deployment

1. **Set environment variables** for production
2. **Install dependencies**: `npm install --production`
3. **Start the server**: `npm start`
4. **Use PM2** for process management in production

## 🔧 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run create-admin` - Create admin user
- `npm run fix-indexes` - Fix database indexes

## 📞 Support

For support and questions, please contact the development team.

## 📄 License

This project is licensed under the MIT License.

## 🔍 **Check Database and Fix Admin**

### **Step 1: Check What's in the Database**

```bash
mongosh
use bookmyshow
db.users.find({}, {name: 1, email: 1, role: 1, isActive: 1})
```

### **Step 2: Clear and Recreate Admin**

Let's delete any existing admin and create a fresh one:

```bash
mongosh
use bookmyshow
# Delete any existing admin
db.users.deleteOne({ role: "admin" })
# Delete any existing users (optional - if you want a clean start)
db.users.deleteMany({})
```

### **Step 3: Create Fresh Admin**

Now run the admin creation script:

```bash
npm run create-admin
```

### **Step 4: Test Login**

```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@bookmyshow.com",
  "password": "Admin123!"
}
```

## 🔧 **Alternative: Manual Admin Creation**

If the script doesn't work, create admin manually:

```bash
mongosh
use bookmyshow

# Create admin user manually
db.users.insertOne({
  name: "Admin User",
  email: "admin@bookmyshow.com",
  password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK8e", // Admin123!
  phone: "9876543210",
  role: "admin",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

## 🚀 **Quick Fix Commands**

Run these commands in order:

```bash
# 1. Connect to MongoDB and clear users
mongosh
use bookmyshow
db.users.deleteMany({})
exit

# 2. Create fresh admin
npm run create-admin

# 3. Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@bookmyshow.com",
    "password": "Admin123!"
  }'
```

## 📋 **Expected Admin Credentials**

After running `npm run create-admin`, you should have:
- **Email:** `admin@bookmyshow.com`
- **Password:** `Admin123!`

## 🔍 **Debug Steps**

If still not working:

1. **Check if server is running:**
   ```bash
   npm run dev
   ```

2. **Check MongoDB connection:**
   ```bash
   mongosh
   use bookmyshow
   db.users.find().pretty()
   ```

3. **Check server logs** for any errors

Let me know what you see in the database and I'll help you fix it! 🔧 