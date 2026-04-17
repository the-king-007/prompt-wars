import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../hooks/useRedux';
import { setSeatInfo, setTicketValidated } from '../store/slices/userSlice';
import styles from './TicketUpload.module.css';

const TicketUpload = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [ticketFile, setTicketFile] = useState<File | null>(null);
  const [section, setSection] = useState('');
  const [row, setRow] = useState('');
  const [seat, setSeat] = useState('');
  const [validating, setValidating] = useState(false);
  const [validated, setValidated] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setTicketFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTicketFile(e.target.files[0]);
    }
  };

  const handleValidate = async () => {
    setValidating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    dispatch(setSeatInfo({ section, row, seat }));
    dispatch(setTicketValidated(true));
    setValidated(true);
    setValidating(false);
  };

  const handleContinue = () => {
    navigate('/map');
  };

  return (
    <div className={styles.upload}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate('/login')}>←</button>
        <h2>Validate Ticket</h2>
      </div>

      <div className={styles.content}>
        <div 
          className={`${styles.dropzone} ${dragActive ? styles.active : ''} ${ticketFile ? styles.hasFile : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            className={styles.fileInput}
          />
          {ticketFile ? (
            <div className={styles.filePreview}>
              <span className={styles.fileIcon}>📄</span>
              <span className={styles.fileName}>{ticketFile.name}</span>
              <span className={styles.changeFile}>Change</span>
            </div>
          ) : (
            <div className={styles.uploadPrompt}>
              <span className={styles.uploadIcon}>📷</span>
              <p>Tap to upload ticket</p>
              <span className={styles.uploadHint}>or drag and drop</span>
            </div>
          )}
        </div>

        <div className={styles.seatForm}>
          <h3>Seat Information</h3>
          <div className={styles.seatGrid}>
            <div className={styles.inputGroup}>
              <label>Section</label>
              <input
                type="text"
                value={section}
                onChange={(e) => setSection(e.target.value)}
                placeholder="A"
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Row</label>
              <input
                type="text"
                value={row}
                onChange={(e) => setRow(e.target.value)}
                placeholder="1"
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Seat</label>
              <input
                type="text"
                value={seat}
                onChange={(e) => setSeat(e.target.value)}
                placeholder="12"
              />
            </div>
          </div>
        </div>

        {validated ? (
          <div className={styles.successCard}>
            <span className={styles.successIcon}>✓</span>
            <p>Ticket Validated Successfully!</p>
          </div>
        ) : (
          <button 
            className={styles.validateBtn}
            onClick={handleValidate}
            disabled={validating || !ticketFile || !section || !row || !seat}
          >
            {validating ? 'Validating...' : 'Validate Ticket'}
          </button>
        )}

        {validated && (
          <button className={styles.continueBtn} onClick={handleContinue}>
            Continue to Venue Map →
          </button>
        )}
      </div>
    </div>
  );
};

export default TicketUpload;
