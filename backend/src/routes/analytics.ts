import { Router, Request, Response } from 'express';

const router = Router();

const generateMockCrowdData = (eventId: string) => [
  { dataId: '1', eventId, zoneId: 'zone-1', density: 85, count: 850, timestamp: new Date() },
  { dataId: '2', eventId, zoneId: 'zone-2', density: 45, count: 450, timestamp: new Date() },
  { dataId: '3', eventId, zoneId: 'zone-3', density: 92, count: 920, timestamp: new Date() },
  { dataId: '4', eventId, zoneId: 'zone-4', density: 30, count: 300, timestamp: new Date() },
  { dataId: '5', eventId, zoneId: 'zone-5', density: 60, count: 600, timestamp: new Date() },
];

const generateMockDemandData = (eventId: string) => [
  { dataId: '1', eventId, zoneId: 'zone-1', orders: 120, revenue: 1200, predictedDemand: 130, timestamp: new Date() },
  { dataId: '2', eventId, zoneId: 'zone-2', orders: 85, revenue: 850, predictedDemand: 90, timestamp: new Date() },
  { dataId: '3', eventId, zoneId: 'zone-3', orders: 250, revenue: 2500, predictedDemand: 280, timestamp: new Date() },
  { dataId: '4', eventId, zoneId: 'zone-4', orders: 65, revenue: 650, predictedDemand: 70, timestamp: new Date() },
  { dataId: '5', eventId, zoneId: 'zone-5', orders: 95, revenue: 950, predictedDemand: 110, timestamp: new Date() },
];

const generateMockPredictions = (eventId: string) => [
  { zoneId: 'zone-1', predictedDensity: 88, predictedDemand: 140, confidence: 0.85, timestamp: new Date() },
  { zoneId: 'zone-2', predictedDensity: 52, predictedDemand: 95, confidence: 0.78, timestamp: new Date() },
  { zoneId: 'zone-3', predictedDensity: 95, predictedDemand: 300, confidence: 0.82, timestamp: new Date() },
  { zoneId: 'zone-4', predictedDensity: 35, predictedDemand: 75, confidence: 0.90, timestamp: new Date() },
  { zoneId: 'zone-5', predictedDensity: 70, predictedDemand: 120, confidence: 0.75, timestamp: new Date() },
];

router.get('/crowd/:eventId', async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const data = generateMockCrowdData(eventId);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get crowd data' });
  }
});

router.get('/demand/:eventId', async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const data = generateMockDemandData(eventId);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get demand data' });
  }
});

router.get('/predictions/:eventId', async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const predictions = generateMockPredictions(eventId);
    res.json({ success: true, data: predictions });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get predictions' });
  }
});

export default router;
