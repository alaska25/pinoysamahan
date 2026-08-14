import React, { useEffect, useMemo, useState } from 'react';
import client from '../api/client';
import MemberCard from '../components/MemberCard';
import Sunburst from '../components/Sunburst';

export default function Members() {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .get('/members')
      .then((res) => setMembers(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return members;
    return members.filter(
      (m) =>
        m.fullName.toLowerCase().includes(q) ||
        m.prefecture?.toLowerCase().includes(q) ||
        m.occupation?.toLowerCase().includes(q)
    );
  }, [members, search]);

  return (
    <div className="section">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow"><Sunburst size={14} /> Kababayan</span>
          <h1>Member Directory</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Kilalanin ang ating mga kasapi sa buong Japan. Miyembrong pumayag na
            ipakita lang ang lalabas dito.
          </p>
        </div>

        <input
          type="text"
          placeholder="Maghanap by pangalan, prefektura, o trabaho…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.search}
        />

        {loading && <p>Loading…</p>}
        {!loading && filtered.length === 0 && (
          <p style={{ color: 'var(--color-text-muted)' }}>Walang nahanap na miyembro.</p>
        )}

        <div className="grid-responsive-3" style={styles.grid}>
          {filtered.map((m) => (
            <MemberCard key={m._id} member={m} />
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  search: {
    width: '100%',
    maxWidth: 420,
    padding: '12px 16px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--color-line)',
    marginBottom: 32
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 16
  }
};
