import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface AuthRequest extends Request {
  user?: { uid: string; email: string; role: string };
}

const authenticateAdmin = (req: AuthRequest, res: Response, next: Function) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { uid: string; email: string; role: string };
    if (decoded.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, error: 'Invalid token' });
  }
};

router.get('/dashboard', authenticateAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const dashboardData = {
      totalAttendees: 8542,
      activeOrders: 1247,
      totalRevenue: 45230,
      averageWaitTime: 12,
      crowdDensity: [
        { time: '6:00', density: 20 },
        { time: '6:30', density: 35 },
        { time: '7:00', density: 55 },
        { time: '7:30', density: 70 },
        { time: '8:00', density: 85 },
      ],
      demandByZone: [
        { zone: 'Section A', orders: 120 },
        { zone: 'Section B', orders: 85 },
        { zone: 'Food Court', orders: 250 },
      ],
      vendorLocations: [
        { id: 'v1', name: 'Vendor A', lat: 40.7128, lng: -74.0060, status: 'available' },
        { id: 'v2', name: 'Vendor B', lat: 40.7138, lng: -74.0070, status: 'busy' },
      ]
    };

    res.json({ success: true, data: dashboardData });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get dashboard data' });
  }
});

router.post('/broadcast', authenticateAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { message, type } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, error: 'Message required' });
    }

    res.json({ success: true, data: { message: 'Broadcast sent successfully', type: type || 'general' } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to send broadcast' });
  }
});

router.get('/analytics', authenticateAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const analytics = {
      salesOverTime: [
        { date: '2024-01-01', revenue: 5200 },
        { date: '2024-01-02', revenue: 4800 },
        { date: '2024-01-03', revenue: 6100 },
      ],
      popularItems: [
        { name: 'Cheeseburger', orders: 245 },
        { name: 'Pepperoni Pizza', orders: 198 },
        { name: 'Soft Drinks', orders: 312 },
      ],
      peakHours: [
        { hour: '7:00', orders: 150 },
        { hour: '8:00', orders: 280 },
        { hour: '9:00', orders: 350 },
      ]
    };

    res.json({ success: true, data: analytics });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get analytics' });
  }
});

export default router;
