import React, { useEffect, useState } from 'react';
import client from '../../api/client';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [tab, setTab] = useState('all');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    const query = tab === 'all' ? '' : `?type=${tab}`;
    client.get(`/contact${query}`).then((res) => setMessages(res.data)).finally(() => setLoading(false));
  };

  useEffect(load, [tab]);

  const markRead = async (id) => {
    await client.put(`/contact/${id}`, { status: 'read' });
    load();
  };

  const archive = async (id) => {
    await client.put(`/contact/${id}`, { status: 'archived' });
    load();
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    await client.delete(`/contact/${id}`);
    load();
  };

  return (
    <div>
      <div style={styles.tabs}>
        {['all', 'contact', 'join'].map((t) => (
          <button
            key={t}
            className="btn"
            style={tab === t ? styles.tabActive : styles.tab}
            onClick={() => setTab(t)}
          >
            {t === 'all' ? 'All' : t === 'contact' ? 'Contact Form' : 'Join Requests'}
          </button>
        ))}
      </div>

      {loading && <p>Loading…</p>}
      {!loading && messages.length === 0 && (
        <p style={{ color: 'var(--color-text-muted)' }}>No messages here yet.</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {messages.map((m) => (
          <div key={m._id} className="card" style={styles.row}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <strong>{m.name}</strong>
                <span style={styles.typeTag}>{m.type === 'join' ? 'Join' : 'Contact'}</span>
                <span style={{ ...styles.statusTag, ...(m.status === 'new' ? styles.statusNew : {}) }}>
                  {m.status}
                </span>
              </div>
              <p style={styles.meta}>{m.email} {m.phone && `· ${m.phone}`} {m.prefecture && `· ${m.prefecture}`}</p>
              <p style={styles.message}>{m.message}</p>
              <p style={styles.date}>{new Date(m.createdAt).toLocaleString()}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {m.status === 'new' && <button className="btn" onClick={() => markRead(m._id)}>Mark Read</button>}
              {m.status !== 'archived' && <button className="btn" onClick={() => archive(m._id)}>Archive</button>}
              <button className="btn btn-danger" onClick={() => remove(m._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  tabs: { display: 'flex', gap: 10, marginBottom: 24 },
  tab: { background: 'var(--color-paper-alt)', color: 'var(--color-ink)' },
  tabActive: { background: 'var(--color-ink)', color: 'white' },
  row: { padding: 18, display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' },
  meta: { fontSize: 13, color: 'var(--color-text-muted)', margin: '4px 0' },
  message: { fontSize: 14, margin: '8px 0 4px' },
  date: { fontSize: 12, color: 'var(--color-text-muted)', margin: 0 },
  typeTag: {
    fontSize: 11,
    fontFamily: 'var(--font-mono)',
    background: 'var(--color-paper-alt)',
    padding: '2px 8px',
    borderRadius: 20
  },
  statusTag: {
    fontSize: 11,
    fontFamily: 'var(--font-mono)',
    color: 'var(--color-text-muted)',
    textTransform: 'uppercase'
  },
  statusNew: {
    color: 'var(--color-red)',
    fontWeight: 600
  }
};
