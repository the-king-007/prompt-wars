import { Link } from 'react-router-dom';
import styles from './Landing.module.css';

const Landing = () => {
  return (
    <div className={styles.landing}>
      <div className={styles.background}>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>⚡</span>
          <h1 className={styles.title}>QRFlow Arena</h1>
        </div>
        
        <p className={styles.tagline}>
          Smart Venue Crowd & Demand Management
        </p>
        
        <div className={styles.features}>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>👥</span>
            <span>Real-time Crowd Tracking</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>🍔</span>
            <span>Smart Food Ordering</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>🗺️</span>
            <span>AI Navigation</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>📊</span>
            <span>Live Analytics</span>
          </div>
        </div>
        
        <Link to="/login" className={styles.ctaButton}>
          Enter Venue
        </Link>
        
        <p className={styles.poweredBy}>
          Powered by Google Cloud & Firebase
        </p>
      </div>
    </div>
  );
};

export default Landing;
