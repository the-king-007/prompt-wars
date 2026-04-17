import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/useRedux';
import { setLocation } from '../store/slices/userSlice';
import { setCrowdData } from '../store/slices/analyticsSlice';
import styles from './VenueMap.module.css';

const VenueMap = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const { currentLocation, seatInfo } = useAppSelector(state => state.user);
  const { crowdData } = useAppSelector(state => state.analytics);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        dispatch(setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timestamp: new Date()
        }));
      },
      (error) => console.error('Geolocation error:', error),
      { enableHighAccuracy: true, timeout: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [dispatch]);

  useEffect(() => {
    const mockCrowdData = [
      { zoneId: 'zone-1', density: 85, name: 'Section A', type: 'seating' },
      { zoneId: 'zone-2', density: 45, name: 'Section B', type: 'seating' },
      { zoneId: 'zone-3', density: 92, name: 'Food Court', type: 'food' },
      { zoneId: 'zone-4', density: 30, name: 'Restrooms', type: 'restroom' },
      { zoneId: 'zone-5', density: 60, name: 'Vendor Zone 1', type: 'vendor' },
    ];
    dispatch(setCrowdData(mockCrowdData as any));
    setMapLoaded(true);
  }, [dispatch]);

  const getDensityColor = (density: number) => {
    if (density >= 80) return '#D62828';
    if (density >= 60) return '#F77F00';
    if (density >= 40) return '#E0A458';
    return '#2EC4B6';
  };

  const getDensityLabel = (density: number) => {
    if (density >= 80) return 'Very Crowded';
    if (density >= 60) return 'Crowded';
    if (density >= 40) return 'Moderate';
    return 'Low';
  };

  return (
    <div className={styles.map}>
      <div className={styles.header}>
        <h2>Venue Map</h2>
        <div className={styles.headerActions}>
          <button 
            className={`${styles.toggleBtn} ${showHeatmap ? styles.active : ''}`}
            onClick={() => setShowHeatmap(!showHeatmap)}
          >
            {showHeatmap ? '🔥' : '💤'} Heatmap
          </button>
        </div>
      </div>

      <div className={styles.mapContainer} ref={mapRef}>
        <div className={styles.venueLayout}>
          {crowdData.map((zone: any) => (
            <div
              key={zone.zoneId}
              className={`${styles.zone} ${selectedZone === zone.zoneId ? styles.selected : ''}`}
              style={{
                backgroundColor: showHeatmap ? getDensityColor(zone.density) : 'var(--color-surface)',
                opacity: showHeatmap ? 0.7 : 1
              }}
              onClick={() => setSelectedZone(zone.zoneId)}
            >
              <span className={styles.zoneName}>{zone.name}</span>
              <span className={styles.zoneDensity}>{zone.density}%</span>
            </div>
          ))}
        </div>

        {currentLocation && (
          <div className={styles.locationMarker}>
            <span className={styles.locationIcon}>📍</span>
            <span className={styles.locationPulse}></span>
          </div>
        )}

        {seatInfo && (
          <div className={styles.seatMarker}>
            <span>🎫</span>
            <span>{seatInfo.section}-{seatInfo.row}-{seatInfo.seat}</span>
          </div>
        )}
      </div>

      <div className={styles.legend}>
        <h4>Crowd Density</h4>
        <div className={styles.legendItems}>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: '#2EC4B6' }}></span>
            <span>Low (0-40%)</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: '#E0A458' }}></span>
            <span>Moderate (40-60%)</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: '#F77F00' }}></span>
            <span>Crowded (60-80%)</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: '#D62828' }}></span>
            <span>Very Crowded (80%+)</span>
          </div>
        </div>
      </div>

      {selectedZone && (
        <div className={styles.zoneDetails}>
          {crowdData.filter((z: any) => z.zoneId === selectedZone).map((zone: any) => (
            <div key={zone.zoneId} className={styles.zoneCard}>
              <div className={styles.zoneHeader}>
                <h3>{zone.name}</h3>
                <button onClick={() => setSelectedZone(null)}>×</button>
              </div>
              <div className={styles.zoneStats}>
                <div className={styles.stat}>
                  <span className={styles.statValue}>{zone.density}%</span>
                  <span className={styles.statLabel}>{getDensityLabel(zone.density)}</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statValue}>{zone.type}</span>
                  <span className={styles.statLabel}>Zone Type</span>
                </div>
              </div>
              <div className={styles.zoneActions}>
                <button onClick={() => navigate('/navigate', { state: { destination: zone.zoneId } })}>
                  🧭 Navigate
                </button>
                {zone.type === 'food' && (
                  <button onClick={() => navigate('/order')}>
                    🍔 Order Food
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VenueMap;
