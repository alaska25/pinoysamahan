import React from 'react';

export default function MemberCard({ member }) {
  const initials = member.fullName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="card" style={styles.card}>
      {member.photoUrl ? (
        <img src={member.photoUrl} alt={member.fullName} style={styles.avatar} />
      ) : (
        <div style={styles.avatarFallback}>{initials}</div>
      )}
      <div>
        <h4 style={styles.name}>{member.fullName}</h4>
        {member.occupation && <p style={styles.meta}>{member.occupation}</p>}
        {member.prefecture && <p style={styles.meta}>📍 {member.prefecture}</p>}
      </div>
    </div>
  );
}

const styles = {
  card: {
    padding: 20,
    display: 'flex',
    alignItems: 'center',
    gap: 14
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: '50%',
    objectFit: 'cover',
    flexShrink: 0
  },
  avatarFallback: {
    width: 56,
    height: 56,
    borderRadius: '50%',
    background: 'var(--color-sun-soft)',
    color: 'var(--color-ink)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontFamily: 'var(--font-display)',
    flexShrink: 0
  },
  name: { margin: 0, fontSize: 16 },
  meta: { margin: '2px 0 0', fontSize: 13, color: 'var(--color-text-muted)' }
};
