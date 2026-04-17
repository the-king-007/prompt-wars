# QRFlow Arena — System Architecture

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          QRFlow Arena Architecture                         │
└─────────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────────┐
                              │   Google Cloud  │
                              └────────┬────────┘
                                       │
        ┌──────────────────────────────┼──────────────────────────────┐
        │                              │                              │
        ▼                              ▼                              ▼
┌───────────────────┐      ┌───────────────────┐      ┌───────────────────┐
│  Firebase Hosting │      │  Cloud Functions  │      │    BigQuery      │
│   (Frontend PWA)  │      │   (Backend API)   │      │   (Analytics)    │
└─────────┬─────────┘      └─────────┬─────────┘      └─────────┬─────────┘
          │                          │                          │
          │              ┌───────────┴───────────┐              │
          │              │                       │              │
          ▼              ▼                       ▼              ▼
┌───────────────────┐ ┌───────────────┐  ┌────────────────┐ ┌───────────────┐
│   React PWA       │ │  Express.js   │  │  Firebase      │ │  Analytics    │
│   - Landing       │ │  - Auth       │  │  Firestore      │ │  Dashboard    │
│   - QR Login      │ │  - Orders     │  │  - Users        │ │               │
│   - Venue Map     │ │  - Analytics │  │  - Orders      │ │               │
│   - Food Order    │ │  - Admin     │  │  - Vendors      │ │               │
│   - Navigation   │ │               │  │  - Crowd Data   │ │               │
│   - Admin         │ └───────────────┘  └────────────────┘ └───────────────┘
│   - Vendor        │
└─────────┬─────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          User Interactions Flow                             │
└─────────────────────────────────────────────────────────────────────────────┘

  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
  │  QR Scan     │ ───► │  Ticket      │ ───► │  Venue Map   │
  │  Entry       │      │  Validation │      │  + Heatmap   │
  └──────────────┘      └──────────────┘      └──────────────┘
                                                      │
                                                      ▼
  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
  │  Delivery    │ ◄─── │  Food Order  │ ◄─── │  Navigation  │
  │  Tracking    │      │  + Payment   │      │  + Routes    │
  └──────────────┘      └──────────────┘      └──────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                    Admin / Vendor Management Flow                       │
└─────────────────────────────────────────────────────────────────────────────┘

  ┌──────────────────────────────────────────────────────────────────────┐
  │                           Admin Dashboard                              │
  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
  │  │ Crowd       │  │ Demand      │  │ Vendor      │  │ Emergency  │  │
  │  │ Heatmap     │  │ Heatmap     │  │ Tracking    │  │ Broadcast  │  │
  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  │
  └──────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
  ┌──────────────────────────────────────────────────────────────────────┐
  │                         AI/Analytics Layer                           │
  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────┐  │
  │  │ Crowd           │  │ Demand          │  │ Route               │  │
  │  │ Prediction      │  │ Forecasting     │  │ Optimization        │  │
  │  │ (LSTM)          │  │ (Prophet)       │  │ (Dijkstra's)        │  │
  │  └─────────────────┘  └─────────────────┘  └─────────────────────┘  │
  └──────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                           Data Flow & Integration                          │
└─────────────────────────────────────────────────────────────────────────────┘

  User Location ─────────────────► Firebase RTDB ─────────────► Crowd Heatmap
  Vendor Location ───────────────► Firebase RTDB ─────────────► Vendor Tracking
  Orders ────────────────────────► Firestore ────────────────► Demand Analytics
  Payments ──────────────────────► Google Pay API ───────────► Revenue Stats

  AI Predictions ◄───────────────► Historical Data (BigQuery)
                       │
                       ▼
  Vendor Repositioning Suggestions
  Crowd Alerts to Users
  Demand-Based Inventory Alerts
```

## Component Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Layout.tsx           # Main app layout with navigation
│   │   ├── Button.tsx            # Reusable button component
│   │   ├── Card.tsx              # Card container component
│   │   ├── Input.tsx             # Form input component
│   │   ├── Modal.tsx             # Modal overlay component
│   │   ├── Heatmap.tsx           # Crowd density heatmap
│   │   └── Loading.tsx           # Loading spinner
│   │
│   ├── pages/
│   │   ├── Landing.tsx           # Landing page
│   │   ├── QRLogin.tsx          # QR scanning / login
│   │   ├── TicketUpload.tsx     # Ticket validation
│   │   ├── VenueMap.tsx         # Live venue map with heatmap
│   │   ├── FoodOrdering.tsx     # Food ordering interface
│   │   ├── Navigation.tsx       # Navigation & routing
│   │   ├── Notifications.tsx    # Alerts & notifications
│   │   ├── AdminDashboard.tsx  # Admin analytics dashboard
│   │   └── VendorDashboard.tsx  # Vendor order management
│   │
│   ├── store/
│   │   ├── index.ts              # Redux store configuration
│   │   └── slices/
│   │       ├── authSlice.ts     # Authentication state
│   │       ├── userSlice.ts     # User data & location
│   │       ├── ordersSlice.ts   # Orders & cart
│   │       ├── analyticsSlice.ts # Crowd & demand data
│   │       └── vendorSlice.ts   # Vendor data
│   │
│   ├── services/
│   │   ├── firebase.ts           # Firebase integration
│   │   └── api.ts                # API client
│   │
│   ├── hooks/
│   │   ├── useRedux.ts           # Typed Redux hooks
│   │   ├── useGeolocation.ts    # Location tracking
│   │   └── useNotifications.ts # Push notifications
│   │
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces
│   │
│   └── utils/
│       ├── constants.ts          # App constants
│       └── helpers.ts            # Utility functions
│
└── public/
    ├── manifest.json             # PWA manifest
    └── service-worker.js        # Service worker
```

## Backend Service Structure

```
backend/
├── src/
│   ├── routes/
│   │   ├── auth.ts              # Authentication endpoints
│   │   ├── users.ts             # User management
│   │   ├── tickets.ts           # Ticket validation
│   │   ├── orders.ts            # Order management
│   │   ├── vendors.ts           # Vendor endpoints
│   │   ├── analytics.ts         # Analytics data
│   │   └── admin.ts             # Admin dashboard
│   │
│   ├── services/
│   │   ├── aiService.ts         # AI prediction models
│   │   ├── authService.ts      # Auth logic
│   │   ├── paymentService.ts   # Payment processing
│   │   └── notificationService.ts # Push notifications
│   │
│   ├── middleware/
│   │   ├── auth.ts              # JWT authentication
│   │   ├── validation.ts        # Input validation
│   │   └── rateLimit.ts         # Rate limiting
│   │
│   ├── models/
│   │   ├── User.ts              # User model
│   │   ├── Order.ts             # Order model
│   │   └── Vendor.ts            # Vendor model
│   │
│   ├── utils/
│   │   ├── constants.ts         # Backend constants
│   │   └── helpers.ts           # Utility functions
│   │
│   └── index.ts                 # Express app entry point
│
└── package.json
```

## Database Schema

### Collections Overview

1. **users** - User accounts and profiles
2. **tickets** - Ticket information and validation
3. **events** - Event details and configuration
4. **venues** - Venue information and zones
5. **vendors** - Vendor information and status
6. **orders** - Order transactions
7. **menu_items** - Vendor menu items
8. **crowd_data** - Real-time crowd density
9. **demand_data** - Real-time demand analytics
10. **notifications** - User notifications
