import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Layout.module.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  const navItems = [
    { path: '/map', label: 'Map', icon: '🗺️' },
    { path: '/order', label: 'Order', icon: '🍔' },
    { path: '/navigate', label: 'Navigate', icon: '🧭' },
    { path: '/notifications', label: 'Alerts', icon: '🔔' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={styles.layout}>
      <main className={styles.main}>
        {children}
      </main>
      <nav className={styles.bottomNav}>
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`${styles.navItem} ${isActive(item.path) ? styles.active : ''}`}
          >
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.label}>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
