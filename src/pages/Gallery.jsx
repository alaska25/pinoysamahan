import React, { useEffect, useState } from 'react';
import client from '../api/client';
import Sunburst from '../components/Sunburst';

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .get('/gallery')
      .then((res) => setImages(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="section">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow"><Sunburst size={14} /> Alaala</span>
          <h1>Photo Gallery</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Mga litrato mula sa aming mga fiesta, gathering, at outreach programs.
          </p>
        </div>

        {loading && <p>Loading…</p>}
        {!loading && images.length === 0 && (
          <p style={{ color: 'var(--color-text-muted)' }}>Wala pang larawang naka-upload.</p>
        )}

        <div style={styles.grid}>
          {images.map((img) => (
            <button
              key={img._id}
              onClick={() => setActive(img)}
              style={styles.thumbBtn}
              aria-label={`View ${img.caption || 'photo'}`}
            >
              <img src={img.imageUrl} alt={img.caption || 'Samahan ng Pinoy'} style={styles.thumb} />
            </button>
          ))}
        </div>
      </div>

      {active && (
        <div style={styles.lightbox} onClick={() => setActive(null)}>
          <div style={styles.lightboxInner} onClick={(e) => e.stopPropagation()}>
            <img src={active.imageUrl} alt={active.caption} style={styles.lightboxImg} />
            {active.caption && <p style={styles.caption}>{active.caption}</p>}
            <button className="btn btn-primary" onClick={() => setActive(null)} style={{ marginTop: 12 }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 12
  },
  thumbBtn: {
    padding: 0,
    border: 'none',
    borderRadius: 'var(--radius-md)',
    overflow: 'hidden',
    cursor: 'pointer',
    background: 'var(--color-paper-alt)',
    aspectRatio: '1 / 1'
  },
  thumb: { width: '100%', height: '100%', objectFit: 'cover' },
  lightbox: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(10,22,56,0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    zIndex: 100
  },
  lightboxInner: {
    background: 'white',
    borderRadius: 'var(--radius-md)',
    padding: 20,
    maxWidth: 640,
    textAlign: 'center'
  },
  lightboxImg: { maxHeight: '60vh', borderRadius: 8, margin: '0 auto' },
  caption: { marginTop: 12, color: 'var(--color-text-muted)' }
};
