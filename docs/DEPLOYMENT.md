# QRFlow Arena - Google Cloud Deployment

## Prerequisites

1. Google Cloud CLI installed
2. Firebase CLI installed
3. Node.js 18+ installed

## Setup

```bash
# Login to Google Cloud
gcloud auth login

# Set project
gcloud config set project qrflow-arena

# Enable required APIs
gcloud services enable \
  cloudfunctions.googleapis.com \
  firestore.googleapis.com \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  bigquery.googleapis.com
```

## Frontend Deployment (Firebase Hosting)

```yaml
# firebase.json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "/api/**",
        "function": "api"
      }
    ],
    "headers": [
      {
        "source": "**/*",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "no-cache, no-store, must-revalidate"
          }
        ]
      }
    ],
    "predeploy": [
      "npm run build"
    ]
  }
}
```

## Backend Deployment (Cloud Functions)

```yaml
# cloudbuild.yaml
steps:
  # Build frontend
  - name: 'node:18'
    entrypoint: 'npm'
    args: ['run', 'build']
    dir: 'frontend'

  # Deploy frontend
  - name: 'gcr.io/cloud-builders/firebase'
    args: ['deploy', '--only', 'hosting']

  # Install backend dependencies
  - name: 'node:18'
    entrypoint: 'npm'
    args: ['install']
    dir: 'backend'

  # Deploy Cloud Functions
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: 'gcloud'
    args:
      - 'functions'
      - 'deploy'
      - 'qrflow-api'
      - '--runtime=nodejs18'
      - '--trigger-http'
      - '--source=.'
      - '--region=us-central1'
      - '--allow-unauthenticated'
      - '--set-env-vars'
      - 'JWT_SECRET=prod-secret,FIREBASE_PROJECT_ID=qrflow-arena'
```

## Environment Variables

```bash
# Backend
JWT_SECRET=your-production-jwt-secret
REFRESH_SECRET=your-production-refresh-secret
FIREBASE_PROJECT_ID=qrflow-arena
FIREBASE_PRIVATE_KEY=your-firebase-private-key
FIREBASE_CLIENT_EMAIL=your-firebase-client-email

# Frontend
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=qrflow-arena.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=qrflow-arena
VITE_FIREBASE_STORAGE_BUCKET=qrflow-arena.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_GOOGLE_MAPS_API_KEY=your-maps-api-key
```

## Cloud Firestore Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users - own user can read/write
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Tickets - authenticated users can read
    match /tickets/{ticketId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.role == 'admin';
    }
    
    // Orders - own user or vendor can read
    match /orders/{orderId} {
      allow read: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         resource.data.vendorId == request.auth.uid);
      allow create: if request.auth != null;
      allow update: if request.auth != null;
    }
    
    // Vendors - all can read
    match /vendors/{vendorId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.role == 'admin';
    }
    
    // Analytics - admin only
    match /analytics/{document=**} {
      allow read, write: if request.auth != null && request.auth.token.role == 'admin';
    }
  }
}
```

## BigQuery Analytics Schema

```sql
-- Create dataset
CREATE SCHEMA IF NOT EXISTS qrflow_analytics;

-- Crowd data table
CREATE TABLE IF NOT EXISTS qrflow_analytics.crowd_data (
  event_id STRING,
  zone_id STRING,
  density FLOAT64,
  count INT64,
  timestamp TIMESTAMP
);

-- Demand data table
CREATE TABLE IF NOT EXISTS qrflow_analytics.demand_data (
  event_id STRING,
  zone_id STRING,
  orders INT64,
  revenue FLOAT64,
  predicted_demand FLOAT64,
  timestamp TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS qrflow_analytics.orders (
  order_id STRING,
  user_id STRING,
  vendor_id STRING,
  total FLOAT64,
  status STRING,
  created_at TIMESTAMP,
  delivered_at TIMESTAMP
);
```

## CI/CD Pipeline (GitHub Actions)

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          
      - name: Install dependencies
        run: |
          cd frontend && npm install
          cd ../backend && npm install
          
      - name: Run tests
        run: npm test
        
      - name: Build frontend
        run: cd frontend && npm run build
        
      - name: Authenticate to Google Cloud
        uses: google-github-actions/auth@v1
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}
          
      - name: Deploy to Firebase
        uses: w9jds/firebase-action@v2
        with:
          args: deploy --only hosting
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
          
      - name: Deploy Cloud Functions
        run: |
          gcloud functions deploy qrflow-api \
            --runtime nodejs18 \
            --trigger-http \
            --region us-central1
```

## Monitoring & Alerts

```yaml
# Cloud Monitoring
alertPolicies:
  - displayName: High Error Rate
    conditions:
      - displayName: Cloud Function Error Rate
        conditionThreshold:
          filter: resource.type="cloud_function" AND metric.type="cloudfunctions.googleapis.com/function/execution_count"
          comparison: COMPARISON_GT
          thresholdValue: 0.05
          duration: 300s
    notificationChannels:
      - email-channel-id
    documentation:
      content: High error rate detected in QRFlow API
```

## Scaling Configuration

```yaml
# Cloud Run
spec:
  template:
    metadata:
      annotations:
        autoscaling.knative.dev/minScale: "2"
        autoscaling.knative.dev/maxScale: "20"
    spec:
      containers:
        - image: qrflow-backend:latest
          resources:
            limits:
              cpu: "1000m"
              memory: "512Mi"
            requests:
              cpu: "500m"
              memory: "256Mi"
```

## Rollback Strategy

```bash
# Rollback Firebase hosting
firebase hosting:clone qrflow-arena:live qrflow-arena:rollback

# Rollback Cloud Functions
gcloud functions rollback qrflow-api --region=us-central1 --version=v1
```
