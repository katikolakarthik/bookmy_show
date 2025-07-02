# BookMyShow Backend API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 🔐 Authentication Routes (`/api/auth`)

### 1. Register User
**POST** `/api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123!",
  "phone": "9876543210",
  "dateOfBirth": "1990-01-15"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "9876543210",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Login User
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "9876543210",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Get Current User Profile
**GET** `/api/auth/me` *(Requires Authentication)*

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "9876543210",
    "dateOfBirth": "1990-01-15T00:00:00.000Z",
    "role": "user",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 4. Update Profile
**PUT** `/api/auth/profile` *(Requires Authentication)*

**Request Body:**
```json
{
  "name": "John Smith",
  "phone": "9876543211",
  "dateOfBirth": "1990-01-20"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "John Smith",
    "email": "john.doe@example.com",
    "phone": "9876543211",
    "dateOfBirth": "1990-01-20T00:00:00.000Z",
    "role": "user"
  }
}
```

### 5. Change Password
**PUT** `/api/auth/change-password` *(Requires Authentication)*

**Request Body:**
```json
{
  "currentPassword": "SecurePass123!",
  "newPassword": "NewSecurePass456!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### 6. Logout
**POST** `/api/auth/logout` *(Requires Authentication)*

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### 7. Create Admin (Special Route)
**POST** `/api/auth/create-admin`

**Request Body:**
```json
{
  "name": "Admin User",
  "email": "admin@bookmyshow.com",
  "password": "AdminPass123!",
  "phone": "9876543210",
  "adminSecret": "bookmyshow2024"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Admin user created successfully",
  "data": {
    "user": {
      "id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "name": "Admin User",
      "email": "admin@bookmyshow.com",
      "phone": "9876543210",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 🎬 Movie Routes (`/api/movies`)

### 1. Get All Movies
**GET** `/api/movies`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by title
- `genre` (optional): Filter by genre
- `year` (optional): Filter by year

**Response:**
```json
{
  "success": true,
  "count": 2,
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "pages": 1
  },
  "data": [
    {
      "id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "title": "Inception",
      "description": "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
      "duration": 148,
      "releaseDate": "2010-07-16T00:00:00.000Z",
      "director": "Christopher Nolan",
      "poster": "https://example.com/inception-poster.jpg",
      "rating": {
        "censorBoard": "UA",
        "imdb": 8.8
      },
      "productionHouse": "Warner Bros.",
      "year": 2010,
      "genre": ["Sci-Fi", "Action", "Thriller"],
      "cast": ["Leonardo DiCaprio", "Joseph Gordon-Levitt"],
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### 2. Get Single Movie
**GET** `/api/movies/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "title": "Inception",
    "description": "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    "duration": 148,
    "releaseDate": "2010-07-16T00:00:00.000Z",
    "director": "Christopher Nolan",
    "poster": "https://example.com/inception-poster.jpg",
    "rating": {
      "censorBoard": "UA",
      "imdb": 8.8
    },
    "productionHouse": "Warner Bros.",
    "year": 2010,
    "genre": ["Sci-Fi", "Action", "Thriller"],
    "cast": ["Leonardo DiCaprio", "Joseph Gordon-Levitt"],
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 3. Create Movie (Admin Only)
**POST** `/api/movies` *(Requires Admin Authentication)*

**Request Body:**
```json
{
  "title": "The Dark Knight",
  "description": "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
  "duration": 152,
  "releaseDate": "2008-07-18T00:00:00.000Z",
  "director": "Christopher Nolan",
  "poster": "https://example.com/dark-knight-poster.jpg",
  "rating": {
    "censorBoard": "UA"
  },
  "productionHouse": "Warner Bros.",
  "year": 2008,
  "genre": ["Action", "Crime", "Drama"],
  "cast": ["Christian Bale", "Heath Ledger", "Aaron Eckhart"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Movie created successfully",
  "data": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b4",
    "title": "The Dark Knight",
    "description": "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    "duration": 152,
    "releaseDate": "2008-07-18T00:00:00.000Z",
    "director": "Christopher Nolan",
    "poster": "https://example.com/dark-knight-poster.jpg",
    "rating": {
      "censorBoard": "UA"
    },
    "productionHouse": "Warner Bros.",
    "year": 2008,
    "genre": ["Action", "Crime", "Drama"],
    "cast": ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 4. Update Movie (Admin Only)
**PUT** `/api/movies/:id` *(Requires Admin Authentication)*

**Request Body:**
```json
{
  "title": "The Dark Knight Rises",
  "duration": 164,
  "year": 2012
}
```

**Response:**
```json
{
  "success": true,
  "message": "Movie updated successfully",
  "data": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b4",
    "title": "The Dark Knight Rises",
    "description": "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    "duration": 164,
    "releaseDate": "2008-07-18T00:00:00.000Z",
    "director": "Christopher Nolan",
    "poster": "https://example.com/dark-knight-poster.jpg",
    "rating": {
      "censorBoard": "UA"
    },
    "productionHouse": "Warner Bros.",
    "year": 2012,
    "genre": ["Action", "Crime", "Drama"],
    "cast": ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 5. Delete Movie (Admin Only)
**DELETE** `/api/movies/:id` *(Requires Admin Authentication)*

**Response:**
```json
{
  "success": true,
  "message": "Movie deleted successfully"
}
```

---

## 🏟️ Venue Routes (`/api/venues`)

### 1. Get All Venues
**GET** `/api/venues`

**Response:**
```json
{
  "success": true,
  "message": "Venue routes - implementation pending"
}
```

### 2. Create Venue (Admin Only)
**POST** `/api/venues` *(Requires Admin Authentication)*

**Request Body:**
```json
{
  "name": "PVR Cinemas - Forum Mall",
  "type": "theater",
  "address": {
    "street": "Forum Mall, Koramangala",
    "city": "Bangalore",
    "state": "Karnataka",
    "zipCode": "560034"
  },
  "location": {
    "coordinates": [77.5946, 12.9716]
  },
  "capacity": 200,
  "contactInfo": {
    "phone": "080-12345678",
    "email": "pvr.forum@example.com"
  },
  "amenities": ["Dolby Atmos", "Recliner Seats", "Food Service"],
  "screens": [
    {
      "name": "Screen 1",
      "capacity": 100,
      "features": ["4K", "Dolby Atmos"]
    },
    {
      "name": "Screen 2",
      "capacity": 100,
      "features": ["3D", "Dolby Digital"]
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b5",
    "name": "PVR Cinemas - Forum Mall",
    "type": "theater",
    "address": {
      "street": "Forum Mall, Koramangala",
      "city": "Bangalore",
      "state": "Karnataka",
      "zipCode": "560034"
    },
    "location": {
      "coordinates": [77.5946, 12.9716]
    },
    "capacity": 200,
    "contactInfo": {
      "phone": "080-12345678",
      "email": "pvr.forum@example.com"
    },
    "amenities": ["Dolby Atmos", "Recliner Seats", "Food Service"],
    "screens": [
      {
        "name": "Screen 1",
        "capacity": 100,
        "features": ["4K", "Dolby Atmos"]
      },
      {
        "name": "Screen 2",
        "capacity": 100,
        "features": ["3D", "Dolby Digital"]
      }
    ],
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## 🎭 Event Routes (`/api/events`)

### 1. Get All Events
**GET** `/api/events`

**Response:**
```json
{
  "success": true,
  "message": "Event routes - implementation pending"
}
```

### 2. Create Event (Admin Only)
**POST** `/api/events` *(Requires Admin Authentication)*

**Request Body:**
```json
{
  "title": "Rock Concert 2024",
  "description": "An amazing rock concert featuring top artists from around the world. Get ready for an unforgettable musical experience!",
  "type": "concert",
  "category": "entertainment",
  "organizer": {
    "name": "Music Events Ltd",
    "email": "info@musicevents.com",
    "phone": "9876543210"
  },
  "venue": "60f7b3b3b3b3b3b3b3b3b3b5",
  "dateTime": {
    "start": "2024-02-15T19:00:00.000Z",
    "end": "2024-02-15T23:00:00.000Z"
  },
  "duration": 240,
  "poster": "https://example.com/rock-concert-poster.jpg",
  "ticketPricing": [
    {
      "category": "VIP",
      "price": 5000,
      "benefits": ["Front Row", "Meet & Greet", "Exclusive Merchandise"]
    },
    {
      "category": "Premium",
      "price": 3000,
      "benefits": ["Premium Seating", "Complimentary Refreshments"]
    },
    {
      "category": "General",
      "price": 1500,
      "benefits": ["Standard Seating"]
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b6",
    "title": "Rock Concert 2024",
    "description": "An amazing rock concert featuring top artists from around the world. Get ready for an unforgettable musical experience!",
    "type": "concert",
    "category": "entertainment",
    "organizer": {
      "name": "Music Events Ltd",
      "email": "info@musicevents.com",
      "phone": "9876543210"
    },
    "venue": "60f7b3b3b3b3b3b3b3b3b3b5",
    "dateTime": {
      "start": "2024-02-15T19:00:00.000Z",
      "end": "2024-02-15T23:00:00.000Z"
    },
    "duration": 240,
    "poster": "https://example.com/rock-concert-poster.jpg",
    "ticketPricing": [
      {
        "category": "VIP",
        "price": 5000,
        "benefits": ["Front Row", "Meet & Greet", "Exclusive Merchandise"]
      },
      {
        "category": "Premium",
        "price": 3000,
        "benefits": ["Premium Seating", "Complimentary Refreshments"]
      },
      {
        "category": "General",
        "price": 1500,
        "benefits": ["Standard Seating"]
      }
    ],
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## 🎫 Show Routes (`/api/shows`)

### 1. Get All Shows
**GET** `/api/shows`

**Query Parameters:**
- `movie` (optional): Filter by movie ID
- `event` (optional): Filter by event ID
- `venue` (optional): Filter by venue ID
- `date` (optional): Filter by date (YYYY-MM-DD)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "60f7b3b3b3b3b3b3b3b3b3b7",
      "venue": {
        "id": "60f7b3b3b3b3b3b3b3b3b3b5",
        "name": "PVR Cinemas - Forum Mall"
      },
      "movie": {
        "id": "60f7b3b3b3b3b3b3b3b3b3b3",
        "title": "Inception",
        "poster": "https://example.com/inception-poster.jpg"
      },
      "dateTime": {
        "start": "2024-01-20T14:00:00.000Z",
        "end": "2024-01-20T16:28:00.000Z"
      },
      "duration": 148,
      "totalSeats": 100,
      "availableSeats": 85,
      "language": "English",
      "showType": "movie",
      "pricing": {
        "premium": 500,
        "executive": 350,
        "economy": 250
      },
      "screen": "Screen 1",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### 2. Get Single Show
**GET** `/api/shows/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b7",
    "venue": {
      "id": "60f7b3b3b3b3b3b3b3b3b3b5",
      "name": "PVR Cinemas - Forum Mall",
      "address": {
        "street": "Forum Mall, Koramangala",
        "city": "Bangalore",
        "state": "Karnataka"
      }
    },
    "movie": {
      "id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "title": "Inception",
      "poster": "https://example.com/inception-poster.jpg",
      "duration": 148
    },
    "dateTime": {
      "start": "2024-01-20T14:00:00.000Z",
      "end": "2024-01-20T16:28:00.000Z"
    },
    "duration": 148,
    "totalSeats": 100,
    "availableSeats": 85,
    "language": "English",
    "showType": "movie",
    "pricing": {
      "premium": 500,
      "executive": 350,
      "economy": 250
    },
    "screen": "Screen 1",
    "seatLayout": {
      "rows": ["A", "B", "C", "D", "E"],
      "seatsPerRow": 20,
      "premiumRows": ["A", "B"],
      "executiveRows": ["C", "D"],
      "economyRows": ["E"]
    },
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 3. Create Show (Admin Only)
**POST** `/api/shows` *(Requires Admin Authentication)*

**Request Body:**
```json
{
  "venue": "60f7b3b3b3b3b3b3b3b3b3b5",
  "movie": "60f7b3b3b3b3b3b3b3b3b3b3",
  "dateTime": {
    "start": "2024-01-25T18:00:00.000Z",
    "end": "2024-01-25T20:28:00.000Z"
  },
  "duration": 148,
  "totalSeats": 100,
  "availableSeats": 100,
  "language": "English",
  "showType": "movie",
  "pricing": {
    "premium": 500,
    "executive": 350,
    "economy": 250
  },
  "screen": "Screen 1"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b8",
    "venue": "60f7b3b3b3b3b3b3b3b3b3b5",
    "movie": "60f7b3b3b3b3b3b3b3b3b3b3",
    "dateTime": {
      "start": "2024-01-25T18:00:00.000Z",
      "end": "2024-01-25T20:28:00.000Z"
    },
    "duration": 148,
    "totalSeats": 100,
    "availableSeats": 100,
    "language": "English",
    "showType": "movie",
    "pricing": {
      "premium": 500,
      "executive": 350,
      "economy": 250
    },
    "screen": "Screen 1",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 4. Update Show (Admin Only)
**PUT** `/api/shows/:id` *(Requires Admin Authentication)*

**Request Body:**
```json
{
  "dateTime": {
    "start": "2024-01-25T19:00:00.000Z",
    "end": "2024-01-25T21:28:00.000Z"
  },
  "pricing": {
    "premium": 550,
    "executive": 400,
    "economy": 300
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b8",
    "venue": "60f7b3b3b3b3b3b3b3b3b3b5",
    "movie": "60f7b3b3b3b3b3b3b3b3b3b3",
    "dateTime": {
      "start": "2024-01-25T19:00:00.000Z",
      "end": "2024-01-25T21:28:00.000Z"
    },
    "duration": 148,
    "totalSeats": 100,
    "availableSeats": 100,
    "language": "English",
    "showType": "movie",
    "pricing": {
      "premium": 550,
      "executive": 400,
      "economy": 300
    },
    "screen": "Screen 1",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 5. Delete Show (Admin Only)
**DELETE** `/api/shows/:id` *(Requires Admin Authentication)*

**Response:**
```json
{
  "success": true,
  "message": "Show deleted"
}
```

---

## 🎟️ Booking Routes (`/api/bookings`)

### 1. Create Booking
**POST** `/api/bookings` *(Requires Authentication)*

**Request Body:**
```json
{
  "showId": "60f7b3b3b3b3b3b3b3b3b3b7",
  "seats": [
    {
      "row": "A",
      "seatNumber": "5",
      "seatType": "premium",
      "price": 500
    },
    {
      "row": "A",
      "seatNumber": "6",
      "seatType": "premium",
      "price": 500
    }
  ],
  "paymentMethod": "credit-card",
  "customerDetails": {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "9876543210"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b9",
    "user": "60f7b3b3b3b3b3b3b3b3b3b3",
    "show": {
      "id": "60f7b3b3b3b3b3b3b3b3b3b7",
      "movie": {
        "title": "Inception",
        "poster": "https://example.com/inception-poster.jpg"
      },
      "venue": {
        "name": "PVR Cinemas - Forum Mall"
      },
      "dateTime": {
        "start": "2024-01-20T14:00:00.000Z"
      }
    },
    "seats": [
      {
        "row": "A",
        "seatNumber": "5",
        "seatType": "premium",
        "price": 500
      },
      {
        "row": "A",
        "seatNumber": "6",
        "seatType": "premium",
        "price": 500
      }
    ],
    "totalAmount": 1000,
    "paymentMethod": "credit-card",
    "paymentStatus": "pending",
    "bookingStatus": "confirmed",
    "customerDetails": {
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "9876543210"
    },
    "bookingCode": "BMS20240115001",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 2. Get User Bookings
**GET** `/api/bookings` *(Requires Authentication)*

**Query Parameters:**
- `status` (optional): Filter by booking status
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response:**
```json
{
  "success": true,
  "count": 2,
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "pages": 1
  },
  "data": [
    {
      "id": "60f7b3b3b3b3b3b3b3b3b3b9",
      "show": {
        "id": "60f7b3b3b3b3b3b3b3b3b3b7",
        "movie": {
          "title": "Inception",
          "poster": "https://example.com/inception-poster.jpg"
        },
        "venue": {
          "name": "PVR Cinemas - Forum Mall"
        },
        "dateTime": {
          "start": "2024-01-20T14:00:00.000Z"
        }
      },
      "seats": [
        {
          "row": "A",
          "seatNumber": "5",
          "seatType": "premium",
          "price": 500
        }
      ],
      "totalAmount": 500,
      "paymentStatus": "completed",
      "bookingStatus": "confirmed",
      "bookingCode": "BMS20240115001",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### 3. Get Single Booking
**GET** `/api/bookings/:id` *(Requires Authentication)*

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b9",
    "user": {
      "id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "name": "John Doe",
      "email": "john.doe@example.com"
    },
    "show": {
      "id": "60f7b3b3b3b3b3b3b3b3b3b7",
      "movie": {
        "title": "Inception",
        "poster": "https://example.com/inception-poster.jpg",
        "duration": 148
      },
      "venue": {
        "name": "PVR Cinemas - Forum Mall",
        "address": {
          "street": "Forum Mall, Koramangala",
          "city": "Bangalore"
        }
      },
      "dateTime": {
        "start": "2024-01-20T14:00:00.000Z",
        "end": "2024-01-20T16:28:00.000Z"
      },
      "language": "English",
      "screen": "Screen 1"
    },
    "seats": [
      {
        "row": "A",
        "seatNumber": "5",
        "seatType": "premium",
        "price": 500
      },
      {
        "row": "A",
        "seatNumber": "6",
        "seatType": "premium",
        "price": 500
      }
    ],
    "totalAmount": 1000,
    "paymentMethod": "credit-card",
    "paymentStatus": "completed",
    "bookingStatus": "confirmed",
    "customerDetails": {
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "9876543210"
    },
    "bookingCode": "BMS20240115001",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 4. Cancel Booking
**PUT** `/api/bookings/:id/cancel` *(Requires Authentication)*

**Request Body:**
```json
{
  "reason": "Change of plans"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking cancelled successfully",
  "data": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b9",
    "bookingStatus": "cancelled",
    "cancellationReason": "Change of plans",
    "refundAmount": 1000,
    "cancelledAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 5. Lock Seats
**POST** `/api/bookings/lock-seats` *(Requires Authentication)*

**Request Body:**
```json
{
  "showId": "60f7b3b3b3b3b3b3b3b3b3b7",
  "seats": [
    {
      "row": "A",
      "seatNumber": "5"
    },
    {
      "row": "A",
      "seatNumber": "6"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Seats locked successfully",
  "data": {
    "lockId": "lock_60f7b3b3b3b3b3b3b3b3b3b9",
    "seats": [
      {
        "row": "A",
        "seatNumber": "5",
        "seatType": "premium",
        "price": 500
      },
      {
        "row": "A",
        "seatNumber": "6",
        "seatType": "premium",
        "price": 500
      }
    ],
    "totalAmount": 1000,
    "lockExpiresAt": "2024-01-15T10:35:00.000Z"
  }
}
```

---

## 👤 User Routes (`/api/user`)

### 1. Get User Profile
**GET** `/api/user/profile` *(Requires Authentication)*

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "9876543210",
    "dateOfBirth": "1990-01-15T00:00:00.000Z",
    "role": "user",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 2. Update User Profile
**PUT** `/api/user/profile` *(Requires Authentication)*

**Request Body:**
```json
{
  "name": "John Smith",
  "phone": "9876543211"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "John Smith",
    "email": "john.doe@example.com",
    "phone": "9876543211",
    "dateOfBirth": "1990-01-15T00:00:00.000Z",
    "role": "user",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 3. Change Password
**PUT** `/api/user/change-password` *(Requires Authentication)*

**Request Body:**
```json
{
  "currentPassword": "SecurePass123!",
  "newPassword": "NewSecurePass456!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## 🔧 Admin Routes (`/api/admin`)

### 1. Get Dashboard Stats
**GET** `/api/admin/dashboard` *(Requires Admin Authentication)*

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 1250,
    "totalMovies": 45,
    "totalEvents": 12,
    "totalVenues": 8,
    "totalBookings": 3450,
    "revenue": 1250000,
    "activeShows": 23,
    "recentBookings": [
      {
        "id": "60f7b3b3b3b3b3b3b3b3b3b9",
        "user": "John Doe",
        "amount": 1000,
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "topMovies": [
      {
        "title": "Inception",
        "bookings": 150,
        "revenue": 75000
      }
    ]
  }
}
```

### 2. Get All Users
**GET** `/api/admin/users` *(Requires Admin Authentication)*

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `role` (optional): Filter by user role
- `status` (optional): Filter by user status

**Response:**
```json
{
  "success": true,
  "message": "User management - implementation pending"
}
```

### 3. Get All Bookings
**GET** `/api/admin/bookings` *(Requires Admin Authentication)*

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `status` (optional): Filter by booking status
- `date` (optional): Filter by date

**Response:**
```json
{
  "success": true,
  "message": "Booking management - implementation pending"
}
```

### 4. Update User Status
**PUT** `/api/admin/users/:id/status` *(Requires Admin Authentication)*

**Request Body:**
```json
{
  "status": "suspended",
  "reason": "Violation of terms of service"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User status update - implementation pending"
}
```

---

## 🏥 Health Check

### Health Check
**GET** `/health`

**Response:**
```json
{
  "status": "success",
  "message": "BookMyShow Backend is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development"
}
```

### Root Endpoint
**GET** `/`

**Response:**
```json
{
  "status": "success",
  "message": "BookMyShow Backend API",
  "version": "1.0.0",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 📝 Error Responses

### Validation Error
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters"
    }
  ]
}
```

### Authentication Error
```json
{
  "success": false,
  "error": "Not authorized to access this route"
}
```

### Not Found Error
```json
{
  "success": false,
  "error": "Resource not found"
}
```

### Server Error
```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## 🔐 Authentication & Authorization

### JWT Token Format
```
Authorization: Bearer <jwt-token>
```

### User Roles
- `user`: Regular user with booking capabilities
- `admin`: Administrator with full access

### Protected Routes
- All routes under `/api/user/*` require authentication
- All routes under `/api/admin/*` require admin authentication
- Booking routes require authentication
- Movie/Event/Venue creation/update/delete require admin authentication

---

## 📊 Rate Limiting

- **Limit**: 100 requests per 15 minutes per IP
- **Headers**: Rate limit information is included in response headers
- **Exceeded Response**:
```json
{
  "error": "Too many requests from this IP, please try again later."
}
```

---

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Setup**:
   - Copy `env.example` to `config.env`
   - Update MongoDB URI and other configurations

3. **Create Admin User**:
   ```bash
   node create-admin.js
   ```

4. **Start Server**:
   ```bash
   npm start
   ```

5. **API Base URL**: `http://localhost:5000/api`

---

## 📋 Notes

- All timestamps are in ISO 8601 format
- MongoDB ObjectIds are used for all IDs
- File uploads are handled via URLs (external storage)
- Payment processing is handled externally
- Seat locking has a 5-minute expiration
- Booking codes are auto-generated with format: `BMS<YYYYMMDD><SEQUENCE>` 