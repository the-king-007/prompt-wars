export interface CrowdPredictionInput {
  historicalData: Array<{ timestamp: number; density: number }>;
  eventPhase: 'pre' | 'halftime' | 'post';
  weather?: 'sunny' | 'cloudy' | 'rainy';
  dayOfWeek: number;
  timeOfDay: number;
}

export interface CrowdPrediction {
  zoneId: string;
  predictedDensity: number;
  confidence: number;
  recommendation: string;
}

export interface DemandPredictionInput {
  historicalOrders: Array<{ timestamp: number; orders: number }>;
  currentOrderRate: number;
  zoneType: 'seating' | 'food' | 'vendor';
  timeOfDay: number;
}

export interface DemandPrediction {
  zoneId: string;
  predictedOrders: number;
  predictedRevenue: number;
  confidence: number;
  suggestedInventory: Record<string, number>;
}

export interface RouteOptimizationInput {
  startLocation: { lat: number; lng: number };
  endLocation: { lat: number; lng: number };
  crowdDensity: Map<string, number>;
  avoidZones: string[];
}

export interface RouteStep {
  instruction: string;
  distance: number;
  coordinates: { lat: number; lng: number };
}

export interface OptimizedRoute {
  totalDistance: number;
  estimatedTime: number;
  steps: RouteStep[];
  crowdLevel: 'low' | 'moderate' | 'high';
  alternateRoutes: OptimizedRoute[];
}

export class AICrowdPredictor {
  private modelWeights = {
    timeWeight: 0.3,
    phaseWeight: 0.25,
    weatherWeight: 0.15,
    historicalWeight: 0.3
  };

  async predictCrowdDensity(input: CrowdPredictionInput): Promise<CrowdPrediction[]> {
    const zones = ['zone-1', 'zone-2', 'zone-3', 'zone-4', 'zone-5'];
    
    return zones.map(zoneId => {
      let baseDensity = 50;
      
      if (input.historicalData.length > 0) {
        const avgHistorical = input.historicalData.reduce((sum, d) => sum + d.density, 0) / input.historicalData.length;
        baseDensity = avgHistorical * this.modelWeights.historicalWeight * 100;
      }
      
      const phaseMultiplier = {
        'pre': 1.2,
        'halftime': 1.5,
        'post': 0.8
      }[input.eventPhase] || 1;
      
      const weatherMultiplier = {
        'sunny': 1.1,
        'cloudy': 1.0,
        'rainy': 0.8
      }[input.weather || 'cloudy'] || 1;
      
      const timeMultiplier = input.timeOfDay >= 18 && input.timeOfDay <= 21 ? 1.3 : 1.0;
      
      const predictedDensity = Math.min(100, Math.max(0,
        baseDensity * phaseMultiplier * weatherMultiplier * timeMultiplier
      ));
      
      const confidence = 0.7 + Math.random() * 0.2;
      
      const recommendation = predictedDensity > 80 
        ? 'Consider alternative routes or delayed travel'
        : predictedDensity > 60
        ? 'Moderate crowd expected'
        : 'Low crowd expected';
      
      return {
        zoneId,
        predictedDensity: Math.round(predictedDensity),
        confidence,
        recommendation
      };
    });
  }
}

export class AIDemandPredictor {
  async predictDemand(input: DemandPredictionInput): Promise<DemandPrediction[]> {
    const zones = ['zone-1', 'zone-2', 'zone-3', 'zone-4', 'zone-5'];
    
    return zones.map(zoneId => {
      let baseOrders = 50;
      
      if (input.historicalOrders.length > 0) {
        const avgOrders = input.historicalOrders.reduce((sum, o) => sum + o.orders, 0) / input.historicalOrders.length;
        baseOrders = avgOrders;
      }
      
      const trendMultiplier = input.currentOrderRate > baseOrders ? 1.2 : 0.9;
      const peakMultiplier = input.timeOfDay >= 19 && input.timeOfDay <= 20 ? 1.4 : 1.0;
      
      const predictedOrders = Math.round(baseOrders * trendMultiplier * peakMultiplier);
      const predictedRevenue = predictedOrders * 12;
      const confidence = 0.65 + Math.random() * 0.25;
      
      const suggestedInventory: Record<string, number> = {
        'burgers': Math.round(predictedOrders * 0.4),
        'drinks': Math.round(predictedOrders * 0.6),
        'snacks': Math.round(predictedOrders * 0.3)
      };
      
      return {
        zoneId,
        predictedOrders,
        predictedRevenue,
        confidence,
        suggestedInventory
      };
    });
  }
}

export class AIRouteOptimizer {
  private calculateCrowdPenalty(density: number): number {
    if (density >= 80) return 2.0;
    if (density >= 60) return 1.5;
    if (density >= 40) return 1.2;
    return 1.0;
  }

  async optimizeRoute(input: RouteOptimizationInput): Promise<OptimizedRoute> {
    const directDistance = this.calculateDistance(input.startLocation, input.endLocation);
    
    const mainRoute: OptimizedRoute = {
      totalDistance: directDistance,
      estimatedTime: Math.round(directDistance * 1.5),
      steps: [
        {
          instruction: 'Head toward the main corridor',
          distance: directDistance * 0.3,
          coordinates: {
            lat: input.startLocation.lat + (input.endLocation.lat - input.startLocation.lat) * 0.3,
            lng: input.startLocation.lng + (input.endLocation.lng - input.startLocation.lng) * 0.3
          }
        },
        {
          instruction: 'Continue straight',
          distance: directDistance * 0.5,
          coordinates: {
            lat: input.startLocation.lat + (input.endLocation.lat - input.startLocation.lat) * 0.8,
            lng: input.startLocation.lng + (input.endLocation.lng - input.startLocation.lng) * 0.8
          }
        },
        {
          instruction: 'Arrive at destination',
          distance: directDistance * 0.2,
          coordinates: input.endLocation
        }
      ],
      crowdLevel: 'moderate',
      alternateRoutes: []
    };
    
    const avgCrowd = Array.from(input.crowdDensity.values()).reduce((a, b) => a + b, 0) / input.crowdDensity.size;
    mainRoute.crowdLevel = avgCrowd >= 70 ? 'high' : avgCrowd >= 40 ? 'moderate' : 'low';
    mainRoute.estimatedTime = Math.round(mainRoute.estimatedTime * (avgCrowd >= 60 ? 1.3 : 1.0));
    
    return mainRoute;
  }

  private calculateDistance(start: { lat: number; lng: number }, end: { lat: number; lng: number }): number {
    const R = 6371;
    const dLat = this.toRad(end.lat - start.lat);
    const dLng = this.toRad(end.lng - start.lng);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(start.lat)) * Math.cos(this.toRad(end.lat)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000;
  }

  private toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}

export const crowdPredictor = new AICrowdPredictor();
export const demandPredictor = new AIDemandPredictor();
export const routeOptimizer = new AIRouteOptimizer();
