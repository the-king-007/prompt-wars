import { describe, it, expect } from '@jest/globals';
import { 
  AICrowdPredictor, 
  AIDemandPredictor, 
  AIRouteOptimizer,
  crowdPredictor,
  demandPredictor,
  routeOptimizer 
} from '../src/services/aiService';

describe('AI Crowd Predictor', () => {
  const predictor = new AICrowdPredictor();

  it('should predict crowd density for zones', async () => {
    const input = {
      historicalData: [
        { timestamp: Date.now() - 3600000, density: 0.6 },
        { timestamp: Date.now() - 1800000, density: 0.7 }
      ],
      eventPhase: 'halftime',
      weather: 'sunny',
      dayOfWeek: 6,
      timeOfDay: 19
    };

    const predictions = await predictor.predictCrowdDensity(input);

    expect(predictions).toHaveLength(5);
    predictions.forEach(pred => {
      expect(pred.zoneId).toBeDefined();
      expect(pred.predictedDensity).toBeGreaterThanOrEqual(0);
      expect(pred.predictedDensity).toBeLessThanOrEqual(100);
      expect(pred.confidence).toBeGreaterThanOrEqual(0.7);
      expect(pred.confidence).toBeLessThanOrEqual(0.9);
      expect(pred.recommendation).toBeDefined();
    });
  });

  it('should recommend alternative routes for high density', async () => {
    const input = {
      historicalData: [
        { timestamp: Date.now() - 3600000, density: 0.9 }
      ],
      eventPhase: 'halftime',
      weather: 'sunny',
      dayOfWeek: 6,
      timeOfDay: 20
    };

    const predictions = await predictor.predictCrowdDensity(input);
    const highDensityPredictions = predictions.filter(p => p.predictedDensity > 80);

    highDensityPredictions.forEach(pred => {
      expect(pred.recommendation).toContain('Consider alternative routes');
    });
  });
});

describe('AI Demand Predictor', () => {
  const predictor = new AIDemandPredictor();

  it('should predict demand for zones', async () => {
    const input = {
      historicalOrders: [
        { timestamp: Date.now() - 3600000, orders: 50 },
        { timestamp: Date.now() - 1800000, orders: 60 }
      ],
      currentOrderRate: 55,
      zoneType: 'food',
      timeOfDay: 19
    };

    const predictions = await predictor.predictDemand(input);

    expect(predictions).toHaveLength(5);
    predictions.forEach(pred => {
      expect(pred.zoneId).toBeDefined();
      expect(pred.predictedOrders).toBeGreaterThan(0);
      expect(pred.predictedRevenue).toBeGreaterThan(0);
      expect(pred.confidence).toBeGreaterThan(0.65);
      expect(pred.suggestedInventory).toBeDefined();
      expect(pred.suggestedInventory.burgers).toBeGreaterThan(0);
    });
  });

  it('should predict higher demand during peak hours', async () => {
    const peakInput = {
      historicalOrders: [{ timestamp: Date.now() - 3600000, orders: 50 }],
      currentOrderRate: 60,
      zoneType: 'food',
      timeOfDay: 19.5
    };

    const offPeakInput = {
      historicalOrders: [{ timestamp: Date.now() - 3600000, orders: 50 }],
      currentOrderRate: 40,
      zoneType: 'food',
      timeOfDay: 14
    };

    const peakPredictions = await predictor.predictDemand(peakInput);
    const offPeakPredictions = await predictor.predictDemand(offPeakInput);

    const peakTotal = peakPredictions.reduce((sum, p) => sum + p.predictedOrders, 0);
    const offPeakTotal = offPeakPredictions.reduce((sum, p) => sum + p.predictedOrders, 0);

    expect(peakTotal).toBeGreaterThan(offPeakTotal);
  });
});

describe('AI Route Optimizer', () => {
  const optimizer = new AIRouteOptimizer();

  it('should optimize route between two points', async () => {
    const input = {
      startLocation: { lat: 40.7128, lng: -74.0060 },
      endLocation: { lat: 40.7580, lng: -73.9855 },
      crowdDensity: new Map([
        ['zone-1', 40],
        ['zone-2', 60],
        ['zone-3', 30]
      ]),
      avoidZones: []
    };

    const route = await optimizer.optimizeRoute(input);

    expect(route.totalDistance).toBeGreaterThan(0);
    expect(route.estimatedTime).toBeGreaterThan(0);
    expect(route.steps).toHaveLength(3);
    expect(route.steps[0].instruction).toBeDefined();
    expect(route.crowdLevel).toMatch(/low|moderate|high/);
  });

  it('should increase estimated time for high crowd density', async () => {
    const lowCrowdInput = {
      startLocation: { lat: 40.7128, lng: -74.0060 },
      endLocation: { lat: 40.7580, lng: -73.9855 },
      crowdDensity: new Map([['zone-1', 20]]),
      avoidZones: []
    };

    const highCrowdInput = {
      startLocation: { lat: 40.7128, lng: -74.0060 },
      endLocation: { lat: 40.7580, lng: -73.9855 },
      crowdDensity: new Map([['zone-1', 80]]),
      avoidZones: []
    };

    const lowCrowdRoute = await optimizer.optimizeRoute(lowCrowdInput);
    const highCrowdRoute = await optimizer.optimizeRoute(highCrowdInput);

    expect(highCrowdRoute.estimatedTime).toBeGreaterThanOrEqual(lowCrowdRoute.estimatedTime);
  });

  it('should calculate crowd penalty correctly', () => {
    const optimizer = new AIRouteOptimizer();
    
    const highPenalty = (optimizer as any).calculateCrowdPenalty(85);
    expect(highPenalty).toBe(2.0);

    const mediumPenalty = (optimizer as any).calculateCrowdPenalty(50);
    expect(mediumPenalty).toBe(1.2);

    const lowPenalty = (optimizer as any).calculateCrowdPenalty(20);
    expect(lowPenalty).toBe(1.0);
  });
});

describe('Service Exports', () => {
  it('should export singleton instances', () => {
    expect(crowdPredictor).toBeDefined();
    expect(demandPredictor).toBeDefined();
    expect(routeOptimizer).toBeDefined();
    
    expect(crowdPredictor).toBeInstanceOf(AICrowdPredictor);
    expect(demandPredictor).toBeInstanceOf(AIDemandPredictor);
    expect(routeOptimizer).toBeInstanceOf(AIRouteOptimizer);
  });
});
