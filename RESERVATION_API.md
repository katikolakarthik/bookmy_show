# Seat Reservation API Documentation

## Overview

The Seat Reservation API provides a temporary seat holding system with a 5-minute timeout. This prevents users from seeing seats that are temporarily reserved by other users who haven't completed payment yet.

## Features

- **Temporary Seat Reservation**: Reserve seats for 5 minutes
- **Automatic Expiry**: Reservations automatically expire after 5 minutes
- **Real-time Availability**: Shows only truly available seats
- **Convert to Booking**: Convert reservation to actual booking
- **Automatic Cleanup**: Background job cleans expired reservations

## API Endpoints

### 1. Reserve Seats (Temporary Hold)

**POST** `/api/reservations/reserve`

Reserve seats temporarily for 5 minutes. These seats will be hidden from other users during this period.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "showId": "64f8a1b2c3d4e5f6a7b8c9d0",
  "seats": [
    {
      "row": "A",
      "seatNumber": "1"
    },
    {
      "row": "A", 
      "seatNumber": "2"
    }
  ]
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Seats reserved successfully",
  "data": {
    "reservationId": "64f8a1b2c3d4e5f6a7b8c9d1",
    "reservationCode": "RS1698765432123ABC12",
    "seats": [
      {
        "row": "A",
        "seatNumber": "1",
        "seatType": "premium",
        "price": 500
      },
      {
        "row": "A",
        "seatNumber": "2", 
        "seatType": "premium",
        "price": 500
      }
    ],
    "totalAmount": 1000,
    "expiresAt": "2024-01-15T10:30:00.000Z",
    "remainingTime": 300
  }
}
```

**Error Responses:**
- `400`: Invalid request data, seats already reserved, or user has existing reservation
- `404`: Show not found
- `500`: Server error

### 2. Get Available Seats

**GET** `/api/reservations/show/:showId/seats`

Get all available seats for a show, excluding those that are temporarily reserved.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "showId": "64f8a1b2c3d4e5f6a7b8c9d0",
    "availableSeats": [
      {
        "row": "A",
        "seats": [
          {
            "seatNumber": "3",
            "seatType": "premium",
            "status": "available",
            "price": 500
          }
        ]
      }
    ],
    "totalAvailable": 95,
    "totalSeats": 100,
    "reservedSeats": 5
  }
}
```

### 3. Get Reservation Details

**GET** `/api/reservations/:reservationId`

Get details of a specific reservation.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "show": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "dateTime": {
        "start": "2024-01-15T14:00:00.000Z"
      },
      "venue": "64f8a1b2c3d4e5f6a7b8c9d2",
      "screen": {
        "name": "Screen 1",
        "screenType": "2D"
      }
    },
    "user": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "seats": [...],
    "totalAmount": 1000,
    "reservationCode": "RS1698765432123ABC12",
    "status": "active",
    "expiresAt": "2024-01-15T10:30:00.000Z",
    "remainingTime": 180
  }
}
```

**Error Responses:**
- `400`: Reservation expired
- `403`: Not authorized
- `404`: Reservation not found

### 4. Convert Reservation to Booking

**POST** `/api/reservations/:reservationId/convert`

Convert a reservation to an actual booking with payment details.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "paymentMethod": "credit-card",
  "customerDetails": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Reservation converted to booking successfully",
  "data": {
    "bookingId": "64f8a1b2c3d4e5f6a7b8c9d4",
    "bookingCode": "BK1698765432123XYZ45",
    "reservationId": "64f8a1b2c3d4e5f6a7b8c9d1"
  }
}
```

**Error Responses:**
- `400`: Reservation expired or already converted
- `403`: Not authorized
- `404`: Reservation not found

### 5. Cancel Reservation

**DELETE** `/api/reservations/:reservationId`

Cancel a reservation and release the seats.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Reservation cancelled successfully"
}
```

### 6. Clean Expired Reservations (Admin Only)

**POST** `/api/reservations/clean-expired`

Manually trigger cleanup of expired reservations.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Cleaned 3 expired reservations",
  "cleanedCount": 3
}
```

## Workflow Example

### Scenario: User1 reserves 5 seats, User2 tries to see available seats

1. **User1 reserves seats:**
   ```bash
   POST /api/reservations/reserve
   {
     "showId": "show123",
     "seats": [
       {"row": "A", "seatNumber": "1"},
       {"row": "A", "seatNumber": "2"},
       {"row": "A", "seatNumber": "3"},
       {"row": "A", "seatNumber": "4"},
       {"row": "A", "seatNumber": "5"}
     ]
   }
   ```

2. **User2 checks available seats:**
   ```bash
   GET /api/reservations/show/show123/seats
   ```
   
   **Response:** Seats A1-A5 are not in the available seats list

3. **After 5 minutes (if User1 doesn't complete booking):**
   - Seats A1-A5 automatically become available again
   - User2 can now see and book these seats

4. **If User1 completes booking within 5 minutes:**
   ```bash
   POST /api/reservations/reservation123/convert
   {
     "paymentMethod": "credit-card",
     "customerDetails": {...}
   }
   ```
   
   - Seats A1-A5 are permanently booked
   - User2 cannot book these seats

## Database Schema

### SeatReservation Model

```javascript
{
  show: ObjectId,           // Reference to Show
  user: ObjectId,           // Reference to User
  seats: [{                 // Array of reserved seats
    row: String,
    seatNumber: String,
    seatType: String,
    price: Number
  }],
  totalAmount: Number,
  reservationCode: String,  // Unique code
  status: String,           // 'active', 'expired', 'converted', 'cancelled'
  expiresAt: Date,          // 5 minutes from creation
  convertedToBooking: ObjectId  // Reference to Booking (if converted)
}
```

## Automatic Cleanup

- **Frequency**: Every 5 minutes
- **Action**: Marks expired reservations as 'expired'
- **TTL Index**: MongoDB automatically removes expired documents
- **Manual Trigger**: Available via admin endpoint

## Error Handling

### Common Error Scenarios

1. **Seat Already Reserved:**
   ```json
   {
     "error": "Seat A1 is temporarily reserved"
   }
   ```

2. **Reservation Expired:**
   ```json
   {
     "error": "Reservation has expired. Please select seats again.",
     "expired": true
   }
   ```

3. **User Has Existing Reservation:**
   ```json
   {
     "error": "You already have an active reservation for this show. Please complete your booking first."
   }
   ```

## Best Practices

1. **Frontend Implementation:**
   - Poll available seats every 30 seconds
   - Show countdown timer for user's own reservations
   - Disable seat selection for reserved seats

2. **Error Handling:**
   - Handle expired reservations gracefully
   - Provide clear error messages to users
   - Implement retry logic for failed requests

3. **Performance:**
   - Use indexes on frequently queried fields
   - Implement caching for show data
   - Monitor reservation cleanup job

## Testing

### Test Scenarios

1. **Reserve seats and verify they're hidden from other users**
2. **Wait 5 minutes and verify seats become available again**
3. **Convert reservation to booking and verify seats are permanently booked**
4. **Test concurrent reservations for same seats**
5. **Verify cleanup job removes expired reservations**

### Sample Test Data

```javascript
// Create test show with 100 seats
const show = {
  totalSeats: 100,
  availableSeats: 100,
  seatLayout: {
    rows: 10,
    columns: 10,
    layout: [
      {
        row: "A",
        seats: Array.from({length: 10}, (_, i) => ({
          seatNumber: String(i + 1),
          seatType: "premium",
          status: "available",
          price: 500
        }))
      }
      // ... more rows
    ]
  }
};
``` 