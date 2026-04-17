# QRFlow Arena — Smart Venue Crowd and Demand Management System

## Project Overview

**Project Name:** QRFlow Arena  
**Project Type:** Full-stack Progressive Web Application  
**Core Functionality:** AI-driven crowd and demand management system for large-scale sporting venues that optimizes crowd movement, reduces waiting times, and provides real-time services including food ordering and vendor coordination.  
**Target Users:** Venue attendees, vendors/staff, and venue administrators

---

## Technical Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **PWA:** Workbox for service worker, manifest.json
- **State Management:** Redux Toolkit with RTK Query
- **Styling:** CSS Modules with CSS Variables
- **Maps:** Google Maps JavaScript API
- **Charts:** Recharts for analytics

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js with TypeScript
- **Database:** Firebase Firestore
- **Authentication:** Firebase Auth (JWT)
- **Real-time:** Firebase Realtime Database
- **Cloud Functions:** Google Cloud Functions
- **Payments:** Google Pay API

### AI/Analytics
- **Prediction:** TensorFlow.js for client-side, Python backend models
- **Analytics:** Google BigQuery
- **Notifications:** Firebase Cloud Messaging

---

## UI/UX Specification

### Color Palette
- **Primary:** `#0D1B2A` (Deep Navy)
- **Secondary:** `#1B263B` (Dark Blue)
- **Accent:** `#E0A458` (Golden Amber)
- **Success:** `#2EC4B6` (Teal)
- **Warning:** `#F77F00` (Orange)
- **Danger:** `#D62828` (Red)
- **Background:** `#0D1B2A`
- **Surface:** `#1B263B`
- **Text Primary:** `#FFFFFF`
- **Text Secondary:** `#A0AEC0`
- **Border:** `#2D3748`

### Typography
- **Primary Font:** "Outfit", sans-serif
- **Secondary Font:** "JetBrains Mono", monospace
- **Heading 1:** 2.5rem, 700 weight
- **Heading 2:** 2rem, 600 weight
- **Heading 3:** 1.5rem, 600 weight
- **Body:** 1rem, 400 weight
- **Caption:** 0.875rem, 400 weight

### Spacing System
- **xs:** 4px
- **sm:** 8px
- **md:** 16px
- **lg:** 24px
- **xl:** 32px
- **2xl:** 48px
- **3xl:** 64px

### Responsive Breakpoints
- **Mobile:** 320px - 767px
- **Tablet:** 768px - 1023px
- **Desktop:** 1024px+

---

## Page Specifications

### 1. QR Login Page
- Full-screen centered card
- QR code scanner using device camera
- Manual ticket entry option
- Venue selection dropdown
- Animated background with venue particles

### 2. Ticket Upload Interface
- Drag-and-drop file upload zone
- Camera capture option
- Ticket validation status
- Seat information form
- Confirmation modal

### 3. Live Venue Map
- Interactive Google Maps integration
- Zone-based heatmap overlay
- Real-time crowd density indicators
- Vendor location markers
- Navigation waypoints

### 4. Food Ordering Interface
- Category-based menu grid
- Cart sidebar/bottom sheet
- Payment integration
- Delivery status tracking
- Estimated wait time

### 5. Navigation Screen
- Turn-by-turn directions
- Alternative route suggestions
- Crowd level indicators per route
- Accessibility options
- Emergency exit highlights

### 6. Notifications Panel
- Alert list with timestamps
- Crowd warnings
- Order status updates
- Emergency broadcasts
- Mark as read functionality

### 7. Admin Dashboard
- Dark theme analytics panels
- Real-time heatmap visualization
- Vendor tracking map
- Sales charts (line, bar, pie)
- Emergency broadcast controls

### 8. Vendor Interface
- Order queue management
- Order assignment system
- Navigation to delivery point
- Demand alerts panel
- Performance metrics

---

## Component Library

### Buttons
- Primary: Golden amber background, navy text
- Secondary: Transparent with border
- Danger: Red background
- States: hover (lighten 10%), active (darken 5%), disabled (50% opacity)

### Cards
- Surface background with subtle border
- 16px border-radius
- Shadow: 0 4px 6px rgba(0,0,0,0.3)
- Hover: translateY(-2px), increased shadow

### Inputs
- Dark background (#1B263B)
- Border: #2D3748, focus: #E0A458
- 8px border-radius
- Label above, error message below

### Modals
- Centered overlay
- Backdrop blur effect
- Slide-up animation on mobile
- Scale animation on desktop

### Maps
- Custom dark-themed map style
- Heatmap gradient: green → yellow → orange → red
- Clustered markers
- Info windows with custom styling

---

## Database Schema

### Collections

#### users
```json
{
  "uid": "string",
  "email": "string",
  "role": "attendee|admin|vendor",
  "ticketId": "string",
  "seatInfo": {
    "section": "string",
    "row": "string",
    "seat": "string"
  },
  "location": {
    "lat": "number",
    "lng": "number",
    "timestamp": "timestamp"
  },
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

#### tickets
```json
{
  "ticketId": "string",
  "eventId": "string",
  "userId": "string",
  "qrCode": "string",
  "seatInfo": {
    "section": "string",
    "row": "string",
    "seat": "string"
  },
  "status": "valid|used|expired",
  "purchaseDate": "timestamp",
  "eventDate": "timestamp"
}
```

#### events
```json
{
  "eventId": "string",
  "name": "string",
  "venue": "string",
  "date": "timestamp",
  "sections": [
    {
      "id": "string",
      "name": "string",
      "capacity": "number",
      "vendorZones": ["string"]
    }
  ],
  "status": "scheduled|live|completed"
}
```

#### venues
```json
{
  "venueId": "string",
  "name": "string",
  "address": "string",
  "coordinates": {
    "lat": "number",
    "lng": "number"
  },
  "zones": [
    {
      "zoneId": "string",
      "name": "string",
      "type": "seating|food|vendor|restroom|exit",
      "coordinates": {
        "lat": "number",
        "lng": "number"
      }
    }
  ]
}
```

#### vendors
```json
{
  "vendorId": "string",
  "userId": "string",
  "name": "string",
  "location": {
    "lat": "number",
    "lng": "number",
    "timestamp": "timestamp"
  },
  "status": "available|busy|offline",
  "currentOrder": "string|null",
  "zone": "string",
  "metrics": {
    "ordersCompleted": "number",
    "averageDeliveryTime": "number",
    "rating": "number"
  }
}
```

#### orders
```json
{
  "orderId": "string",
  "userId": "string",
  "vendorId": "string",
  "items": [
    {
      "menuItemId": "string",
      "name": "string",
      "quantity": "number",
      "price": "number"
    }
  ],
  "total": "number",
  "status": "pending|confirmed|preparing|ready|delivered|cancelled",
  "deliveryType": "seat|pickup",
  "seatInfo": {
    "section": "string",
    "row": "string",
    "seat": "string"
  },
  "payment": {
    "method": "googlepay|card",
    "transactionId": "string",
    "status": "pending|completed|failed"
  },
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

#### menu_items
```json
{
  "menuItemId": "string",
  "vendorId": "string",
  "category": "string",
  "name": "string",
  "description": "string",
  "price": "number",
  "image": "string",
  "available": "boolean",
  "preparationTime": "number"
}
```

#### crowd_data
```json
{
  "dataId": "string",
  "eventId": "string",
  "zoneId": "string",
  "density": "number",
  "count": "number",
  "timestamp": "timestamp"
}
```

#### demand_data
```json
{
  "dataId": "string",
  "eventId": "string",
  "zoneId": "string",
  "orders": "number",
  "revenue": "number",
  "predictedDemand": "number",
  "timestamp": "timestamp"
}
```

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with credentials
- `POST /api/auth/verify-qr` - Verify QR code ticket
- `POST /api/auth/refresh-token` - Refresh JWT token

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile
- `PUT /api/users/me/location` - Update user location

### Tickets
- `POST /api/tickets/validate` - Validate ticket
- `GET /api/tickets/:ticketId` - Get ticket details

### Venues
- `GET /api/venues` - List all venues
- `GET /api/venues/:venueId` - Get venue details
- `GET /api/venues/:venueId/zones` - Get venue zones

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:orderId` - Get order details
- `PUT /api/orders/:orderId/status` - Update order status (vendor)
- `DELETE /api/orders/:orderId` - Cancel order

### Menu
- `GET /api/menu/:vendorId` - Get vendor menu
- `GET /api/menu/categories` - Get all categories

### Analytics
- `GET /api/analytics/crowd/:eventId` - Get crowd data
- `GET /api/analytics/demand/:eventId` - Get demand data
- `GET /api/analytics/predictions/:eventId` - Get AI predictions

### Vendors
- `GET /api/vendors` - List vendors
- `GET /api/vendors/:vendorId` - Get vendor details
- `PUT /api/vendors/:vendorId/status` - Update vendor status
- `GET /api/vendors/orders/pending` - Get pending orders

### Admin
- `GET /api/admin/dashboard` - Get dashboard data
- `POST /api/admin/broadcast` - Send broadcast notification
- `GET /api/admin/analytics` - Get analytics data

---

## AI/ML Pipeline

### Crowd Prediction Model
1. **Input Features:**
   - Historical crowd data by zone
   - Event timing (start, halftime, end)
   - Weather data
   - Day of week
   - Time of day

2. **Model:** LSTM neural network
3. **Output:** Predicted crowd density per zone (0-100%)

### Demand Forecasting Model
1. **Input Features:**
   - Historical sales data
   - Current order rate
   - Time since last order wave
   - Food type preferences

2. **Model:** Prophet time series
3. **Output:** Predicted orders per zone for next 30 min

### Vendor Routing Optimization
1. **Input Features:**
   - Vendor locations
   - Order delivery points
   - Current crowd density
   - Walking distances

2. **Model:** Dijkstra's algorithm with crowd weight
3. **Output:** Optimal delivery routes

---

## Security Model

### Authentication
- Firebase Auth with email/password
- JWT tokens with 1-hour expiry
- Refresh tokens with 7-day expiry
- Role-based access control

### Data Security
- All data encrypted at rest (Firebase)
- TLS 1.3 for data in transit
- Input validation on all endpoints
- SQL injection prevention (Firestore parameterized queries)
- XSS prevention (React escaping)

### Payment Security
- Google Pay API for payments
- PCI DSS compliance
- Transaction verification
- Fraud detection

### API Security
- Rate limiting (100 req/min)
- CORS configuration
- Helmet.js headers
- Request validation

---

## Deployment Architecture

### Google Cloud Services
- **Frontend:** Firebase Hosting
- **Backend:** Cloud Functions (Node.js)
- **Database:** Cloud Firestore
- **Real-time:** Firebase Realtime Database
- **Auth:** Firebase Authentication
- **Analytics:** BigQuery
- **Storage:** Cloud Storage
- **CDN:** Cloud CDN

### CI/CD Pipeline
- GitHub Actions for CI
- Build and test on push
- Deploy to Firebase on merge to main

---

## Acceptance Criteria

### Functional Requirements
- [ ] User can scan QR code and access PWA
- [ ] User can upload and validate ticket
- [ ] User location is tracked in real-time
- [ ] User can view live crowd heatmap
- [ ] User can navigate to seat with alternate routes
- [ ] User can order food and make payment
- [ ] User receives delivery at seat
- [ ] Admin can view real-time dashboard
- [ ] Admin can view crowd and demand heatmaps
- [ ] Admin can track vendor locations
- [ ] Vendor can view and complete orders
- [ ] AI predictions are displayed

### Performance Requirements
- [ ] Page load time < 3 seconds
- [ ] API response time < 500ms
- [ ] Real-time updates < 1 second delay
- [ ] Support 10,000 concurrent users

### Accessibility Requirements
- [ ] WCAG 2.1 AA compliance
- [ ] Keyboard navigation support
- [ ] Screen reader compatibility
- [ ] Color contrast ratio ≥ 4.5:1
- [ ] Responsive on all devices
