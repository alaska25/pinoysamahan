import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import Sunburst from '../components/Sunburst';
import EventCard from '../components/EventCard';
import NewsCard from '../components/NewsCard';

// Static, so define once outside the component instead of recreating it every render.
// NOTE: still using the same placeholder image for all three slots — swap these in once
// you have distinct hero images.
const HERO_IMAGES = [
  '/img/25970.jpg',
  '/img/25963.jpg',
  '/img/25966.jpg',
  '/img/25962.jpg',
  '/img/25964.jpg',
  '/img/25965.jpg',
  '/img/25968.jpg',
  '/img/25969.jpg'
];

// Copy in both languages. Add a key here + reference it via t.key below to extend.
const COPY = {
  en: {
    badgeHero: 'Pinoy in Japan — Live Network',
    heroTitle: <>Wherever you are in Japan,<br />a home is waiting for you.</>,
    heroSub: 'A vibrant community of Filipinos in Japan — where kababayan gather for festivals, support each other in times of need, and take pride in our Filipino culture together.',
    ctaJoin: 'Join the Samahan',
    ctaEvents: 'View Events',
    statLabels: ['Prefectures represented', 'Kababayan sa network', 'Events per year', 'Years of the samahan'],
    badgeUpcoming: 'Upcoming',
    eventsHeading: 'Upcoming Events',
    viewAll: 'View all →',
    noEvents: 'No upcoming events right now.',
    badgeNews: 'News',
    newsHeading: 'Latest from the Samahan',
    noNews: 'No news yet.',
    ctaHeading: 'Ready to join?',
    ctaSub: 'Joining is free. We just need a little info so we can reach you for upcoming events and news.',
    ctaJoinNow: 'Join Now',
  },
  tl: {
    badgeHero: 'Pinoy sa Japan — Live Network',
    heroTitle: <>Kahit saan ka man sa Japan,<br />may tahanang naghihintay sa iyo.</>,
    heroSub: 'Isang masiglang komunidad ng mga Pilipino sa Japan—dito nagtatagpo ang mga kababayan para sa mga pistahan, damayan sa oras ng pangangailangan, at sama-samang pagmamalaki sa ating kulturang Pinoy.',
    ctaJoin: 'Sumali sa Samahan',
    ctaEvents: 'Tingnan ang Events',
    statLabels: ['Prefectures represented', 'Kababayan sa network', 'Events kada taon', 'Taon ng samahan'],
    badgeUpcoming: 'Paparating',
    eventsHeading: 'Mga Susunod na Event',
    viewAll: 'Tingnan lahat →',
    noEvents: 'Walang paparating na event sa ngayon.',
    badgeNews: 'Balita',
    newsHeading: 'Latest sa Samahan',
    noNews: 'Wala pang balita.',
    ctaHeading: 'Handa ka na bang sumali?',
    ctaSub: 'Libre ang pagsali. Kailangan lang namin ng konting impormasyon para madali kang ma-reach para sa mga susunod na event at balita.',
    ctaJoinNow: 'Sumali Ngayon',
  },
};

// Theme tokens. Accent hues (gold/cyan/violet) stay constant across themes for brand
// consistency — only the neutrals (background, glass, ink, dot grid) invert.
const THEMES = {
  dark: {
    '--w3-void': '#05060c',
    '--w3-void-2': '#0b0e1a',
    '--w3-glass': 'rgba(255,255,255,0.045)',
    '--w3-glass-strong': 'rgba(255,255,255,0.075)',
    '--w3-glass-border': 'rgba(255,255,255,0.10)',
    '--w3-ink': '#F4F6FB',
    '--w3-muted': 'rgba(244,246,251,0.64)',
    '--w3-muted-2': 'rgba(244,246,251,0.42)',
    '--w3-dot': 'rgba(255,255,255,0.09)',
    '--w3-dot-cta': 'rgba(255,255,255,0.07)',
    '--w3-hero-ov-1': 'rgba(5,6,12,0.82)',
    '--w3-hero-ov-2': 'rgba(5,6,12,0.94)',
    '--w3-card-shadow': 'rgba(0,0,0,0.35)',
  },
  light: {
    '--w3-void': '#f5f6fb',
    '--w3-void-2': '#eceef6',
    '--w3-glass': 'rgba(10,14,30,0.035)',
    '--w3-glass-strong': 'rgba(10,14,30,0.06)',
    '--w3-glass-border': 'rgba(10,14,30,0.10)',
    '--w3-ink': '#0b0e1a',
    '--w3-muted': 'rgba(11,14,26,0.66)',
    '--w3-muted-2': 'rgba(11,14,26,0.46)',
    '--w3-dot': 'rgba(10,14,30,0.08)',
    '--w3-dot-cta': 'rgba(10,14,30,0.06)',
    '--w3-hero-ov-1': 'rgba(245,246,251,0.62)',
    '--w3-hero-ov-2': 'rgba(245,246,251,0.86)',
    '--w3-card-shadow': 'rgba(10,14,30,0.14)',
  },
};

function usePersistedState(key, fallback) {
  const [value, setValue] = useState(() => {
    try {
      return localStorage.getItem(key) || fallback;
    } catch {
      return fallback;
    }
  });
  const set = (next) => {
    setValue(next);
    try {
      localStorage.setItem(key, next);
    } catch {
      /* ignore storage errors (e.g. private mode) */
    }
  };
  return [value, set];
}

export default function Home() {
  const [events, setEvents] = useState([]);
  const [news, setNews] = useState([]);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [activeEventIndex, setActiveEventIndex] = useState(0);

  const [lang, setLang] = usePersistedState('samahan-lang', 'tl');
  const [theme, setTheme] = usePersistedState('samahan-theme', 'dark');
  const t = COPY[lang];

  // Swipe logic references for touch/mouse devices
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const isDragging = useRef(false);

  useEffect(() => {
    client.get('/events?upcoming=true')
      .then((res) => setEvents(res.data.slice(0, 6)))
      .catch((err) => console.error('Failed to load events:', err));
    client.get('/news')
      .then((res) => setNews(res.data.slice(0, 3)))
      .catch((err) => console.error('Failed to load news:', err));
  }, []);

  // 5-second automatic progression for the main hero view
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Unified Swipe Handlers for Swiping Mobile/Desktop Interactions
  const handlePointerDown = (e) => {
    isDragging.current = true;
    const x = e.clientX ?? e.touches?.[0]?.clientX;
    touchStartX.current = x;
    touchEndX.current = x;
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) return;
    touchEndX.current = e.clientX ?? e.touches?.[0]?.clientX;
  };

  const handleEventSwipeEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;

    const threshold = 50; // Required swipe distance in pixels
    const distance = touchStartX.current - touchEndX.current;

    if (distance > threshold && activeEventIndex < events.length - 1) {
      setActiveEventIndex((prev) => prev + 1); // Swiped Left -> Next Slide
    } else if (distance < -threshold && activeEventIndex > 0) {
      setActiveEventIndex((prev) => prev - 1); // Swiped Right -> Previous Slide
    }
  };

  const rootStyle = {
    ...rootVars,
    ...THEMES[theme],
  };

  return (
    <div style={rootStyle}>
      {/* Scoped fonts, keyframes, and hover/focus states that can't be expressed as inline styles */}
      <style>{globalCss}</style>

      {/* CONTROLS — theme + language, fixed so they're reachable from anywhere on the page */}
      <div style={styles.controlsWrap}>
        <div className="w3-toggle" style={styles.toggleGroup} role="group" aria-label="Theme">
          <button
            type="button"
            onClick={() => setTheme('light')}
            aria-pressed={theme === 'light'}
            className="w3-toggle-btn"
            style={{ ...styles.toggleBtn, ...(theme === 'light' ? styles.toggleBtnActive : {}) }}
            title="Light mode"
          >
            <SunIcon />
          </button>
          <button
            type="button"
            onClick={() => setTheme('dark')}
            aria-pressed={theme === 'dark'}
            className="w3-toggle-btn"
            style={{ ...styles.toggleBtn, ...(theme === 'dark' ? styles.toggleBtnActive : {}) }}
            title="Dark mode"
          >
            <MoonIcon />
          </button>
        </div>

        <div className="w3-toggle" style={styles.toggleGroup} role="group" aria-label="Language">
          <button
            type="button"
            onClick={() => setLang('en')}
            aria-pressed={lang === 'en'}
            className="w3-toggle-btn"
            style={{ ...styles.langBtn, ...(lang === 'en' ? styles.toggleBtnActive : {}) }}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLang('tl')}
            aria-pressed={lang === 'tl'}
            className="w3-toggle-btn"
            style={{ ...styles.langBtn, ...(lang === 'tl' ? styles.toggleBtnActive : {}) }}
          >
            TL
          </button>
        </div>
      </div>

      {/* SECTION 1: HERO */}
      <section style={styles.hero}>
        <div className="w3-dotgrid" style={styles.dotgrid} />
        <div className="w3-orb w3-orb-gold" style={styles.orbGold} />
        <div className="w3-orb w3-orb-cyan" style={styles.orbCyan} />

        {HERO_IMAGES.map((img, index) => (
          <div
            key={`hero-${index}`}
            style={{
              ...styles.heroBgSlide,
              backgroundImage: `linear-gradient(var(--w3-hero-ov-1), var(--w3-hero-ov-2)), url(${img})`,
              opacity: index === currentHeroIndex ? 1 : 0,
            }}
          />
        ))}

        <div className="container" style={styles.heroInner}>
          <span className="w3-badge" style={styles.badge}>
            <span className="w3-pulse-dot" style={styles.pulseDot} />
            {t.badgeHero}
          </span>

          <h1 style={styles.heroTitle}>{t.heroTitle}</h1>
          <p style={styles.heroSub}>{t.heroSub}</p>
          <div style={styles.heroActions}>
            <Link to="/join" className="w3-btn-primary" style={styles.btnPrimary}>
              {t.ctaJoin}
            </Link>
            <Link to="/events" className="w3-btn-outline" style={styles.btnOutline}>
              {t.ctaEvents}
            </Link>
          </div>

          {/* Hero Indicator — styled as confirmation ticks rather than plain dots */}
          <div style={styles.carouselDots}>
            {HERO_IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentHeroIndex(i)}
                className="w3-tick"
                style={{
                  ...styles.tick,
                  ...(i === currentHeroIndex ? styles.tickActive : {}),
                }}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: STATS — presented like on-chain network stats */}
      <section style={styles.statsSection}>
        <div className="container">
          <div style={styles.statsGrid}>
            <Stat number="47" label={t.statLabels[0]} />
            <Stat number="1,200+" label={t.statLabels[1]} />
            <Stat number="60+" label={t.statLabels[2]} />
            <Stat number="12" label={t.statLabels[3]} />
          </div>
        </div>
      </section>

      {/* SECTION 3: EVENTS SLIDER WITH MOBILE SWIPE GESTURES */}
      <section style={styles.eventsSection}>
        <div className="container">
          <div style={styles.sectionHeadRow}>
            <div>
              <span className="w3-badge" style={styles.badgeSmall}>
                <span className="w3-pulse-dot" style={styles.pulseDotSmall} />
                {t.badgeUpcoming}
              </span>
              <h2 style={styles.h2}>{t.eventsHeading}</h2>
            </div>
            <div style={styles.eventControls}>
              <Link to="/events" className="w3-link" style={styles.viewAll}>
                {t.viewAll}
              </Link>
              {events.length > 1 && (
                <div style={styles.navButtons}>
                  <button
                    onClick={() => setActiveEventIndex((prev) => Math.max(0, prev - 1))}
                    disabled={activeEventIndex === 0}
                    className="w3-navbtn"
                    style={{ ...styles.navBtn, opacity: activeEventIndex === 0 ? 0.35 : 1 }}
                    aria-label="Previous event"
                  >
                    ❮
                  </button>
                  <button
                    onClick={() => setActiveEventIndex((prev) => Math.min(events.length - 1, prev + 1))}
                    disabled={activeEventIndex === events.length - 1}
                    className="w3-navbtn"
                    style={{ ...styles.navBtn, opacity: activeEventIndex === events.length - 1 ? 0.35 : 1 }}
                    aria-label="Next event"
                  >
                    ❯
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Swipe Container Window */}
          <div
            style={styles.sliderWindow}
            onTouchStart={handlePointerDown}
            onTouchMove={handlePointerMove}
            onTouchEnd={handleEventSwipeEnd}
            onMouseDown={handlePointerDown}
            onMouseMove={handlePointerMove}
            onMouseUp={handleEventSwipeEnd}
            onMouseLeave={handleEventSwipeEnd}
          >
            {events.length === 0 && (
              <p style={styles.emptyText}>{t.noEvents}</p>
            )}
            <div
              style={{
                ...styles.sliderTrack,
                transform: `translateX(-${activeEventIndex * 100}%)`,
              }}
            >
              {events.map((e) => (
                <div key={e._id} style={styles.slideItem}>
                  <div className="w3-card" style={styles.cardFrame}>
                    <EventCard event={e} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: NEWS */}
      <section style={styles.newsSection}>
        <div className="container">
          <div style={styles.sectionHeadRow}>
            <div>
              <span className="w3-badge" style={styles.badgeSmall}>
                <span className="w3-pulse-dot" style={styles.pulseDotSmall} />
                {t.badgeNews}
              </span>
              <h2 style={styles.h2}>{t.newsHeading}</h2>
            </div>
            <Link to="/news" className="w3-link" style={styles.viewAll}>
              {t.viewAll}
            </Link>
          </div>
          <div style={styles.newsGrid}>
            {news.length === 0 && <p style={styles.emptyText}>{t.noNews}</p>}
            {news.map((n) => (
              <div key={n._id} className="w3-card" style={styles.cardFrame}>
                <NewsCard article={n} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: CTA */}
      <section style={styles.ctaSection}>
        <div className="w3-dotgrid" style={styles.dotgridCta} />
        <div className="w3-orb w3-orb-violet" style={styles.orbViolet} />
        <div className="container" style={styles.ctaPanel}>
          <div style={styles.ctaText}>
            <h2 style={styles.h2White}>{t.ctaHeading}</h2>
            <p style={styles.ctaSub}>{t.ctaSub}</p>
          </div>
          <Link to="/join" className="w3-btn-primary" style={styles.btnPrimary}>
            {t.ctaJoinNow}
          </Link>
        </div>
      </section>
    </div>
  );
}

function Stat({ number, label }) {
  return (
    <div className="w3-card" style={styles.stat}>
      <span style={styles.statNumber}>{number}</span>
      <span style={styles.statUnderline} />
      <span style={styles.statLabel}>{label}</span>
    </div>
  );
}

function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.4M12 19.1v2.4M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11z" />
    </svg>
  );
}

// Tokens that don't change with theme (accents stay constant for brand consistency).
const rootVars = {
  '--w3-gold': '#F5B301',
  '--w3-gold-2': '#FF8A3D',
  '--w3-cyan': '#3FE8D0',
  '--w3-violet': '#9C6BFF',
  fontFamily: "'Inter', -apple-system, sans-serif",
  position: 'relative',
};

const globalCss = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');

  @keyframes w3-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(63,232,208,0.55); }
    50% { box-shadow: 0 0 0 6px rgba(63,232,208,0); }
  }
  @keyframes w3-float {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(0, -22px); }
  }

  .w3-pulse-dot { animation: w3-pulse 2.2s ease-in-out infinite; }
  .w3-orb { animation: w3-float 9s ease-in-out infinite; }
  .w3-orb-cyan { animation-delay: -3s; }
  .w3-orb-violet { animation-delay: -6s; }

  .w3-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(245,179,1,0.35); }
  .w3-btn-outline:hover { background: var(--w3-glass-strong); border-color: rgba(63,232,208,0.5); }
  .w3-navbtn:hover:not(:disabled) { border-color: rgba(63,232,208,0.5); box-shadow: 0 0 0 4px rgba(63,232,208,0.12); }
  .w3-link { position: relative; }
  .w3-link:hover { color: var(--w3-cyan); }
  .w3-card { transition: border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease; }
  .w3-card:hover { border-color: rgba(63,232,208,0.4); transform: translateY(-3px); box-shadow: 0 16px 40px var(--w3-card-shadow); }
  .w3-tick { transition: all 0.3s ease; }
  .w3-toggle-btn:hover:not([aria-pressed="true"]) { color: var(--w3-ink); }

  a.w3-btn-primary, a.w3-btn-outline, a.w3-link { text-decoration: none; }

  button:focus-visible, a:focus-visible {
    outline: 2px solid var(--w3-cyan);
    outline-offset: 3px;
  }

  @media (prefers-reduced-motion: reduce) {
    .w3-pulse-dot, .w3-orb { animation: none; }
  }

  @media (max-width: 640px) {
    .w3-hero-title { font-size: 34px !important; }
  }
`;

const styles = {
  controlsWrap: {
    // Navbar is `position: sticky` with a fixed 72px height (see Navbar.jsx),
    // so anchor 14px below it rather than using an arbitrary top offset —
    // otherwise this floats on top of the nav links instead of under them.
    position: 'fixed',
    top: 'calc(72px + 14px)',
    right: 18,
    zIndex: 35, // below the navbar (40) since they no longer overlap spatially
    display: 'flex',
    gap: 10,
  },
  toggleGroup: {
    display: 'flex',
    padding: 3,
    borderRadius: 999,
    background: 'rgba(11,14,26,0.55)',
    border: '1px solid var(--w3-glass-border)',
    backdropFilter: 'blur(10px)',
  },
  toggleBtn: {
    border: 'none',
    background: 'transparent',
    width: 30,
    height: 30,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    color: 'var(--w3-muted-2)',
    cursor: 'pointer',
    transition: 'color 0.2s ease',
  },
  langBtn: {
    border: 'none',
    background: 'transparent',
    padding: '6px 14px',
    borderRadius: 999,
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.04em',
    color: 'var(--w3-muted-2)',
    cursor: 'pointer',
    transition: 'color 0.2s ease',
  },
  toggleBtnActive: {
    color: '#0a0a0a',
    background: 'linear-gradient(135deg, var(--w3-gold), var(--w3-cyan))',
  },
  hero: {
    position: 'relative',
    background: 'var(--w3-void)',
    color: 'var(--w3-ink)',
    overflow: 'hidden',
    minHeight: '82dvh',
  },
  dotgrid: {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'radial-gradient(var(--w3-dot) 1px, transparent 1px)',
    backgroundSize: '26px 26px',
    WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 30% 20%, black 0%, transparent 75%)',
    maskImage: 'radial-gradient(ellipse 70% 60% at 30% 20%, black 0%, transparent 75%)',
    zIndex: 1,
    pointerEvents: 'none',
  },
  dotgridCta: {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'radial-gradient(var(--w3-dot-cta) 1px, transparent 1px)',
    backgroundSize: '24px 24px',
    zIndex: 0,
    pointerEvents: 'none',
  },
  orbGold: {
    position: 'absolute',
    top: '-120px',
    right: '-80px',
    width: 420,
    height: 420,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(245,179,1,0.22), transparent 70%)',
    filter: 'blur(10px)',
    zIndex: 1,
    pointerEvents: 'none',
  },
  orbCyan: {
    position: 'absolute',
    bottom: '-140px',
    left: '-100px',
    width: 380,
    height: 380,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(63,232,208,0.16), transparent 70%)',
    filter: 'blur(10px)',
    zIndex: 1,
    pointerEvents: 'none',
  },
  orbViolet: {
    position: 'absolute',
    top: '-100px',
    right: '10%',
    width: 320,
    height: 320,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(156,107,255,0.20), transparent 70%)',
    filter: 'blur(10px)',
    zIndex: 0,
    pointerEvents: 'none',
  },
  heroBgSlide: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    transition: 'opacity 1s ease-in-out',
    pointerEvents: 'none',
    zIndex: 0,
  },
  heroInner: {
    position: 'relative',
    padding: '16vh 24px 12vh',
    maxWidth: 700,
    zIndex: 2,
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 9,
    padding: '7px 14px',
    borderRadius: 999,
    background: 'var(--w3-glass)',
    border: '1px solid var(--w3-glass-border)',
    backdropFilter: 'blur(8px)',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: 'var(--w3-muted)',
  },
  badgeSmall: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '5px 12px',
    borderRadius: 999,
    background: 'var(--w3-glass)',
    border: '1px solid var(--w3-glass-border)',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: 'var(--w3-cyan)',
    marginBottom: 10,
  },
  pulseDot: {
    width: 7,
    height: 7,
    borderRadius: '50%',
    background: 'var(--w3-cyan)',
    display: 'inline-block',
  },
  pulseDotSmall: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: 'var(--w3-cyan)',
    display: 'inline-block',
  },
  heroTitle: {
    fontFamily: "'Sora', sans-serif",
    fontWeight: 700,
    color: 'var(--w3-ink)',
    fontSize: 'clamp(36px, 5.2vw, 58px)',
    lineHeight: 1.12,
    margin: '20px 0 20px',
    letterSpacing: '-0.01em',
  },
  heroSub: {
    fontSize: 17,
    color: 'var(--w3-muted)',
    maxWidth: 540,
    lineHeight: 1.6,
  },
  heroActions: {
    display: 'flex',
    gap: 14,
    marginTop: 30,
    flexWrap: 'wrap',
  },
  btnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '13px 26px',
    borderRadius: 12,
    fontFamily: "'Sora', sans-serif",
    fontWeight: 600,
    fontSize: 15,
    color: '#0a0a0a',
    background: 'linear-gradient(135deg, var(--w3-gold), var(--w3-gold-2))',
    boxShadow: '0 8px 24px rgba(245,179,1,0.25)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  btnOutline: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '13px 26px',
    borderRadius: 12,
    fontFamily: "'Sora', sans-serif",
    fontWeight: 600,
    fontSize: 15,
    color: 'var(--w3-ink)',
    background: 'var(--w3-glass)',
    border: '1px solid var(--w3-glass-border)',
    backdropFilter: 'blur(8px)',
    transition: 'background 0.2s ease, border-color 0.2s ease',
  },
  carouselDots: {
    display: 'flex',
    gap: 8,
    marginTop: 44,
  },
  tick: {
    width: 26,
    height: 4,
    borderRadius: 2,
    border: 'none',
    cursor: 'pointer',
    background: 'var(--w3-glass-strong)',
  },
  tickActive: {
    background: 'linear-gradient(90deg, var(--w3-gold), var(--w3-cyan))',
    boxShadow: '0 0 12px rgba(63,232,208,0.5)',
  },
  statsSection: {
    background: 'var(--w3-void-2)',
    padding: '72px 0',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: 18,
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    padding: '24px 22px',
    borderRadius: 14,
    background: 'var(--w3-glass)',
    border: '1px solid var(--w3-glass-border)',
  },
  statNumber: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 34,
    fontWeight: 600,
    color: 'var(--w3-ink)',
  },
  statUnderline: {
    display: 'block',
    width: 30,
    height: 3,
    borderRadius: 2,
    background: 'linear-gradient(90deg, var(--w3-gold), var(--w3-cyan))',
  },
  statLabel: {
    fontSize: 13,
    color: 'var(--w3-muted-2)',
    letterSpacing: '0.01em',
  },
  eventsSection: {
    background: 'var(--w3-void)',
    padding: '84px 0',
  },
  newsSection: {
    background: 'var(--w3-void)',
    padding: '84px 0',
  },
  sectionHeadRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 32,
    flexWrap: 'wrap',
    gap: 14,
  },
  h2: {
    fontFamily: "'Sora', sans-serif",
    fontWeight: 700,
    fontSize: 30,
    color: 'var(--w3-ink)',
    margin: 0,
    letterSpacing: '-0.01em',
  },
  h2White: {
    fontFamily: "'Sora', sans-serif",
    fontWeight: 700,
    fontSize: 32,
    color: 'var(--w3-ink)',
    margin: '0 0 10px',
  },
  eventControls: {
    display: 'flex',
    alignItems: 'center',
    gap: 20,
  },
  navButtons: {
    display: 'flex',
    gap: 8,
  },
  navBtn: {
    background: 'var(--w3-glass)',
    border: '1px solid var(--w3-glass-border)',
    width: 42,
    height: 42,
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--w3-ink)',
    fontWeight: 'bold',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  },
  viewAll: {
    fontSize: 14,
    fontWeight: 600,
    color: 'var(--w3-gold)',
    transition: 'color 0.2s ease',
  },
  sliderWindow: {
    overflow: 'hidden',
    width: '100%',
    cursor: 'grab',
    touchAction: 'pan-y',
  },
  sliderTrack: {
    display: 'flex',
    transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
    width: '100%',
  },
  slideItem: {
    minWidth: '100%',
    boxSizing: 'border-box',
    padding: '4px',
    userSelect: 'none',
  },
  cardFrame: {
    borderRadius: 16,
    border: '1px solid var(--w3-glass-border)',
    background: 'var(--w3-glass)',
    padding: 4,
    overflow: 'hidden',
  },
  emptyText: {
    color: 'var(--w3-muted-2)',
  },
  newsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
    gap: 20,
  },
  ctaSection: {
    position: 'relative',
    background: 'var(--w3-void-2)',
    color: 'var(--w3-ink)',
    overflow: 'hidden',
  },
  ctaPanel: {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 28,
    flexWrap: 'wrap',
    padding: '64px 32px',
    margin: '40px auto',
    maxWidth: 1040,
    borderRadius: 20,
    background: 'var(--w3-glass)',
    border: '1px solid var(--w3-glass-border)',
    backdropFilter: 'blur(10px)',
  },
  ctaText: {
    maxWidth: 480,
  },
  ctaSub: {
    color: 'var(--w3-muted)',
    lineHeight: 1.6,
    margin: 0,
  },
};