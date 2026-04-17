import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

const router = Router();

const vendors = [
  { vendorId: 'VENDOR-001', name: 'Burger Station', status: 'available', zone: 'Zone 1', metrics: { ordersCompleted: 45, averageDeliveryTime: 12, rating: 4.8 } },
  { vendorId: 'VENDOR-002', name: 'Pizza Place', status: 'busy', zone: 'Zone 1', metrics: { ordersCompleted: 32, averageDeliveryTime: 15, rating: 4.6 } },
  { vendorId: 'VENDOR-003', name: 'Drink Station', status: 'available', zone: 'Zone 2', metrics: { ordersCompleted: 78, averageDeliveryTime: 8, rating: 4.9 } },
];

router.get('/', async (req: Request, res: Response) => {
  try {
    res.json({ success: true, data: vendors });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get vendors' });
  }
});

router.get('/:vendorId', async (req: Request, res: Response) => {
  try {
    const { vendorId } = req.params;
    const vendor = vendors.find(v => v.vendorId === vendorId);

    if (!vendor) {
      return res.status(404).json({ success: false, error: 'Vendor not found' });
    }

    res.json({ success: true, data: vendor });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get vendor' });
  }
});

router.put('/:vendorId/status', async (req: Request, res: Response) => {
  try {
    const { vendorId } = req.params;
    const { status } = req.body;
    const vendor = vendors.find(v => v.vendorId === vendorId);

    if (!vendor) {
      return res.status(404).json({ success: false, error: 'Vendor not found' });
    }

    vendor.status = status;
    res.json({ success: true, data: vendor });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update vendor status' });
  }
});

router.get('/orders/pending', async (req: Request, res: Response) => {
  try {
    const pendingOrders = [
      { orderId: 'ORDER-001', items: '2x Cheeseburger', total: 25.98, status: 'pending', customer: 'Section A, Row 5' },
      { orderId: 'ORDER-002', items: '1x Pepperoni Pizza', total: 12.99, status: 'pending', customer: 'Section B, Row 12' },
    ];
    res.json({ success: true, data: pendingOrders });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get pending orders' });
  }
});

export default router;
