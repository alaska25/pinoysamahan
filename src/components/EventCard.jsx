import React from 'react';

const categoryLabels = {
  fiesta: 'Fiesta',
  religious: 'Religious',
  sports: 'Sports',
  meeting: 'Meeting',
  cultural: 'Cultural',
  livelihood: 'Livelihood',
  other: 'Community'
};

export default function EventCard({ event }) {
  const date = new Date(event.date);
  const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const day = date.getDate();

  return (
    <div className="card" style={styles.card}>
      <div style={styles.dateBlock}>
        <span style={styles.month}>{month}</span>
        <span style={styles.day}>{day}</span>
      </div>
      <div style={styles.body}>
        <span className="eyebrow">{categoryLabels[event.category] || 'Community'}</span>
        <h3 style={styles.title}>{event.title}</h3>
        <p style={styles.location}>📍 {event.location}</p>
        <p style={styles.desc}>{event.description}</p>
      </div>
    </div>
  );
}

const styles = {
  card: {
    display: 'flex',
    gap: 20,
    padding: 20
  },
  dateBlock: {
    flexShrink: 0,
    width: 64,
    height: 64,
    borderRadius: 10,
    background: 'var(--color-ink)',
    color: 'var(--color-white)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  month: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    letterSpacing: '0.05em'
  },
  day: {
    fontFamily: 'var(--font-display)',
    fontSize: 24,
    fontWeight: 600,
    lineHeight: 1
  },
  body: {
    flex: 1
  },
  title: {
    fontSize: 19,
    margin: '6px 0 6px'
  },
  location: {
    fontSize: 13,
    color: 'var(--color-text-muted)',
    margin: '0 0 8px'
  },
  desc: {
    fontSize: 14,
    color: 'var(--color-text-muted)',
    margin: 0
  }
};
