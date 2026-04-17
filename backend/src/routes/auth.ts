import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your-refresh-secret';

interface User {
  uid: string;
  email: string;
  role: 'attendee' | 'admin' | 'vendor';
  ticketId?: string;
}

const users: Map<string, User> = new Map();

router.post('/register', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;
    const uid = uuidv4();
    
    const user: User = { uid, email, role: 'attendee' };
    users.set(uid, user);

    const accessToken = jwt.sign({ uid, email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ uid }, REFRESH_SECRET, { expiresIn: '7d' });

    res.json({ success: true, data: { user, accessToken, refreshToken } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Registration failed' });
  }
});

router.post('/login', [
  body('email').isEmail(),
  body('password').exists()
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;
    
    let user = Array.from(users.values()).find(u => u.email === email);
    if (!user) {
      const uid = uuidv4();
      user = { uid, email, role: 'attendee' };
      users.set(uid, user);
    }

    const accessToken = jwt.sign({ uid: user.uid, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ uid: user.uid }, REFRESH_SECRET, { expiresIn: '7d' });

    res.json({ success: true, data: { user, accessToken, refreshToken } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Login failed' });
  }
});

router.post('/verify-qr', [
  body('qrCode').notEmpty()
], async (req: Request, res: Response) => {
  try {
    const { qrCode } = req.body;
    
    res.json({ 
      success: true, 
      data: { 
        valid: qrCode.startsWith('TICKET-'),
        ticketId: qrCode,
        seatInfo: { section: 'A', row: '1', seat: '12' }
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'QR verification failed' });
  }
});

router.post('/refresh-token', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as { uid: string };
    const user = users.get(decoded.uid);
    
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid token' });
    }

    const accessToken = jwt.sign({ uid: user.uid, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    
    res.json({ success: true, data: { accessToken } });
  } catch (error) {
    res.status(401).json({ success: false, error: 'Invalid refresh token' });
  }
});

export default router;
