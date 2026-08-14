import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminEvents from './AdminEvents';
import AdminNews from './AdminNews';
import AdminGallery from './AdminGallery';
import AdminMembers from './AdminMembers';
import AdminMessages from './AdminMessages';

const tabs = [
  { key: 'events', label: 'Events', Component: AdminEvents },
  { key: 'news', label: 'News', Component: AdminNews },
  { key: 'gallery', label: 'Gallery', Component: AdminGallery },
  { key: 'members', label: 'Members', Component: AdminMembers },
  { key: 'messages', label: 'Messages', Component: AdminMessages }
];

export default function AdminDashboard() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState('events');

  const ActiveComponent = tabs.find((t) => t.key === active)?.Component;

  const onLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div>
      <div style={styles.header}>
        <div className="container" style={styles.headerInner}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src="/logo.png" alt="Samahan ng Pinoy logo" style={{ width: 44, height: 44, borderRadius: '50%' }} />
            <div>
              <h2 style={{ color: 'white', margin: 0 }}>Admin Dashboard</h2>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
                Signed in as {admin?.name} ({admin?.email})
              </p>
            </div>
          </div>
          <button className="btn btn-outline" onClick={onLogout} style={{ color: 'white' }}>
            Log Out
          </button>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 32, paddingBottom: 64 }}>
        <div style={styles.tabs}>
          {tabs.map((t) => (
            <button
              key={t.key}
              className="btn"
              style={active === t.key ? styles.tabActive : styles.tab}
              onClick={() => setActive(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  );
}

const styles = {
  header: {
    background: 'var(--color-ink-deep)',
    padding: '28px 0'
  },
  headerInner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16
  },
  tabs: {
    display: 'flex',
    gap: 10,
    marginBottom: 32,
    flexWrap: 'wrap'
  },
  tab: { background: 'var(--color-paper-alt)', color: 'var(--color-ink)' },
  tabActive: { background: 'var(--color-ink)', color: 'white' }
};
