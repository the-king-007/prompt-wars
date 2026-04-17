import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface AuthRequest extends Request {
  user?: { uid: string; email: string; role: string };
}

const authenticateToken = (req: AuthRequest, res: Response, next: Function) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { uid: string; email: string; role: string };
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, error: 'Invalid token' });
  }
};

router.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const user = {
      uid: req.user?.uid,
      email: req.user?.email,
      role: req.user?.role,
      ticketId: 'TICKET-12345',
      seatInfo: { section: 'A', row: '1', seat: '12' }
    };

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get user' });
  }
});

router.put('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    res.json({ success: true, data: { message: 'User updated successfully' } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update user' });
  }
});

router.put('/me/location', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { lat, lng } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({ success: false, error: 'Coordinates required' });
    }

    res.json({ success: true, data: { message: 'Location updated' } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update location' });
  }
});

export default router;
