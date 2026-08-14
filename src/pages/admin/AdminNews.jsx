import React, { useEffect, useState } from 'react';
import client from '../../api/client';

const empty = { title: '', summary: '', body: '', imageUrl: '', tags: '', published: true };

export default function AdminNews() {
  const [news, setNews] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    client.get('/news?all=true').then((res) => setNews(res.data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    const payload = {
      ...form,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean)
    };
    try {
      if (editingId) {
        await client.put(`/news/${editingId}`, payload);
        setStatus({ type: 'success', text: 'Article updated.' });
      } else {
        await client.post('/news', payload);
        setStatus({ type: 'success', text: 'Article published.' });
      }
      setForm(empty);
      setEditingId(null);
      load();
    } catch (err) {
      setStatus({ type: 'error', text: err.response?.data?.message || 'Could not save article.' });
    }
  };

  const onEdit = (n) => {
    setEditingId(n._id);
    setForm({
      title: n.title,
      summary: n.summary,
      body: n.body,
      imageUrl: n.imageUrl || '',
      tags: (n.tags || []).join(', '),
      published: n.published
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this article?')) return;
    await client.delete(`/news/${id}`);
    load();
  };

  const onCancel = () => {
    setEditingId(null);
    setForm(empty);
    setStatus(null);
  };

  return (
    <div style={styles.wrap}>
      <form className="card" style={styles.form} onSubmit={onSubmit}>
        <h3 style={{ marginTop: 0 }}>{editingId ? 'Edit Article' : 'New Article'}</h3>
        {status && (
          <div className={`status-message ${status.type === 'success' ? 'status-success' : 'status-error'}`}>
            {status.text}
          </div>
        )}
        <div className="form-field">
          <label>Title</label>
          <input name="title" required value={form.title} onChange={onChange} />
        </div>
        <div className="form-field">
          <label>Summary</label>
          <textarea name="summary" rows={2} required value={form.summary} onChange={onChange} />
        </div>
        <div className="form-field">
          <label>Body</label>
          <textarea name="body" rows={6} required value={form.body} onChange={onChange} />
        </div>
        <div className="form-field">
          <label>Image URL (optional)</label>
          <input name="imageUrl" value={form.imageUrl} onChange={onChange} placeholder="https://…" />
        </div>
        <div className="form-field">
          <label>Tags (comma-separated)</label>
          <input name="tags" value={form.tags} onChange={onChange} placeholder="fiesta, tokyo, announcement" />
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, fontSize: 14 }}>
          <input type="checkbox" name="published" checked={form.published} onChange={onChange} />
          Published (visible to public)
        </label>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" type="submit">{editingId ? 'Save Changes' : 'Publish Article'}</button>
          {editingId && <button type="button" className="btn" onClick={onCancel}>Cancel</button>}
        </div>
      </form>

      <div>
        <h3>All Articles {loading ? '' : `(${news.length})`}</h3>
        {loading && <p>Loading…</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {news.map((n) => (
            <div key={n._id} className="card" style={styles.row}>
              <div>
                <strong>{n.title}</strong>{' '}
                {!n.published && <span style={styles.draftTag}>Draft</span>}
                <p style={styles.meta}>{new Date(n.createdAt).toLocaleDateString()}</p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn" onClick={() => onEdit(n)}>Edit</button>
                <button className="btn btn-danger" onClick={() => onDelete(n._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrap: { display: 'grid', gridTemplateColumns: '380px 1fr', gap: 32, alignItems: 'flex-start' },
  form: { padding: 24, position: 'sticky', top: 96 },
  row: { padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' },
  meta: { margin: '4px 0 0', fontSize: 13, color: 'var(--color-text-muted)' },
  draftTag: {
    fontSize: 11,
    fontFamily: 'var(--font-mono)',
    background: 'var(--color-sun-soft)',
    color: 'var(--color-ink)',
    padding: '2px 8px',
    borderRadius: 20
  }
};
