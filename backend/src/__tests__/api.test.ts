import { describe, it, expect, beforeAll } from '@jest/globals';

const API_BASE_URL = process.env.API_URL || 'http://localhost:4000/api';

describe('Auth API Endpoints', () => {
  let authToken: string;

  it('should register a new user', async () => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `test${Date.now()}@example.com`,
        password: 'password123'
      })
    });

    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.accessToken).toBeDefined();
    expect(data.data.refreshToken).toBeDefined();
  });

  it('should login existing user', async () => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });

    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.accessToken).toBeDefined();
    authToken = data.data.accessToken;
  });

  it('should validate QR code', async () => {
    const response = await fetch(`${API_BASE_URL}/auth/verify-qr`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        qrCode: 'TICKET-TEST-123'
      })
    });

    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.valid).toBe(true);
  });

  it('should refresh token', async () => {
    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        refreshToken: 'test-refresh-token'
      })
    });

    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.accessToken).toBeDefined();
  });
});

describe('Orders API Endpoints', () => {
  let authToken: string = 'test-token';

  it('should create a new order', async () => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        items: [
          { menuItemId: '1', name: 'Cheeseburger', quantity: 2, price: 12.99 }
        ],
        total: 25.98,
        deliveryType: 'seat',
        seatInfo: { section: 'A', row: '1', seat: '12' }
      })
    });

    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.orderId).toBeDefined();
    expect(data.data.status).toBe('pending');
  });

  it('should get user orders', async () => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${authToken}`
      }
    });

    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
  });

  it('should update order status', async () => {
    const response = await fetch(`${API_BASE_URL}/orders/ORDER-123/status`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        status: 'preparing'
      })
    });

    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });
});

describe('Analytics API Endpoints', () => {
  it('should get crowd data', async () => {
    const response = await fetch(`${API_BASE_URL}/analytics/crowd/EVENT-001`, {
      method: 'GET'
    });

    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
  });

  it('should get demand data', async () => {
    const response = await fetch(`${API_BASE_URL}/analytics/demand/EVENT-001`, {
      method: 'GET'
    });

    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it('should get predictions', async () => {
    const response = await fetch(`${API_BASE_URL}/analytics/predictions/EVENT-001`, {
      method: 'GET'
    });

    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
  });
});

describe('Vendors API Endpoints', () => {
  it('should get all vendors', async () => {
    const response = await fetch(`${API_BASE_URL}/vendors`, {
      method: 'GET'
    });

    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
  });

  it('should get pending orders for vendors', async () => {
    const response = await fetch(`${API_BASE_URL}/vendors/orders/pending`, {
      method: 'GET'
    });

    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });
});

describe('Health Check', () => {
  it('should return ok status', async () => {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET'
    });

    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.status).toBe('ok');
    expect(data.timestamp).toBeDefined();
  });
});
