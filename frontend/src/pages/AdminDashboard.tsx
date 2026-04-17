import { useState, useEffect } from 'react';
import { useAppSelector } from '../hooks/useRedux';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import styles from './AdminDashboard.module.css';

const mockCrowdData = [
  { time: '6:00', density: 20 },
  { time: '6:30', density: 35 },
  { time: '7:00', density: 55 },
  { time: '7:30', density: 70 },
  { time: '8:00', density: 85 },
  { time: '8:30', density: 90 },
  { time: '9:00', density: 95 },
];

const mockDemandData = [
  { zone: 'Section A', orders: 120 },
  { zone: 'Section B', orders: 85 },
  { zone: 'Food Court', orders: 250 },
  { zone: 'Section C', orders: 65 },
  { zone: 'Vendor 1', orders: 95 },
];

const mockVendorStatus = [
  { id: 'v1', name: 'Vendor A', status: 'available', orders: 12, location: 'Zone 1' },
  { id: 'v2', name: 'Vendor B', status: 'busy', orders: 8, location: 'Zone 2' },
  { id: 'v3', name: 'Vendor C', status: 'available', orders: 15, location: 'Zone 1' },
  { id: 'v4', name: 'Vendor D', status: 'offline', orders: 0, location: 'Zone 3' },
];

const COLORS = ['#2EC4B6', '#E0A458', '#F77F00', '#D62828'];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'crowd' | 'demand' | 'vendors'>('crowd');
  const [emergencyMessage, setEmergencyMessage] = useState('');
  const { crowdData, demandData } = useAppSelector(state => state.analytics);

  const handleBroadcast = () => {
    if (emergencyMessage.trim()) {
      alert(`Broadcast sent: ${emergencyMessage}`);
      setEmergencyMessage('');
    }
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Admin Dashboard</h1>
        <span className={styles.liveBadge}>● LIVE</span>
      </div>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>👥</span>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>8,542</span>
            <span className={styles.statLabel}>Attendees</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>🍔</span>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>1,247</span>
            <span className={styles.statLabel}>Orders</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>💰</span>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>$45,230</span>
            <span className={styles.statLabel}>Revenue</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>⏱️</span>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>12m</span>
            <span className={styles.statLabel}>Avg Wait</span>
          </div>
        </div>
      </div>

      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'crowd' ? styles.active : ''}`}
          onClick={() => setActiveTab('crowd')}
        >
          👥 Crowd Heatmap
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'demand' ? styles.active : ''}`}
          onClick={() => setActiveTab('demand')}
        >
          🍔 Demand Heatmap
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'vendors' ? styles.active : ''}`}
          onClick={() => setActiveTab('vendors')}
        >
          🚚 Vendor Tracking
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'crowd' && (
          <div className={styles.chartSection}>
            <h3>Crowd Density Over Time</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={mockCrowdData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
                <XAxis dataKey="time" stroke="#A0AEC0" />
                <YAxis stroke="#A0AEC0" />
                <Tooltip contentStyle={{ background: '#1B263B', border: 'none' }} />
                <Line type="monotone" dataKey="density" stroke="#E0A458" strokeWidth={2} dot={{ fill: '#E0A458' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeTab === 'demand' && (
          <div className={styles.chartSection}>
            <h3>Orders by Zone</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={mockDemandData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
                <XAxis dataKey="zone" stroke="#A0AEC0" />
                <YAxis stroke="#A0AEC0" />
                <Tooltip contentStyle={{ background: '#1B263B', border: 'none' }} />
                <Bar dataKey="orders" fill="#2EC4B6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeTab === 'vendors' && (
          <div className={styles.vendorSection}>
            <h3>Active Vendors</h3>
            <div className={styles.vendorList}>
              {mockVendorStatus.map(vendor => (
                <div key={vendor.id} className={styles.vendorCard}>
                  <div className={styles.vendorInfo}>
                    <span className={styles.vendorName}>{vendor.name}</span>
                    <span className={styles.vendorLocation}>📍 {vendor.location}</span>
                  </div>
                  <div className={styles.vendorStats}>
                    <span className={`${styles.vendorStatus} ${styles[vendor.status]}`}>
                      {vendor.status}
                    </span>
                    <span className={styles.vendorOrders}>{vendor.orders} orders</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={styles.emergencySection}>
        <h3>Emergency Broadcast</h3>
        <div className={styles.emergencyControls}>
          <input
            type="text"
            value={emergencyMessage}
            onChange={(e) => setEmergencyMessage(e.target.value)}
            placeholder="Enter emergency message..."
          />
          <button className={styles.broadcastBtn} onClick={handleBroadcast}>
            🚨 Broadcast
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
