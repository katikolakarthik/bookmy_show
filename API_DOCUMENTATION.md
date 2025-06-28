# BookMyShow API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Health Check
```http
GET /health
```

## Endpoints

### Authentication (`/auth`)

#### Register User
```http
POST /auth/register
```
**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "phone": "9876543210",
  "dateOfBirth": "1990-01-01"
}
```

#### Login User
```http
POST /auth/login
```
**Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### Create Admin User
```http
POST /auth/create-admin
```
**Body:**
```json
{
  "name": "Admin User",
  "email": "admin@bookmyshow.com",
  "password": "Admin123!",
  "phone": "9876543210",
  "adminSecret": "bookmyshow2024"
}
```

#### Get Profile
```http
GET /auth/me
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /auth/profile
Authorization: Bearer <token>
```
**Body:**
```json
{
  "name": "John Doe Updated",
  "phone": "9876543211",
  "dateOfBirth": "1990-01-01"
}
```

#### Change Password
```http
PUT /auth/change-password
Authorization: Bearer <token>
```
**Body:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass123!"
}
```

#### Logout
```http
POST /auth/logout
Authorization: Bearer <token>
```

### User Routes (`/user`)

#### Get User Profile
```http
GET /user/profile
Authorization: Bearer <token>
```

#### Update User Profile
```http
PUT /user/profile
Authorization: Bearer <token>
```
**Body:**
```json
{
  "name": "John Doe Updated",
  "phone": "9876543211",
  "dateOfBirth": "1990-01-01"
}
```

#### Change Password
```http
PUT /user/change-password
Authorization: Bearer <token>
```
**Body:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass123!"
}
```

### Movies (`/movies`)

#### Get All Movies
```http
GET /movies?search=avengers&genre=action&page=1&limit=10
```

#### Get Movie by ID
```http
GET /movies/:id
```

#### Create Movie (Admin)
```http
POST /movies
Authorization: Bearer <admin-token>
```
**Body:**
```json
{
  "title": "Avengers: Endgame",
  "description": "After the devastating events of Avengers: Infinity War...",
  "genre": ["action", "adventure", "sci-fi"],
  "language": ["english"],
  "duration": 181,
  "releaseDate": "2019-04-26",
  "director": "Anthony Russo",
  "cast": [
    {"name": "Robert Downey Jr.", "role": "Iron Man"},
    {"name": "Chris Evans", "role": "Captain America"}
  ],
  "poster": "https://example.com/poster.jpg",
  "rating": {
    "censorBoard": "UA"
  },
  "productionHouse": "Marvel Studios",
  "year": 2019
}
```

#### Update Movie (Admin)
```http
PUT /movies/:id
Authorization: Bearer <admin-token>
```
**Body:** Same as Create Movie

#### Delete Movie (Admin)
```http
DELETE /movies/:id
Authorization: Bearer <admin-token>
```

### Events (`/events`)

#### Get All Events
```http
GET /events
```

#### Create Event (Admin)
```http
POST /events
Authorization: Bearer <admin-token>
```
**Body:**
```json
{
  "title": "Rock Concert 2024",
  "description": "An amazing rock concert featuring top artists",
  "type": "concert",
  "category": "entertainment",
  "organizer": {
    "name": "Event Organizers Inc",
    "email": "contact@eventorganizers.com",
    "phone": "9876543210"
  },
  "venue": "venue-id-here",
  "dateTime": {
    "start": "2024-12-25T19:00:00.000Z",
    "end": "2024-12-25T23:00:00.000Z"
  },
  "duration": 240,
  "poster": "https://example.com/event-poster.jpg"
}
```

### Venues (`/venues`)

#### Get All Venues
```http
GET /venues
```

#### Create Venue (Admin)
```http
POST /venues
Authorization: Bearer <admin-token>
```
**Body:**
```json
{
  "name": "Cineplex Multiplex",
  "type": "theater",
  "address": {
    "street": "123 Cinema Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001",
    "country": "India"
  },
  "location": {
    "coordinates": [72.8777, 19.0760]
  },
  "capacity": 500,
  "contactInfo": {
    "phone": "9876543210",
    "email": "info@cineplex.com"
  }
}
```

### Shows (`/shows`)

#### Get All Shows
```http
GET /shows
```

#### Get Show by ID
```http
GET /shows/:id
```

#### Create Show (Admin)
```http
POST /shows
Authorization: Bearer <admin-token>
```
**Body:**
```json
{
  "venue": "venue-id-here",
  "movie": "movie-id-here",
  "event": "event-id-here",
  "dateTime": {
    "start": "2024-12-25T19:00:00.000Z",
    "end": "2024-12-25T22:00:00.000Z"
  },
  "duration": 180,
  "totalSeats": 100,
  "availableSeats": 100,
  "language": "english",
  "showType": "movie"
}
```

#### Update Show (Admin)
```http
PUT /shows/:id
Authorization: Bearer <admin-token>
```
**Body:** Same as Create Show

#### Delete Show (Admin)
```http
DELETE /shows/:id
Authorization: Bearer <admin-token>
```

### Bookings (`/bookings`)

#### Create Booking
```http
POST /bookings
Authorization: Bearer <token>
```
**Body:**
```json
{
  "showId": "show-id-here",
  "seats": [
    {
      "row": "A",
      "seatNumber": "1",
      "seatType": "premium",
      "price": 500
    }
  ],
  "paymentMethod": "credit-card",
  "customerDetails": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210"
  }
}
```

#### Get User Bookings
```http
GET /bookings?page=1&limit=10&status=confirmed
Authorization: Bearer <token>
```

#### Get Booking by ID
```http
GET /bookings/:id
Authorization: Bearer <token>
```

#### Cancel Booking
```http
PUT /bookings/:id/cancel
Authorization: Bearer <token>
```
**Body:**
```json
{
  "reason": "Change of plans"
}
```

#### Lock Seats
```http
POST /bookings/lock-seats
Authorization: Bearer <token>
```
**Body:**
```json
{
  "showId": "show-id-here",
  "seats": [
    {
      "row": "A",
      "seatNumber": "1"
    }
  ]
}
```

### Admin (`/admin`)

#### Dashboard Stats
```http
GET /admin/dashboard
Authorization: Bearer <admin-token>
```

#### Get All Users
```http
GET /admin/users
Authorization: Bearer <admin-token>
```

#### Get All Bookings
```http
GET /admin/bookings
Authorization: Bearer <admin-token>
```

#### Update User Status
```http
PUT /admin/users/:id/status
Authorization: Bearer <admin-token>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

### Paginated Response
```json
{
  "success": true,
  "count": 10,
  "total": 100,
  "pagination": {
    "page": 1,
    "limit": 10,
    "pages": 10
  },
  "data": [
    // Array of items
  ]
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Validation Rules

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### Phone Number
- Must be 10 digits

### Email
- Must be valid email format

### Movie/Event Titles
- 1-100 characters

### Descriptions
- 10-1000 characters

### Seat Types
- Valid options: premium, executive, economy, balcony, box, vip

### Payment Methods
- Valid options: credit-card, debit-card, upi, net-banking, wallet, cash

### Event Types
- Valid options: concert, play, comedy, dance, sports, conference, workshop, exhibition, festival, other

### Event Categories
- Valid options: entertainment, sports, business, education, cultural, religious, social

### Venue Types
- Valid options: theater, auditorium, stadium, conference-hall, outdoor

### Censor Board Ratings
- Valid options: U, UA, A, S

## Error Handling

The API returns consistent error responses with appropriate HTTP status codes:

- `400` - Validation errors, bad request
- `401` - Authentication required
- `403` - Insufficient permissions
- `404` - Resource not found
- `500` - Internal server error

## Rate Limiting

The API implements rate limiting:
- 100 requests per 15 minutes per IP address
- Rate limit headers included in responses
- Custom error message for exceeded limits

## Security Headers

The API includes security headers via Helmet:
- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Strict-Transport-Security (in production) 