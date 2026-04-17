import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../hooks/useRedux';
import { setUser, setToken, setLoading, setError } from '../store/slices/authSlice';
import { firebaseAuth } from '../services/firebase';
import styles from './QRLogin.module.css';

const QRLogin = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'scan' | 'manual'>('scan');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [venueCode, setVenueCode] = useState('');
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (mode === 'scan' && scanning) {
      startScanner();
    }
    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [mode, scanning]);

  const startScanner = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setScanning(true);
      }
    } catch (err) {
      console.error('Camera access denied:', err);
      setMode('manual');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      const user = await firebaseAuth.signIn(email, password);
      if (user) {
        const token = await user.getIdToken();
        dispatch(setToken(token));
        dispatch(setUser({
          uid: user.uid,
          email: user.email || '',
          role: 'attendee',
          createdAt: new Date(),
          updatedAt: new Date()
        }));
        navigate('/ticket-upload');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      dispatch(setError(errorMessage));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleQRCode = (code: string) => {
    setVenueCode(code);
    setMode('manual');
  };

  return (
    <div className={styles.login}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate('/')}>←</button>
        <h2>Enter Venue</h2>
      </div>

      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${mode === 'scan' ? styles.active : ''}`}
          onClick={() => setMode('scan')}
        >
          Scan QR
        </button>
        <button 
          className={`${styles.tab} ${mode === 'manual' ? styles.active : ''}`}
          onClick={() => setMode('manual')}
        >
          Manual Entry
        </button>
      </div>

      <div className={styles.content}>
        {mode === 'scan' ? (
          <div className={styles.scanner}>
            <div className={styles.scannerFrame}>
              <video ref={videoRef} autoPlay playsInline className={styles.video} />
              <div className={styles.scanLine}></div>
            </div>
            <p className={styles.hint}>Point camera at venue QR code</p>
            <button className={styles.manualLink} onClick={() => setMode('manual')}>
              Enter manually instead
            </button>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleLogin}>
            <div className={styles.inputGroup}>
              <label htmlFor="venue">Venue Code</label>
              <input
                id="venue"
                type="text"
                value={venueCode}
                onChange={(e) => setVenueCode(e.target.value)}
                placeholder="Enter venue code"
              />
            </div>

            <div className={styles.divider}>or sign in</div>

            <div className={styles.inputGroup}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className={styles.submitBtn}>
              Enter Venue
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default QRLogin;
