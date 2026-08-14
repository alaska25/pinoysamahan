import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div className="container" style={styles.inner}>
        <div style={styles.brandCol}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/logo.png" alt="Samahan ng Pinoy logo" style={styles.logo} />
            <strong style={{ fontFamily: 'var(--font-display)', fontSize: 18 }}>
              Samahan ng Pinoy
            </strong>
          </div>
          <p style={styles.tagline}>
            Isang tahanan para sa mga Pilipino sa buong Japan — sama-sama sa tuwa, sa tulong, at sa kultura.
          </p>
        </div>

        <div style={styles.linkCol}>
          <span style={styles.colHeading}>Explore</span>
          <Link to="/events" style={styles.footerLink}>Events</Link>
          <Link to="/news" style={styles.footerLink}>News</Link>
          <Link to="/gallery" style={styles.footerLink}>Gallery</Link>
          <Link to="/members" style={styles.footerLink}>Member Directory</Link>
        </div>

        <div style={styles.linkCol}>
          <span style={styles.colHeading}>Community</span>
          <Link to="/join" style={styles.footerLink}>Join the Samahan</Link>
          <Link to="/contact" style={styles.footerLink}>Contact Us</Link>
          <Link to="/admin/login" style={styles.footerLink}>Admin Login</Link>
        </div>
      </div>

      <div className="container" style={styles.bottomBar}>
        <span>© {new Date().getFullYear()} Samahan ng Pinoy | Pinoy sa Japan</span>
        <span>Made with pagmamahal for Kababayan sa Japan</span>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    background: 'var(--color-ink-deep)',
    color: 'rgba(255,255,255,0.85)',
    marginTop: 80
  },
  inner: {
    display: 'grid',
    gridTemplateColumns: '1.4fr 1fr 1fr',
    gap: 32,
    padding: '56px 24px 32px'
  },
  brandCol: {
    maxWidth: 320
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    objectFit: 'cover'
  },
  tagline: {
    marginTop: 14,
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)'
  },
  linkCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10
  },
  colHeading: {
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--color-sun)',
    marginBottom: 4
  },
  footerLink: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)'
  },
  bottomBar: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '20px 24px',
    borderTop: '1px solid rgba(255,255,255,0.12)',
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    flexWrap: 'wrap',
    gap: 8
  }
};
