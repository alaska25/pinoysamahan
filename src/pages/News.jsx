import React, { useEffect, useState } from 'react';
import client from '../api/client';
import NewsCard from '../components/NewsCard';
import Sunburst from '../components/Sunburst';

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .get('/news')
      .then((res) => setNews(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="section">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow"><Sunburst size={14} /> Balita</span>
          <h1>News &amp; Announcements</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Mga update mula sa samahan — bagong programa, tulong sa kababayan, at mga
            paalala.
          </p>
        </div>

        {loading && <p>Loading…</p>}
        {!loading && news.length === 0 && (
          <p style={{ color: 'var(--color-text-muted)' }}>Wala pang balitang nai-post.</p>
        )}

        <div className="grid-responsive-3" style={styles.grid}>
          {news.map((n) => (
            <NewsCard key={n._id} article={n} />
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }
};
