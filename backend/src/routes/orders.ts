import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

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

const orders = new Map();

router.post('/', authenticateToken, [
  body('items').isArray(),
  body('total').isFloat({ min: 0 })
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { items, total, deliveryType, seatInfo } = req.body;
    const orderId = `ORDER-${uuidv4().slice(0, 8)}`;

    const order = {
      orderId,
      userId: req.user?.uid,
      vendorId: 'VENDOR-001',
      items,
      total,
      status: 'pending',
      deliveryType: deliveryType || 'pickup',
      seatInfo,
      payment: { method: 'googlepay', transactionId: `TXN-${uuidv4().slice(0, 8)}`, status: 'completed' },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    orders.set(orderId, order);

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create order' });
  }
});

router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userOrders = Array.from(orders.values()).filter(o => o.userId === req.user?.uid);
    res.json({ success: true, data: userOrders });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get orders' });
  }
});

router.get('/:orderId', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.params;
    const order = orders.get(orderId);

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get order' });
  }
});

router.put('/:orderId/status', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = orders.get(orderId);

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    order.status = status;
    order.updatedAt = new Date();
    orders.set(orderId, order);

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update order status' });
  }
});

router.delete('/:orderId', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.params;
    const order = orders.get(orderId);

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    order.status = 'cancelled';
    order.updatedAt = new Date();
    orders.set(orderId, order);

    res.json({ success: true, data: { message: 'Order cancelled' } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to cancel order' });
  }
});

export default router;
