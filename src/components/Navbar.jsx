import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const links = [
    { to: '/', label: t('nav.home'), end: true },
    { to: '/events', label: t('nav.events') },
    { to: '/news', label: t('nav.news') },
    { to: '/gallery', label: t('nav.gallery') },
    { to: '/members', label: t('nav.members') },
    { to: '/join', label: t('nav.join') },
    { to: '/contact', label: t('nav.contact') }
  ];

  return (
    <header style={styles.header}>
      <div className="container" style={styles.inner}>
        <Link to="/" style={styles.brand} onClick={() => setOpen(false)}>
          <img src="/logo.png" alt="Samahan ng Pinoy logo" style={styles.logo} />
          <span style={styles.brandText}>
            <strong style={styles.brandTitle}>Samahan ng Pinoy</strong>
            <span style={styles.brandSub}>Pinoy sa Japan</span>
          </span>
        </Link>

        <nav className={open ? 'nav-open' : ''} style={styles.nav}>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={() => setOpen(false)}
              style={({ isActive }) => ({
                ...styles.link,
                ...(isActive ? styles.linkActive : {})
              })}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div style={styles.rightGroup}>
          <LanguageSwitcher />
          <button
            className="menu-toggle-btn"
            style={styles.menuBtn}
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </header>
  );
}

const styles = {
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 40,
    background: 'var(--color-paper)',
    borderBottom: '1px solid var(--color-line)'
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 72
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 10
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: '50%',
    objectFit: 'cover'
  },
  brandText: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1.1
  },
  brandTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 17,
    color: 'var(--color-ink)'
  },
  brandSub: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: 'var(--color-red)'
  },
  nav: {
    display: 'flex',
    gap: 28
  },
  link: {
    fontSize: 14,
    fontWeight: 600,
    color: 'var(--color-text-muted)',
    paddingBottom: 4,
    borderBottom: '2px solid transparent'
  },
  linkActive: {
    color: 'var(--color-ink)',
    borderBottomColor: 'var(--color-sun)'
  },
  rightGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: 16
  },
  menuBtn: {
    display: 'none',
    background: 'none',
    border: 'none',
    fontSize: 22,
    cursor: 'pointer',
    color: 'var(--color-ink)'
  }
};