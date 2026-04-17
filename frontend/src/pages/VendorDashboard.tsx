import { useState } from 'react';
import { useAppSelector } from '../hooks/useRedux';
import styles from './VendorDashboard.module.css';

const mockOrders = [
  { id: '1', items: '2x Cheeseburger, 1x Fries', total: 28.97, status: 'pending', customer: 'Section A, Row 5', time: '2m ago' },
  { id: '2', items: '1x Pepperoni Pizza, 1x Coke', total: 12.98, status: 'preparing', customer: 'Section B, Row 12', time: '5m ago' },
  { id: '3', items: '3x Hot Dog, 3x Soda', total: 23.97, status: 'ready', customer: 'Section C, Row 3', time: '8m ago' },
];

const VendorDashboard = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'stats'>('orders');
  const { currentVendor } = useAppSelector(state => state.vendor);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'var(--color-warning)';
      case 'preparing': return 'var(--color-accent)';
      case 'ready': return 'var(--color-success)';
      default: return 'var(--color-text-secondary)';
    }
  };

  const handleAcceptOrder = (orderId: string) => {
    alert(`Order ${orderId} accepted!`);
  };

  const handleCompleteOrder = (orderId: string) => {
    alert(`Order ${orderId} completed!`);
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Vendor Dashboard</h1>
        <span className={styles.vendorBadge}>🍔 Food Court A</span>
      </div>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{mockOrders.length}</span>
          <span className={styles.statLabel}>Pending Orders</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>$1,247</span>
          <span className={styles.statLabel}>Today's Revenue</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>12m</span>
          <span className={styles.statLabel}>Avg Delivery</span>
        </div>
      </div>

      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'orders' ? styles.active : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          📋 Orders
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'stats' ? styles.active : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          📊 Stats
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'orders' && (
          <div className={styles.ordersSection}>
            <h3>Active Orders</h3>
            <div className={styles.orderList}>
              {mockOrders.map(order => (
                <div key={order.id} className={styles.orderCard}>
                  <div className={styles.orderHeader}>
                    <span className={styles.orderId}>#{order.id}</span>
                    <span className={styles.orderTime}>{order.time}</span>
                  </div>
                  <div className={styles.orderItems}>
                    <p>{order.items}</p>
                  </div>
                  <div className={styles.orderLocation}>
                    <span>📍 {order.customer}</span>
                  </div>
                  <div className={styles.orderFooter}>
                    <span className={styles.orderTotal}>${order.total.toFixed(2)}</span>
                    <span 
                      className={styles.orderStatus}
                      style={{ color: getStatusColor(order.status) }}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className={styles.orderActions}>
                    {order.status === 'pending' && (
                      <button 
                        className={styles.acceptBtn}
                        onClick={() => handleAcceptOrder(order.id)}
                      >
                        Accept
                      </button>
                    )}
                    {order.status === 'preparing' && (
                      <button 
                        className={styles.readyBtn}
                        onClick={() => handleCompleteOrder(order.id)}
                      >
                        Mark Ready
                      </button>
                    )}
                    {order.status === 'ready' && (
                      <button className={styles.deliveredBtn}>
                        Mark Delivered
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className={styles.statsSection}>
            <h3>Performance Metrics</h3>
            <div className={styles.metricsGrid}>
              <div className={styles.metricCard}>
                <span className={styles.metricValue}>45</span>
                <span className={styles.metricLabel}>Orders Completed</span>
              </div>
              <div className={styles.metricCard}>
                <span className={styles.metricValue}>4.8</span>
                <span className={styles.metricLabel}>Average Rating</span>
              </div>
              <div className={styles.metricCard}>
                <span className={styles.metricValue}>11m</span>
                <span className={styles.metricLabel}>Avg Prep Time</span>
              </div>
              <div className={styles.metricCard}>
                <span className={styles.metricValue}>98%</span>
                <span className={styles.metricLabel}>On-Time Rate</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={styles.demandAlert}>
        <h3>📈 Demand Forecast</h3>
        <p>High demand expected in 15 minutes. Consider preparing extra inventory for burgers and drinks.</p>
      </div>
    </div>
  );
};

export default VendorDashboard;
