import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from './hooks/useRedux';
import Landing from './pages/Landing';
import QRLogin from './pages/QRLogin';
import TicketUpload from './pages/TicketUpload';
import VenueMap from './pages/VenueMap';
import FoodOrdering from './pages/FoodOrdering';
import Navigation from './pages/Navigation';
import Notifications from './pages/Notifications';
import AdminDashboard from './pages/AdminDashboard';
import VendorDashboard from './pages/VendorDashboard';
import Layout from './components/Layout';

function App() {
  const { isAuthenticated, user } = useAppSelector(state => state.auth);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<QRLogin />} />
      <Route path="/ticket-upload" element={<TicketUpload />} />
      
      {isAuthenticated && (
        <Route element={<Layout />}>
          <Route path="/map" element={<VenueMap />} />
          <Route path="/order" element={<FoodOrdering />} />
          <Route path="/navigate" element={<Navigation />} />
          <Route path="/notifications" element={<Notifications />} />
          
          {user?.role === 'admin' && (
            <Route path="/admin" element={<AdminDashboard />} />
          )}
          
          {user?.role === 'vendor' && (
            <Route path="/vendor" element={<VendorDashboard />} />
          )}
        </Route>
      )}
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
