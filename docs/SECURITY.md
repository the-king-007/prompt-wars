# Security Model

## Authentication & Authorization

### JWT Implementation
- Access tokens: 1-hour expiry
- Refresh tokens: 7-day expiry
- Token signing: RS256 algorithm
- Secure storage: httpOnly cookies

### Role-Based Access Control (RBAC)
```
Roles:
├── attendee    - Basic user access
├── vendor      - Order management
└── admin       - Full system access
```

### Firebase Auth Integration
- Email/password authentication
- Google OAuth support
- Anonymous auth for quick access
- Multi-factor authentication support

## Data Security

### Encryption
- Data at rest: AES-256 (Firestore)
- Data in transit: TLS 1.3
- Sensitive fields: Client-side encryption

### Input Validation
- Express-validator on all endpoints
- TypeScript strict mode
- SQL injection prevention (parameterized queries)
- XSS prevention (React escaping, CSP headers)

## API Security

### Rate Limiting
```javascript
// 100 requests per minute per IP
app.use(rateLimit({
  windowMs: 60 * 1000,
  max: 100
}));
```

### Security Headers (Helmet.js)
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Content-Security-Policy: default-src 'self'

### CORS Configuration
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

## Payment Security

### Google Pay Integration
- PCI DSS compliant
- Tokenized card data
- Transaction verification
- Fraud detection

### Order Verification
- Server-side price validation
- Transaction ID tracking
- Webhook confirmations

## Firebase Security Rules

### Firestore Rules
- User document access: owner only
- Order access: owner + assigned vendor
- Analytics: admin only
- Real-time data: authenticated users

### Storage Rules
- Ticket uploads: authenticated users
- Profile images: owner only

## Monitoring & Incident Response

### Security Monitoring
- Cloud Audit Logs
- Anomaly detection
- Access logging
- Real-time alerts

### Incident Response
1. Detection & Analysis
2. Containment
3. Recovery
4. Post-incident review

## Compliance

### WCAG 2.1 AA
- Color contrast: 4.5:1 minimum
- Keyboard navigation
- Screen reader support
- Focus indicators

### GDPR Compliance
- Data minimization
- Consent management
- Right to deletion
- Data portability

### PCI DSS
- Secure network
- Cardholder data protection
- Vulnerability management
- Access control
