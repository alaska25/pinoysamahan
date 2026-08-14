import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import Sunburst from '../components/Sunburst';
import EventCard from '../components/EventCard';
import NewsCard from '../components/NewsCard';

export default function Home() {
  const [events, setEvents] = useState([]);
  const [news, setNews] = useState([]);

  useEffect(() => {
    client.get('/events?upcoming=true').then((res) => setEvents(res.data.slice(0, 3))).catch(() => {});
    client.get('/news').then((res) => setNews(res.data.slice(0, 3))).catch(() => {});
  }, []);

  return (
    <div>
      <section style={styles.hero}>
        <div style={styles.rays}>
          <Sunburst size={520} color="rgba(240,169,0,0.10)" />
        </div>
        <div className="container" style={styles.heroInner}>
          <img src="/logo.png" alt="Samahan ng Pinoy | Pinoy sa Japan official logo" style={styles.heroLogo} />
          <span className="eyebrow" style={{ color: 'var(--color-sun)' }}>
            <Sunburst size={16} /> Samahan ng Pinoy — Pinoy sa Japan
          </span>
          <h1 style={styles.heroTitle}>
            Kahit saan sa Japan,<br />may bahay ka sa amin.
          </h1>
          <p style={styles.heroSub}>
            Isang komunidad ng mga Pilipino sa Japan — dito nagtatagpo ang mga kababayan
            para sa fiesta, tulong sa isa't isa, at pagmamalaki sa ating kultura.
          </p>
          <div style={styles.heroActions}>
            <Link to="/join" className="btn btn-primary">Sumali sa Samahan</Link>
            <Link to="/events" className="btn btn-outline" style={{ color: 'white' }}>
              Tingnan ang Events
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid-responsive-4" style={styles.statsGrid}>
            <Stat number="47" label="Prefectures represented" />
            <Stat number="1,200+" label="Kababayan sa network" />
            <Stat number="60+" label="Events kada taon" />
            <Stat number="12" label="Taon ng samahan" />
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--color-paper-alt)' }}>
        <div className="container">
          <div style={styles.sectionHeadRow}>
            <div className="section-header" style={{ marginBottom: 0 }}>
              <span className="eyebrow"><Sunburst size={14} /> Paparating</span>
              <h2>Mga Susunod na Event</h2>
            </div>
            <Link to="/events" style={styles.viewAll}>Tingnan lahat →</Link>
          </div>
          <div style={styles.list}>
            {events.length === 0 && <p style={{ color: 'var(--color-text-muted)' }}>Walang paparating na event sa ngayon.</p>}
            {events.map((e) => (
              <EventCard key={e._id} event={e} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={styles.sectionHeadRow}>
            <div className="section-header" style={{ marginBottom: 0 }}>
              <span className="eyebrow"><Sunburst size={14} /> Balita</span>
              <h2>Latest sa Samahan</h2>
            </div>
            <Link to="/news" style={styles.viewAll}>Tingnan lahat →</Link>
          </div>
          <div className="grid-responsive-3" style={styles.newsGrid}>
            {news.length === 0 && <p style={{ color: 'var(--color-text-muted)' }}>Wala pang balita.</p>}
            {news.map((n) => (
              <NewsCard key={n._id} article={n} />
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--color-ink-deep)', color: 'white' }}>
        <div className="container" style={styles.ctaInner}>
          <div>
            <h2 style={{ color: 'white' }}>Handa ka na bang sumali?</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 480 }}>
              Libre ang pagsali. Kailangan lang namin ng konting impormasyon para
              madali kang ma-reach para sa mga susunod na event at balita.
            </p>
          </div>
          <Link to="/join" className="btn btn-primary">Sumali Ngayon</Link>
        </div>
      </section>
    </div>
  );
}

function Stat({ number, label }) {
  return (
    <div style={styles.stat}>
      <span style={styles.statNumber}>{number}</span>
      <span style={styles.statLabel}>{label}</span>
    </div>
  );
}

const styles = {
  hero: {
    position: 'relative',
    background: 'var(--color-ink)',
    color: 'white',
    overflow: 'hidden'
  },
  rays: {
    position: 'absolute',
    top: '-180px',
    right: '-160px',
    pointerEvents: 'none'
  },
  heroInner: {
    position: 'relative',
    padding: '110px 24px 96px',
    maxWidth: 680
  },
  heroLogo: {
    width: 96,
    height: 96,
    borderRadius: '50%',
    marginBottom: 20,
    boxShadow: '0 8px 24px rgba(0,0,0,0.35)'
  },
  heroTitle: {
    color: 'white',
    fontSize: 'clamp(34px, 5vw, 56px)',
    margin: '18px 0 20px'
  },
  heroSub: {
    fontSize: 17,
    color: 'rgba(255,255,255,0.75)',
    maxWidth: 520
  },
  heroActions: {
    display: 'flex',
    gap: 14,
    marginTop: 28,
    flexWrap: 'wrap'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 24,
    textAlign: 'center'
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4
  },
  statNumber: {
    fontFamily: 'var(--font-display)',
    fontSize: 36,
    fontWeight: 600,
    color: 'var(--color-ink)'
  },
  statLabel: {
    fontSize: 13,
    color: 'var(--color-text-muted)'
  },
  sectionHeadRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 28,
    flexWrap: 'wrap',
    gap: 12
  },
  viewAll: {
    fontSize: 14,
    fontWeight: 600,
    color: 'var(--color-red)'
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16
  },
  newsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 24
  },
  ctaInner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 24,
    flexWrap: 'wrap'
  }
};
