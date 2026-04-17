import { useAppSelector, useAppDispatch } from '../hooks/useRedux';
import { markNotificationRead } from '../store/slices/userSlice';
import styles from './Notifications.module.css';

const Notifications = () => {
  const dispatch = useAppDispatch();
  const { notifications } = useAppSelector(state => state.user);

  const mockNotifications = [
    { id: '1', type: 'crowd', title: 'Crowd Alert', message: 'High crowd density in Section A. Consider alternative routes.', timestamp: new Date(), read: false },
    { id: '2', type: 'order', title: 'Order Ready', message: 'Your order #1234 is ready for pickup!', timestamp: new Date(Date.now() - 300000), read: false },
    { id: '3', type: 'general', title: 'Welcome', message: 'Welcome to QRFlow Arena! Enjoy the event.', timestamp: new Date(Date.now() - 600000), read: true },
  ];

  const displayNotifications = notifications.length > 0 ? notifications : mockNotifications;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'crowd': return '⚠️';
      case 'order': return '📦';
      case 'emergency': return '🚨';
      default: return '📢';
    }
  };

  const getTypeClass = (type: string) => {
    switch (type) {
      case 'crowd': return styles.crowd;
      case 'order': return styles.order;
      case 'emergency': return styles.emergency;
      default: return styles.general;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const handleMarkRead = (id: string) => {
    dispatch(markNotificationRead(id));
  };

  return (
    <div className={styles.notifications}>
      <div className={styles.header}>
        <h2>Notifications</h2>
        <span className={styles.count}>{displayNotifications.filter(n => !n.read).length} new</span>
      </div>

      <div className={styles.list}>
        {displayNotifications.map(notification => (
          <div 
            key={notification.id} 
            className={`${styles.notification} ${notification.read ? styles.read : ''} ${getTypeClass(notification.type)}`}
            onClick={() => handleMarkRead(notification.id)}
          >
            <span className={styles.icon}>{getTypeIcon(notification.type)}</span>
            <div className={styles.content}>
              <div className={styles.titleRow}>
                <h3>{notification.title}</h3>
                <span className={styles.time}>{formatTime(notification.timestamp)}</span>
              </div>
              <p>{notification.message}</p>
            </div>
            {!notification.read && <span className={styles.unreadDot}></span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
