import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/useRedux';
import styles from './Navigation.module.css';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentLocation, seatInfo } = useAppSelector(state => state.user);
  const [destination, setDestination] = useState<string>('');
  const [route, setRoute] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const destinations = [
    { id: 'seat', label: 'My Seat', icon: '🎫', description: `${seatInfo?.section}-${seatInfo?.row}-${seatInfo?.seat}` },
    { id: 'restroom-1', label: 'Restroom A', icon: '🚻', distance: '150m' },
    { id: 'restroom-2', label: 'Restroom B', icon: '🚻', distance: '200m' },
    { id: 'food-court', label: 'Food Court', icon: '🍔', distance: '80m' },
    { id: 'exit-1', label: 'Exit A', icon: '🚪', distance: '100m' },
    { id: 'first-aid', label: 'First Aid', icon: '🏥', distance: '250m' },
  ];

  useEffect(() => {
    if (location.state?.destination) {
      setDestination(location.state.destination);
      calculateRoute(location.state.destination);
    }
  }, [location.state]);

  const calculateRoute = async (destId: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRoute({
      distance: '0.2 km',
      duration: '3 min',
      steps: [
        { instruction: 'Head north toward the main corridor', distance: '50m' },
        { instruction: 'Turn right at the food court entrance', distance: '80m' },
        { instruction: 'Continue straight to your destination', distance: '70m' },
      ],
      crowdLevel: 'moderate'
    });
    setLoading(false);
  };

  const handleDestinationSelect = (id: string) => {
    setDestination(id);
    calculateRoute(id);
  };

  return (
    <div className={styles.navigation}>
      <div className={styles.header}>
        <h2>Navigate</h2>
        {currentLocation && <span className={styles.locationStatus}>📍 Location active</span>}
      </div>

      <div className={styles.destinationList}>
        <h3>Where would you like to go?</h3>
        {destinations.map(dest => (
          <button
            key={dest.id}
            className={`${styles.destinationBtn} ${destination === dest.id ? styles.selected : ''}`}
            onClick={() => handleDestinationSelect(dest.id)}
          >
            <span className={styles.destIcon}>{dest.icon}</span>
            <div className={styles.destInfo}>
              <span className={styles.destLabel}>{dest.label}</span>
              <span className={styles.destDesc}>{dest.description || dest.distance}</span>
            </div>
            <span className={styles.destArrow}>→</span>
          </button>
        ))}
      </div>

      {loading && (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Calculating best route...</p>
        </div>
      )}

      {route && !loading && (
        <div className={styles.routeCard}>
          <div className={styles.routeHeader}>
            <div className={styles.routeStats}>
              <div className={styles.routeStat}>
                <span className={styles.statValue}>{route.distance}</span>
                <span className={styles.statLabel}>Distance</span>
              </div>
              <div className={styles.routeStat}>
                <span className={styles.statValue}>{route.duration}</span>
                <span className={styles.statLabel}>Est. Time</span>
              </div>
              <div className={styles.routeStat}>
                <span className={`${styles.crowdLevel} ${styles[route.crowdLevel]}`}>
                  {route.crowdLevel === 'low' ? '🟢' : route.crowdLevel === 'moderate' ? '🟡' : '🔴'}
                </span>
                <span className={styles.statLabel}>Crowd</span>
              </div>
            </div>
          </div>

          <div className={styles.routeSteps}>
            {route.steps.map((step: any, index: number) => (
              <div key={index} className={styles.routeStep}>
                <div className={styles.stepMarker}>{index + 1}</div>
                <div className={styles.stepInfo}>
                  <p>{step.instruction}</p>
                  <span>{step.distance}</span>
                </div>
              </div>
            ))}
          </div>

          <button className={styles.startNavBtn}>
            Start Navigation →
          </button>
        </div>
      )}
    </div>
  );
};

export default Navigation;
