import React, { useEffect, useState } from 'react';
import client from '../api/client';
import EventCard from '../components/EventCard';
import Sunburst from '../components/Sunburst';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('upcoming');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    client
      .get(filter === 'upcoming' ? '/events?upcoming=true' : '/events')
      .then((res) => setEvents(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <div className="section">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow"><Sunburst size={14} /> Kalendaryo</span>
          <h1>Events</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Fiestas, misa, sports fest, general assembly — dito mo makikita lahat ng
            gawain ng samahan sa buong Japan.
          </p>
        </div>

        <div style={styles.tabs}>
          <button
            className="btn"
            style={filter === 'upcoming' ? styles.tabActive : styles.tab}
            onClick={() => setFilter('upcoming')}
          >
            Paparating
          </button>
          <button
            className="btn"
            style={filter === 'all' ? styles.tabActive : styles.tab}
            onClick={() => setFilter('all')}
          >
            Lahat ng Event
          </button>
        </div>

        {loading && <p>Loading…</p>}
        {!loading && events.length === 0 && (
          <p style={{ color: 'var(--color-text-muted)' }}>Walang event dito sa ngayon.</p>
        )}

        <div style={styles.list}>
          {events.map((e) => (
            <EventCard key={e._id} event={e} />
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  tabs: { display: 'flex', gap: 10, marginBottom: 32 },
  tab: { background: 'var(--color-paper-alt)', color: 'var(--color-ink)' },
  tabActive: { background: 'var(--color-ink)', color: 'white' },
  list: { display: 'flex', flexDirection: 'column', gap: 16 }
};
